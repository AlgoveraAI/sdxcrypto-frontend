const functions = require("firebase-functions");

// local test
// firebase emulators:start --only functions

// setup cors
const cors = require("cors")({ origin: true });

// credit checks
const {
  checkGiftedCredits,
  checkAccessCredits,
} = require("./credit-handling.ts");
exports.checkAccessCredits = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    await checkAccessCredits(req, res);
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
  createCoinbaseCharge,
  testChargeEvent,
  webhookHandler,
} = require("./coinbase.ts");
exports.createCoinbaseCharge = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const charge = await createCoinbaseCharge(req, res);
    res.status(200).send(charge);
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
    await webhookHandler(req, res);
    return res.status(200).send("Webhook received");
  });
});

// stripe
const { createStripeCharge, stripeWebhookHandler } = require("./stripe.ts");
exports.createStripeCharge = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const charge = await createStripeCharge(req, res);
    res.status(200).send(charge);
  });
});
exports.stripeWebhookHandler = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    await stripeWebhookHandler(req, res);
    return res.status(200).send("Webhook received");
  });
});

// api key mgmt
const { createApiKey, deleteApiKey } = require("./api-keys.ts");
exports.createApiKey = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const key = await createApiKey(req, res);
    res.status(200).send(key);
  });
});

exports.deleteApiKey = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    await deleteApiKey(req, res);
    res.status(200).send("OK");
  });
});
