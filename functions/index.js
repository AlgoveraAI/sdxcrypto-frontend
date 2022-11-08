const functions = require("firebase-functions");

const { Client, resources, Webhook } = require("coinbase-commerce-node");
const admin = require("firebase-admin");
admin.initializeApp();

const firestore = admin.firestore();

Client.init("a08072f1-a418-4a25-a021-6cd8bb4e6849");

const { Charge } = resources;

const cors = require("cors")({ origin: "*" });

exports.createCharge = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const chargeData = {
      name: "AI credits",
      description: "350 AI credits",
      local_price: {
        amount: "0.35",
        currency: "USD",
      },
      pricing_type: "fixed_price",
      metadata: {
        uid: "0x275e16deffbf14283fa8dc0b3fd268734811764ca8b090debf3c722d6284b1a5",
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
    const webhookSecret = "ffc33b40-0b70-4bc7-b227-29c4edde6798";

    try {
      const event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);
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
