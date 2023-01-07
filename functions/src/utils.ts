exports.updateUserCredits = async function (
  uid: string,
  credits: number,
  chargeId: string,
  orderId: string,
  firestore: any,
  admin: any
) {
  // prepare a batch update
  let batch = firestore.batch();

  // check if the user has a doc in the users collection
  console.log("Checking user doc");
  const userRef = firestore.collection("users").doc(uid);
  const userDoc = await userRef.get();
  console.log("Got user doc. exists =", userDoc.exists);
  if (userDoc.exists) {
    // update the user's credits
    console.log("Updating user's credits");
    batch.update(firestore.collection("users").doc(uid), {
      credits: admin.firestore.FieldValue.increment(credits),
    });
  } else {
    console.log("Creating user's doc");
    batch.set(firestore.collection("users").doc(uid), {
      // create the user doc with the credits
      credits: credits,
    });
  }

  // get a ref to the charge
  console.log("Checking charge doc");
  const chargeRef = firestore
    .collection("users")
    .doc(uid)
    .collection("charges")
    .doc(chargeId);

  // check if this charge has already been processed
  const chargeDoc = await chargeRef.get();
  if (chargeDoc.exists) {
    console.log("Charge already exists");
  } else {
    // store the charge as a doc within the charges subcollection
    console.log("Storing charge");
    batch.set(
      firestore
        .collection("users")
        .doc(uid)
        .collection("charges")
        .doc(chargeId),
      {
        credits: credits,
        order: orderId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      }
    );
  }

  // commit the batch
  console.log("Committing batch");
  return batch.commit().then(function () {
    console.log("Firestore updated");
  });
};

exports.storeUserSubscription = async function (
  uid: string,
  subscriptionId: string,
  firestore: any
) {
  // store the subscription id for the user
  // use this when a user logs in to check if they have
  // monthly credits due (see functions/src/credit-handling.ts)

  const currentDateUTC = new Date();
  let currentMonth = currentDateUTC.getUTCMonth();
  currentMonth++; // getUTCMonth is 0-11, we want 1-12
  const currentYear = currentDateUTC.getUTCFullYear();

  // get params from remote config
  const template = await remoteConfig.getTemplate();
  const subscriptionMonthlyCredits = parseInt(
    template.parameters.subscription_monthly_credits.defaultValue.value
  );

  console.log("storing new user subscription");
  console.log("uid", uid);
  console.log("subscriptionId", subscriptionId);
  console.log("currentMonth", currentMonth);
  console.log("currentYear", currentYear);

  const userRef = firestore.collection("users").doc(uid);
  await userRef.set(
    {
      subscriptionId: subscriptionId,
      subscriptionStartMonth: currentMonth,
      subscriptionStartYear: currentYear,
      subscriptionMonthlyCredits: subscriptionMonthlyCredits,
    },
    { merge: true }
  );
};

exports.checkMonthlyCreditsAllocated = async function (
  uid: string,
  startMonth: number,
  startYear: number,
  monthlyCredits: number,
  maxMonths: number | null,
  creditsCollectionName: string, // eg. "access_credits" or "subscription_credits"
  userRef: any,
  firestore: any,
  admin: any
) {
  // check every month between fromMonth/fromYear to now
  // and if credits havent been allocated, allocate them
  // this is used for Access Pass NFT holders and stripe subscribers
  // if max months is set, stop allocating credits after that many months
  // (for access pass holders who only get X months of credits)
  {
    let totalNewCredits = 0;

    const currentDateUTC = new Date();
    let currentMonth = currentDateUTC.getUTCMonth();
    currentMonth++; // getUTCMonth is 0-11, we want 1-12
    const currentYear = currentDateUTC.getUTCFullYear();

    let monthsProcessed = 0; // once this hits NUM_MONTHS, stop processing
    for (let y = startYear; y <= currentYear; y++) {
      // determine the month to start at
      let m;
      if (y === startYear) {
        m = startMonth;
      } else {
        m = 1; // calendar month, not index
      }
      // iterate through the months of this year
      // and see if credits have been allocated
      for (; m <= 12; m++) {
        if (y === currentYear && m > currentMonth) {
          break; // dont check future months
        }
        if (maxMonths && monthsProcessed >= maxMonths) {
          // once processed NUM_MONTHS valid months, stop processing
          break;
        }
        const docId = `${y}-${m}`;
        console.log("checking", docId);
        const monthRef = firestore
          .collection("users")
          .doc(uid)
          .collection(creditsCollectionName)
          .doc(docId);
        const monthSnap = await monthRef.get();
        if (!monthSnap.exists) {
          // month doesnt exist, store it (so we dont process it again next time)
          console.log("allocating monthly credits", uid, docId);
          await monthRef.set(
            {
              credits: monthlyCredits,
              receivedAt: currentDateUTC.toUTCString(),
            },
            { merge: true }
          );
          totalNewCredits += monthlyCredits;
        }
        // increment monthsProcessed
        monthsProcessed++;
      }
    }
    // increment the users total credit count by the amount of monthly credits
    // allocated in the above loop
    console.log("updating credits", uid, totalNewCredits);
    await userRef.set(
      { credits: admin.firestore.FieldValue.increment(totalNewCredits) },
      { merge: true }
    );
  }
};
