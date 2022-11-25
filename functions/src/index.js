// prepare app
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getValue } = require("firebase/remote-config");

admin.initializeApp();
const firestore = admin.firestore();
const remoteConfig = admin.remoteConfig();

// setup cors
const cors = require("cors")({ origin: true });

// credit checks
const {
  checkGiftedCredits,
  checkCreatorCredits,
} = require("./credit-handling.ts");
exports.checkCreatorCredits = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    await checkCreatorCredits(req, res, admin, firestore, remoteConfig);
    res.status(200).send("OK");
  });
});
exports.checkGiftedCredits = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // await checkCreatorCredits(req, res, admin, firestore, remoteConfig);
    await checkGiftedCredits(req, res, firestore);
    res.status(200).send("OK");
  });
  // cors(req, res, async () => {
  //   res.status(200).send("OK");
  // });
});

// contract functionality
const { genCommunitySignature } = require("./contracts.ts");
exports.genCommunitySignature = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const signature = await genCommunitySignature(req, res);
      console.log("returning signature", signature);
      res.status(200).json({ signature });
    } catch (error) {
      console.log("error", error);
      res.status(500).send(error);
    }
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
