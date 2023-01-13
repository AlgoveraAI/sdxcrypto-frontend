const { Client, resources, Webhook } = require("coinbase-commerce-node");
const { Charge } = resources;
// @ts-ignore (block scoping errors are irrelevant)
const { updateUserCredits } = require("./utils.ts");
// @ts-ignore (block scoping errors are irrelevant)
const { admin, firestore, remoteConfig, auth } = require("./firebase.ts");
// get env variables
require("dotenv").config();
const cbApiKey = process.env.COINBASE_COMMERCE_API_KEY;
const cbWebhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;
Client.init(cbApiKey);

exports.createCoinbaseCharge = async function (request, response) {
  console.log("creating charge", request.body);
  const data = JSON.parse(request.body);
  let { uid, credits, sourceUrl } = data;
  // remove url params from sourceUrl
  // (eg if the user clicks cancel from a confirmation page)
  sourceUrl = sourceUrl.split("?")[0];

  const amount = String(credits * 0.01);
  const chargeData = {
    name: "Algovera AI Credits",
    description: `Purchase request: ${credits} AI credits`,
    redirect_url: sourceUrl + "?status=credits_purchased",
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
  return charge;
};

// local function, not exported
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
    await updateUserCredits(
      uid,
      credits,
      event.data.id,
      event.data.code,
      firestore,
      admin
    );
  }

  if (event.type === "charge:failed") {
    console.log("Charge failed");
  }
}

exports.testChargeEvent = async function (request, response) {
  console.log("testing charge event", request.body);
  const data = JSON.parse(request.body);
  const event = data.event;
  await handleChargeEvent(event);
};

exports.webhookHandler = async function (request, response) {
  const rawBody = request.rawBody;
  const signature = request.headers["x-cc-webhook-signature"];

  try {
    const event = Webhook.verifyEventBody(rawBody, signature, cbWebhookSecret);
    await handleChargeEvent(event);
  } catch (error) {
    console.log(error);
    response.status(400).send(`Webhook Error: ${error.message}`);
  }
};
