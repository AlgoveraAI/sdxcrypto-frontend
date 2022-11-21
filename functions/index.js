const functions = require("firebase-functions");
const { Client, resources, Webhook } = require("coinbase-commerce-node");
const { Charge } = resources;
const admin = require("firebase-admin");

// setup cors
const cors = require("cors")({ origin: "*" });

// prepare app (use admin SDK)
admin.initializeApp();
const firestore = admin.firestore();

// get env variables
require("dotenv").config();
const cbApiKey = process.env.COINBASE_COMMERCE_API_KEY;
const cbWebhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;

Client.init(cbApiKey);

exports.createCharge = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    console.log("creating charge", request.body);
    const data = JSON.parse(request.body);
    const { uid, credits } = data;
    const amount = String(credits * 0.01);
    const chargeData = {
      name: "Algovera AI Credits",
      description: `Purchase request: ${credits} AI credits`,
      local_price: {
        amount: amount,
        currency: "USD",
      },
      pricing_type: "fixed_price",
      metadata: {
        uid: uid,
        credits: credits,
      },
    };

    const charge = await Charge.create(chargeData);
    console.log(charge);
    response.send(charge);
  });
});

async function handleChargeEvent(event) {
  console.log("charge event:", {
    id: event.data.id,
    status: event.type,
    code: event.data.code,
    uid: event.data.metadata.uid,
    created_at: event.data.created_at,
  });

  if (event.type === "charge:pending") {
    console.log("Charge pending");
  }

  if (event.type === "charge:confirmed") {
    console.log("Charge confirmed!!!!");

    let { uid, credits } = event.data.metadata;
    credits = parseInt(credits);

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
      .doc(event.data.id);

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
          .doc(event.data.id),
        {
          credits: credits,
          order: event.data.code,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        }
      );
    }

    // commit the batch
    console.log("Committing batch");
    return batch.commit().then(function () {
      console.log("Firestore updated");
    });
  }

  if (event.type === "charge:failed") {
    console.log("Charge failed");
  }
}

exports.testChargeEvent = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    console.log("testing charge event", request.body);
    const data = JSON.parse(request.body);
    const event = data.event;
    await handleChargeEvent(event);
    response.send({
      status: "ok",
    });
  });
});

exports.webhookHandler = functions.https.onRequest(
  async (request, response) => {
    const rawBody = request.rawBody;
    const signature = request.headers["x-cc-webhook-signature"];

    try {
      const event = Webhook.verifyEventBody(
        rawBody,
        signature,
        cbWebhookSecret
      );
      await handleChargeEvent(event);

      return response.status(200).send("Webhook received");
    } catch (error) {
      console.log(error);
      response.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);
