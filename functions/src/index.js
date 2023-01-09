const functions = require("firebase-functions");

// local test
// firebase emulators:start --only functions

// setup cors
const cors = require("cors")({ origin: true });

// credit checks
const {
  checkGiftedCredits,
  checkAccessCredits,
  checkSubscription,
} = require("./credit-handling.ts");
exports.checkAccessCredits = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      await checkAccessCredits(req, res);
      res.status(200).send("OK");
    } catch (e) {
      console.log("error", e);
      res.status(500).send(e.message ? e.message : "Something went wrong");
    }
  });
});
exports.checkGiftedCredits = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      await checkGiftedCredits(req, res);
      res.status(200).send("OK");
    } catch (e) {
      console.log("error", e);
      res.status(500).send(e.message ? e.message : "Something went wrong");
    }
  });
});
exports.checkSubscription = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      await checkSubscription(req, res);
      res.status(200).send("OK");
    } catch (e) {
      console.log("error", e);
      res.status(500).send(e.message ? e.message : "Something went wrong");
    }
  });
});

// contract functionality
const { genCommunitySignature } = require("./contracts.ts");
exports.genCommunitySignature = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const signature = await genCommunitySignature(req, res);
      res.status(200).send(signature);
    } catch (e) {
      console.log("error", e);
      res.status(500).send(e.message ? e.message : "Something went wrong");
    }
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
    try {
      const charge = await createCoinbaseCharge(req, res);
      res.status(200).send(charge);
    } catch (e) {
      console.log("error", e);
      res.status(500).send(e.message ? e.message : "Something went wrong");
    }
  });
});
exports.testChargeEvent = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      testChargeEvent(req, res);
      res.status(200).send("OK");
    } catch (e) {
      console.log("error", e);
      res.status(500).send(e.message ? e.message : "Something went wrong");
    }
  });
});
exports.webhookHandler = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      await webhookHandler(req, res);
      return res.status(200).send("Webhook received");
    } catch (e) {
      console.log("error", e);
      res.status(500).send(e.message ? e.message : "Something went wrong");
    }
  });
});

// stripe
const {
  createStripeCharge,
  stripeWebhookHandler,
  createStripeSubscription,
  cancelStripeSubscription,
} = require("./stripe.ts");
exports.createStripeCharge = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const charge = await createStripeCharge(req, res);
      res.status(200).send(charge);
    } catch (e) {
      console.log("error", e);
      res.status(500).send(e.message ? e.message : "Something went wrong");
    }
  });
});
exports.createStripeSubscription = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const subscription = await createStripeSubscription(req, res);
      res.status(200).send(subscription);
    } catch (e) {
      res.status(500).send(e.message ? e.message : "Something went wrong");
    }
  });
});
exports.stripeWebhookHandler = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      await stripeWebhookHandler(req, res);
      return res.status(200).send("Webhook received");
    } catch (e) {
      console.log("error", e);
      res.status(500).send(e.message ? e.message : "Something went wrong");
    }
  });
});
exports.cancelStripeSubscription = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      await cancelStripeSubscription(req, res);
      res.status(200).send("OK");
    } catch (e) {
      console.log("error", e);
      res.status(500).send(e.message ? e.message : "Something went wrong");
    }
  });
});

// api key mgmt
const { createApiKey, deleteApiKey } = require("./api-keys.ts");
exports.createApiKey = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const key = await createApiKey(req, res);
      res.status(200).send(key);
    } catch (e) {
      console.log("error", e);
      res.status(500).send(e.message ? e.message : "Something went wrong");
    }
  });
});

exports.deleteApiKey = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      await deleteApiKey(req, res);
      res.status(200).send("OK");
    } catch (e) {
      console.log("error", e);
      res.status(500).send(e.message ? e.message : "Something went wrong");
    }
  });
});
