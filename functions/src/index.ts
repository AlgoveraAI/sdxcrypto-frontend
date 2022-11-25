// prepare app
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getValue } = require("firebase/remote-config");

const app = admin.initializeApp();
const firestore = admin.firestore();
const remoteConfig = admin.remoteConfig();

// setup cors
const cors = require("cors")({ origin: "*" });

// credit checks
const {
  checkGiftedCredits,
  checkCreatorCredits,
} = require("./creditHandling.ts");
exports.checkGiftedCredits = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    checkGiftedCredits(req, res, firestore);
    res.status(200).send("OK");
  });
});
exports.checkCreatorCredits = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    checkCreatorCredits(req, res, admin, firestore, remoteConfig);
    res.status(200).send("OK");
  });
});

// contract functionality
const { genCommunitySignature } = require("./contracts.ts");
exports.genCommunitySignature = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    genCommunitySignature(req, res);
    res.status(200).send("OK");
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
    createCharge(req, res);
    res.status(200).send("OK");
  });
});
exports.testChargeEvent = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    testChargeEvent(req, res);
    res.status(200).send("OK");
  });
});
exports.webhookHandler = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    webhookHandler(req, res);
    res.status(200).send("OK");
  });
});
