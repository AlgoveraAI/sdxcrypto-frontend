// prepare app
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getValue } = require("firebase/remote-config");

// local test (from /functions dir)
// firebase emulators:start --only functions

// setup firebase conn
admin.initializeApp();
const firestore = admin.firestore();
const remoteConfig = admin.remoteConfig();
const auth = admin.auth();

// setup cors
const cors = require("cors")({ origin: true });

// credit checks
const {
  checkGiftedCredits,
  checkAccessCredits,
} = require("./credit-handling.ts");
exports.checkAccessCredits = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    await checkAccessCredits(req, res, admin, firestore, remoteConfig);
    res.status(200).send("OK");
  });
});
exports.checkGiftedCredits = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    await checkGiftedCredits(req, res, firestore);
    res.status(200).send("OK");
  });
});

// contract functionality
const { genCommunitySignature } = require("./contracts.ts");
exports.genCommunitySignature = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const signature = await genCommunitySignature(req, res);
    res.status(200).send(signature);
  });
});

// coinbase handling
const {
  createCharge,
  testChargeEvent,
  webhookHandler,
} = require("./coinbase.ts");
exports.createCharge = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const charge = await createCharge(req, res);
    res.status(200).send(charge);
  });
});
exports.testChargeEvent = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    testChargeEvent(req, res, admin, firestore);
    res.status(200).send("OK");
  });
});
exports.webhookHandler = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    await webhookHandler(req, res, admin, firestore);
    return res.status(200).send("Webhook received");
  });
});

// user management
const { getFirebaseToken } = require("./user-management.ts");
exports.getFirebaseUser = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const user = await getFirebaseToken(req, res, auth);
    res.status(200).send(user);
  });
});

// stripe
const { createStripeCharge } = require("./stripe.ts");
exports.createStripeCharge = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const charge = await createStripeCharge(req, res);
    res.status(200).send(charge);
  });
});
