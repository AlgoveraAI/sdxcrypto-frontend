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
  checkGiftedCredits(req, res);
});
exports.checkCreatorCredits = functions.https.onRequest((req, res) => {
  checkCreatorCredits(req, res);
});

// contract functionality
const { genCommunitySignature } = require("./contracts.ts");
exports.genCommunitySignature = functions.https.onRequest((req, res) => {
  genCommunitySignature(req, res);
});

// coinbase handling
const {
  createCharge,
  handleChargeEvent,
  testChargeEvent,
  webhookHandler,
} = require("./coinbase.ts");
exports.createCharge = functions.https.onRequest((req, res) => {
  createCharge(req, res);
});
exports.handleChargeEvent = functions.https.onRequest((req, res) => {
  handleChargeEvent(req, res);
});
exports.testChargeEvent = functions.https.onRequest((req, res) => {
  testChargeEvent(req, res);
});
exports.webhookHandler = functions.https.onRequest((req, res) => {
  webhookHandler(req, res);
});
