const _admin = require("firebase-admin");

require("dotenv").config();
if (process.env.FIREBASE_SERVICE_ACCOUNT_ID) {
  console.log(
    "setting service account",
    process.env.FIREBASE_SERVICE_ACCOUNT_ID
  );
  _admin.initializeApp({
    serviceAccountId: process.env.FIREBASE_SERVICE_ACCOUNT_ID,
  });
} else {
  console.log("using default app");
  _admin.initializeApp();
  console.log("service acct:", _admin.app().options.serviceAccountId);
}

// define here to import in other files
exports.admin = _admin;
exports.firestore = _admin.firestore();
exports.remoteConfig = _admin.remoteConfig();
exports.auth = _admin.auth();
