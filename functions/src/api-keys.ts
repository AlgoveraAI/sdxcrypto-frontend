// get env variables
require("dotenv").config();
// @ts-ignore (block scoping errors are irrelevant)
const { updateUserCredits } = require("./utils.ts");
// @ts-ignore (block scoping errors are irrelevant)
const { admin, firestore, remoteConfig, auth } = require("./firebase.ts");

exports.createApiKey = async function (request, response) {
  const data = JSON.parse(request.body);
  const { uid } = data;
  // generate random key
  const apiKey =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  // write to firestore users under the 'apiKeys' field
  const userRef = firestore.collection("users").doc(uid);
  const userSnap = await userRef.get();
  const userData = userSnap.data();
  const apiKeys = userData.apiKeys || [];
  apiKeys.push(apiKey);
  await userRef.update({ apiKeys });

  return { apiKey };
};

exports.deleteApiKey = async function (request, response) {
  const data = JSON.parse(request.body);
  const { uid, apiKey } = data;
  const userRef = firestore.collection("users").doc(uid);
  const userSnap = await userRef.get();
  const userData = userSnap.data();
  const apiKeys = userData.apiKeys || [];
  const index = apiKeys.indexOf(apiKey);
  if (index > -1) {
    apiKeys.splice(index, 1);
  }
  await userRef.update({ apiKeys });
};
