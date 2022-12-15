// const { firestore, admin } = require("./firebase");

exports.updateUserCredits = async function (
  uid,
  credits,
  chargeId,
  orderId,
  firestore,
  admin
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
