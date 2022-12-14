// get env variables
require("dotenv").config();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
console.log("key", stripeSecretKey);
const stripe = require("stripe")(stripeSecretKey);

// docs
// https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-line_items-price_data

exports.createStripeCharge = async function (request, response) {
  console.log("creating stripe charge", request.body);
  const session = await stripe.checkout.sessions.create({
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
        quantity: 50, // minimum charge is $0.50
      },
    ],
    mode: "payment",
  });
  return session;
};

exports.paymentSuccess = async function (request, response, admin, firestore) {
  console.log("payment success", request.body);
};

exports.paymentCancel = async function (request, response, admin, firestore) {
  console.log("payment cancelled", request.body);
};
