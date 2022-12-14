// get env variables
require("dotenv").config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
// const stripeSecretKey = process.env.STRIPE_TEST_KEY;
const stripe = require("stripe")(stripeSecretKey);

// @ts-ignore (block scoping errors are irrelevant)
const { admin, firestore, remoteConfig, auth } = require("./firebase.ts");
// @ts-ignore (block scoping errors are irrelevant)
const { updateUserCredits } = require("./utils.ts");

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
  let { uid, sourceUrl } = JSON.parse(request.body);
  // remove url params from sourceUrl
  // (eg if the user clicks cancel from a confirmation page)
  sourceUrl = sourceUrl.split("?")[0];

  // check params
  if (!uid) {
    console.log("missing uid", uid);
    return response.status(400).send("Missing uid");
  }
  if (!sourceUrl) {
    console.log("missing sourceUrl", sourceUrl);
    return response.status(400).send("Missing sourceUrl");
  }

  // unlike a pay-as-you-go charge, subscriptions require a stripe customer
  // get/create the customer object first

  const userRef = firestore.collection("users").doc(uid);
  const userSnap = await userRef.get();
  let customerId;
  if (userSnap.exists) {
    // customer exists, get the stripe customer id
    customerId = userSnap.data()?.stripeSubscription?.id;
  }
  if (customerId) {
    console.log("found existing stripe customer", customerId);
  } else {
    // customer doesn't exist, create a new one
    const stripeCustomer = await stripe.customers.create({
      metadata: {
        uid,
      },
    });
    // save the stripe customer id to firestore for re-use
    // sub will be updated as 'active' once the payment is successful
    // (in the stripe webhook handler)
    await userRef.update(
      {
        stripeSubscription: {
          id: stripeCustomer.id,
        },
      },
      {
        merge: true,
      }
    );
    customerId = stripeCustomer.id;
    console.log("created new stripe customer", customerId);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: sourceUrl + "?status=subscribed",
    cancel_url: sourceUrl + "?status=subscription_canceled",
    customer: customerId,
    line_items: [
      {
        price: "price_1MN6MuBFFZb1IEji0pfycfGT", // todo move to config
        // price: "price_1MN81iBFFZb1IEjiHIZZqMtq", // test product
        quantity: 1,
      },
    ],
    metadata: {
      uid,
    },
  });

  console.log("returning session", session);

  return session;
};

exports.cancelStripeSubscription = async function (request, response) {
  console.log("canceling stripe subscription", request.body);
  let { uid, sourceUrl } = JSON.parse(request.body);
  // remove url params from sourceUrl
  // (eg if the user clicks cancel from a confirmation page)
  sourceUrl = sourceUrl.split("?")[0];

  // check params
  if (!uid) {
    console.log("missing uid", uid);
    return response.status(400).send("Missing uid");
  }
  if (!sourceUrl) {
    console.log("missing sourceUrl", sourceUrl);
    return response.status(400).send("Missing sourceUrl");
  }
  const customerRef = firestore.collection("users").doc(uid);
  const customerSnap = await customerRef.get();
  if (!customerSnap.exists) {
    console.log("no customer found");
    return response.status(400).send("No customer found");
  }

  const stripeSubscription = customerSnap.data().stripeSubscription;
  if (!stripeSubscription) {
    console.log("no subscription found");
    return response.status(400).send("No subscription found");
  }

  const deleted = await stripe.subscriptions.del(stripeSubscription.id);
  console.log("deleted subscription", deleted);
  // update the user's subscription status
  await customerRef.set(
    {
      stripeSubscription: {
        status: "canceled",
      },
    },
    { merge: true }
  );
};

// write function to listed for stripe events
exports.stripeWebhookHandler = async function (request, response) {
  // to simulate a webhook event, use the stripe cli
  // https://stripe.com/docs/stripe-cli#webhooks
  // (more: https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local)

  // stripe listen --forward-to http://localhost:5001/sdxcrypto-algovera/us-central1/stripeWebhookHandler
  // stripe trigger checkout.session.completed

  // logs
  // https://console.cloud.google.com/functions/details/us-central1/stripeWebhookHandler?env=gen1&project=sdxcrypto-algovera&tab=logs

  console.log("running stripe webhook handler");

  // reconstruct the sig
  const sig = request.headers["stripe-signature"];
  let event = stripe.webhooks.constructEvent(
    request.rawBody,
    sig,
    process.env.STRIPE_SIGNING_SECRET
    // process.env.STRIPE_SIGNING_SECRET_TEST
  );

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      console.log("checkout session completed", event.data.object);
      const { mode } = event.data.object;
      if (mode === "subscription") {
        // subscription event
        console.log("got subscription event");
        const { uid } = event.data.object.metadata;
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
      console.log("processed checkout");
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

const storeUserSubscription = async function (uid, subscriptionId, firestore) {
  // store the subscription id for the user
  // use this when a user logs in to check if they have
  // monthly credits due (see functions/src/credit-handling.ts)

  console.log("storing new user subscription");

  const currentDateUTC = new Date();
  let currentMonth = currentDateUTC.getUTCMonth();
  currentMonth++; // getUTCMonth is 0-11, we want 1-12
  const currentYear = currentDateUTC.getUTCFullYear();

  // get params from remote config
  const template = await remoteConfig.getTemplate();
  const subscriptionMonthlyCredits = parseInt(
    template.parameters.subscription_monthly_credits.defaultValue.value
  );

  console.log("uid", uid);
  console.log("subscriptionId", subscriptionId);
  console.log("currentMonth", currentMonth);
  console.log("currentYear", currentYear);

  const userRef = firestore.collection("users").doc(uid);
  const stripeSubscription = {
    id: subscriptionId,
    startMonth: currentMonth,
    startYear: currentYear,
    monthlyCredits: subscriptionMonthlyCredits,
    status: "active",
  };
  await userRef.update(
    { stripeSubscription },
    {
      merge: true,
    }
  );
};
