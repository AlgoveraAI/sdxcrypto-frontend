// get env variables
require("dotenv").config();

// const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeSecretKey = process.env.STRIPE_TEST_KEY;
const stripe = require("stripe")(stripeSecretKey);

// @ts-ignore (block scoping errors are irrelevant)
const { admin, firestore, remoteConfig, auth } = require("./firebase.ts");
// @ts-ignore (block scoping errors are irrelevant)
const { updateUserCredits, storeUserSubscription } = require("./utils.ts");

// docs
// https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-line_items-price_data

exports.createStripeCharge = async function (request, response) {
  console.log("creating stripe charge", request.body);
  let { uid, credits } = JSON.parse(request.body);
  // check uid and credits
  if (!uid || !credits) {
    return response.status(400).send("Missing uid or credits");
  }
  credits = parseInt(credits);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: "https://app.algovera.ai",
    cancel_url: "https://app.algovera.ai",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "AI Credits",
            description: "Credits to use in the Algovera Flow platform",
          },
          unit_amount: 1, // denominated in cents
        },
        quantity: Math.max(50, credits), // minimum charge is $0.50
      },
    ],
    metadata: {
      uid,
      credits,
    },
  });
  return session;
};

exports.createStripeSubscription = async function (request, response) {
  console.log("creating stripe subscription", request.body);
  let { uid } = JSON.parse(request.body);
  // check uid
  if (!uid) {
    return response.status(400).send("Missing uid");
  }

  // unlike a pay-as-you-go charge, subscriptions require a stripe customer
  // get/create the customer object first

  const customerRef = firestore.collection("stripe_customers").doc(uid);
  const customerSnap = await customerRef.get();
  let customerId;
  if (customerSnap.exists) {
    // customer exists, get the stripe customer id
    customerId = customerSnap.data().id;
    console.log("got existing stripe customer", customerId);
  } else {
    // customer doesn't exist, create a new one
    const stripeCustomer = await stripe.customers.create({
      metadata: {
        uid,
      },
    });
    // save the stripe customer id to firestore
    await customerRef.set({
      id: stripeCustomer.id,
    });
    customerId = stripeCustomer.id;
    console.log("created new stripe customer", customerId);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: "https://app.algovera.ai",
    cancel_url: "https://app.algovera.ai",
    customer: customerId,
    line_items: [
      {
        // price: "price_1MN6MuBFFZb1IEji0pfycfGT", // todo move to config
        price: "price_1MN81iBFFZb1IEjiHIZZqMtq", // test product
        quantity: 1,
      },
    ],
    metadata: {
      uid,
    },
  });

  return session;
};

// write function to listed for stripe events
exports.stripeWebhookHandler = async function (request, response) {
  // to simulate a webhook event, use the stripe cli
  // https://stripe.com/docs/stripe-cli#webhooks
  // (more: https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local)

  // stripe listen --forward-to http://localhost:5001/sdxcrypto-algovera/us-central1/stripeWebhookHandler
  // stripe trigger checkout.session.completed

  console.log("stripe webhook");

  const sig = request.headers["stripe-signature"];
  console.log("sig", sig);
  // reconstruct the sig

  let event = stripe.webhooks.constructEvent(
    request.rawBody,
    sig,
    process.env.STRIPE_SIGNING_SECRET_TEST
    // "whsec_e846dd36bc4dd3e74a7fba0f6286bc1659a5f48483f1303e6e7e9a944cbedbe9"
  );

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      console.log("checkout session completed", event.data.object);
      const { mode } = event.data.object;
      if (mode === "subscription") {
        // subscription event
        console.log("got subscription event!");
        const { uid } = event.data.object.metadata;
        const currentDateUTC = new Date();

        await storeUserSubscription(
          uid,
          event.data.object.subscription,

          firestore
        );
      } else {
        // once off 'payment' for a fixed amount of credits
        // add to user in firestore
        const { uid, credits } = event.data.object.metadata;
        await updateUserCredits(
          uid,
          parseInt(credits),
          event.data.object.id,
          event.data.object.payment_intent,
          firestore,
          admin
        );
      }
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};
