// @ts-ignore (block scoping errors are irrelevant)
const { admin, firestore, remoteConfig, auth } = require("./firebase.ts");
const { checkMonthlyCreditsAllocated } = require("./utils.ts");

exports.checkGiftedCredits = async function (req, res) {
  const { uid, walletAddress } = JSON.parse(req.body);
  console.log("checking gifted credits", uid, walletAddress);

  // TODO check that the uid's username == the wallet
  // since username is stored as wallet address on sign-up
  // this would prevent api calls with the wrong wallet addr

  if (!uid || !walletAddress) {
    console.log("missing uid or walletAddress");
    throw new Error("Missing uid or walletAddress");
  }

  // get user doc
  console.log("getting users doc", uid);
  const userRef = firestore.collection("users").doc(uid);
  const userSnap = await userRef.get();

  // check for gifted credits
  console.log("getting wallet credits", walletAddress);
  let walletCreditsRef = firestore
    .collection("wallet_credits")
    .doc(walletAddress);
  let walletCreditsSnap = await walletCreditsRef.get();

  if (!walletCreditsSnap.exists) {
    // try lower case wallet (in case some get stored this way)
    walletCreditsRef = firestore
      .collection("wallet_credits")
      .doc(walletAddress.toLowerCase());
    walletCreditsSnap = await walletCreditsRef.get();
  }

  // check it exists
  if (walletCreditsSnap.exists) {
    const data = walletCreditsSnap.data();
    console.log("new gifted wallet credits", data);
    let { credits, nextGiftId } = data;
    if (!nextGiftId) {
      nextGiftId = 1;
    }

    if (credits > 0) {
      // update user credits
      let newCredits; // new total credits
      if (userSnap.exists) {
        // user already has credits, increment
        const userData = userSnap.data();
        newCredits = userData.credits + credits;
      } else {
        // user doesnt have a db entry yet, set credits
        newCredits = credits;
      }
      // add credits to the users doc (uid is the doc id)
      console.log("updating user credits", newCredits);
      await userRef.set({ credits: newCredits }, { merge: true });
      await walletCreditsRef.set(
        { credits: 0, nextGiftId: nextGiftId + 1 },
        { merge: true }
      );
      // store a record of the gift (as we do for charges and access subs)
      //  as the next number (total length of existing gifts)
      const timestampStr = new Date().toUTCString();
      const giftRef = firestore
        .collection("users")
        .doc(uid)
        .collection("gifts")
        .doc(String(nextGiftId));
      await giftRef.set({ credits, receivedAt: timestampStr }, { merge: true });
    }
  } else {
    console.log("no wallet credits");
  }
};

exports.checkAccessCredits = async function (req, res) {
  const { uid, walletAddress, hasAccess } = JSON.parse(req.body);

  // TODO check that the uid's username == the wallet
  // since username is stored as wallet address on sign-up
  // this would prevent api calls with the wrong wallet addr

  if (!uid || !walletAddress) {
    console.log("missing uid or walletAddress");
    throw new Error("Missing uid or walletAddress");
  }

  // get params from remote config
  const template = await remoteConfig.getTemplate();

  const accessSubscriptionLength = parseInt(
    template.parameters.access_subscription_length.defaultValue.value
  );

  const accessMonthlyCredits = parseInt(
    template.parameters.access_monthly_credits.defaultValue.value
  );

  // get user doc
  console.log("getting users doc", uid);
  const userRef = firestore.collection("users").doc(uid);
  const userSnap = await userRef.get();

  // check Access Pass monthly subscription
  // if theyre in a new month, assign them their new credits
  // subscription starts from first login as access, not mint date
  // this all relies on hasAccess flag sent from frontend (which has checked wallet)
  let processNewAccessPass = false; // flag to create new user doc if needed

  if (hasAccess) {
    if (userSnap.exists) {
      const data = userSnap.data();
      if (data.accessStartDate) {
        // if the access start date has been set
        // this user has been processed as a access holder already
        const accessStartDate = data.accessStartDate;
        const accessStartDateUTC = new Date(accessStartDate);
        let accessStartMonth = accessStartDateUTC.getUTCMonth();
        accessStartMonth = accessStartMonth + 1; // indexes from 0, get as calendar month
        const accessStartYear = accessStartDateUTC.getUTCFullYear();

        console.log("access start date", accessStartDate);
        console.log("access start month", accessStartMonth);
        console.log("access start year", accessStartYear);

        await checkMonthlyCreditsAllocated(
          uid,
          accessStartMonth,
          accessStartYear,
          accessMonthlyCredits, // monthlyCredits
          accessSubscriptionLength, // maxMonths
          "access_credits", // creditsCollectionName
          userRef,
          firestore,
          admin
        );
      } else {
        // user is already in the db but hasnt been processed as a access yet
        processNewAccessPass = true;
      }
    } else {
      // user is not in the db yet
      processNewAccessPass = true;
    }
    if (processNewAccessPass) {
      // this access pass holder hasn't been processed yet
      // treat the currentMonth as their start month and store it in firebase
      // this will trigger checkMonthlyCreditsAllocated to run in future months
      const currentDateUTC = new Date();
      let currentMonth = currentDateUTC.getUTCMonth();
      currentMonth++; // getUTCMonth is 0-11, we want 1-12
      const currentYear = currentDateUTC.getUTCFullYear();
      const monthRef = firestore
        .collection("users")
        .doc(uid)
        .collection("access_credits")
        .doc(`${currentYear}-${currentMonth}`);

      console.log("adding access first month", uid, accessMonthlyCredits);
      // create a receipt of this months payment
      await monthRef.set(
        {
          credits: accessMonthlyCredits,
          receivedAt: currentDateUTC.toUTCString(),
        },
        { merge: true }
      );
      // update the users total credits
      // (they may already have some paid or gifted credits)
      console.log("updating credits", uid, accessMonthlyCredits);
      await userRef.set(
        {
          credits: admin.firestore.FieldValue.increment(accessMonthlyCredits),
          accessStartDate: currentDateUTC.toUTCString(),
        },
        { merge: true }
      );
    }
  } else {
    console.log("no access pass, no credits to add");
  }
};

exports.checkSubscription = async function (req, res) {
  const { uid } = JSON.parse(req.body);
  console.log("checking subscriptions", uid);
  if (!uid) {
    console.log("missing uid");
    throw new Error("Missing uid");
  }
  const userRef = firestore.collection("users").doc(uid);
  const userSnap = await userRef.get();

  if (userSnap.exists) {
    const data = userSnap.data();
    const { stripeSubscription } = data;
    console.log("stripe subscription:", stripeSubscription);
    if (stripeSubscription) {
      // user has a subscription (created & stored by stripewebhookhandler)
      // check that the current months credits have been allocated

      // monthly credits is stored at time of subscription
      // rather than reading in current config value
      // as the default value may change over time (eg. if we change the price)
      const { startMonth, startYear, monthlyCredits } = stripeSubscription;

      checkMonthlyCreditsAllocated(
        uid,
        startMonth,
        startYear,
        monthlyCredits,
        null, // max months (stripe sub is indefinite)
        "subscription_credits", // collection name
        userRef,
        firestore,
        admin
      );
    }
  }
};
