const functions = require("firebase-functions");
const { Client, resources, Webhook } = require("coinbase-commerce-node");
const { Charge } = resources;

// setup cors
const cors = require("cors")({ origin: "*" });

// prepare app
const admin = require("firebase-admin");
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
    const { uid, nCredits } = data;
    const amount = String(nCredits * 0.01);
    const chargeData = {
      name: "AI credits",
      description: `Purchase request: ${nCredits} AI credits`,
      local_price: {
        amount: amount,
        currency: "USD",
      },
      pricing_type: "fixed_price",
      metadata: {
        uid: uid,
      },
    };

    const charge = await Charge.create(chargeData);
    console.log(charge);
    response.send(charge);
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
      console.log({
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

        const docRef = firestore
          .collection("users")
          .doc(event.data.metadata.uid)
          .collection("credits")
          .doc(event.data.id);

        docRef.get().then((doc) => {
          if (doc.exists) {
            console.log("Charge already exists");
          } else {
            let batch = firestore.batch();

            batch.set(docRef, {
              credit: 350,
              order: event.data.code,
              timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log("batch set");
            batch.update(
              firestore.collection("users").doc(event.data.metadata.uid),
              {
                count: admin.firestore.FieldValue.increment(350),
              }
            );
            console.log("batch update");

            batch.commit().then(() => {
              console.log("batch commit");
            });
          }
        });
      }

      if (event.type === "charge:failed") {
        console.log("Charge failed");
      }

      return response.status(200).send("Webhook received");
    } catch (error) {
      console.log(error);
      response.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);
