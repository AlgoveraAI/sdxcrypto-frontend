// @ts-ignore (block scoping errors are irrelevant)
const { updateUserCredits } = require("./utils.ts");
// @ts-ignore (block scoping errors are irrelevant)
const { admin, firestore, remoteConfig, auth } = require("./firebase.ts");
const { getAuth } = require("firebase-admin/auth");
const crypto = require("crypto");

function generateApiKey() {
  // Generate a random sequence of bytes
  const buffer = crypto.randomBytes(32);
  // Convert the bytes to a hexadecimal string
  const apiKey = buffer.toString("hex");
  return apiKey;
}

function hashApiKey(apiKey, salt) {
  // Use the SHA-256 algorithm to create the hash
  const hash = crypto.createHash("sha256");
  // Add the salt and API key to the hash
  hash.update(salt + apiKey);
  // Return the hexadecimal representation of the hash
  return hash.digest("hex");
}

exports.createApiKey = async function (request, response) {
  const data = JSON.parse(request.body);
  const { uid } = data;

  // generate a new api key
  const apiKey = generateApiKey();
  // generate a new salt
  const salt = crypto.randomBytes(16).toString("hex");
  // hash the api key
  const hash = hashApiKey(apiKey, salt);
  // get an identifier (first 8 characters of the hash)
  const apiKeyId = hash.substr(0, 8);

  // write to firestore users under the 'apiKeys' field
  const userRef = firestore.collection("users").doc(uid);
  const userSnap = await userRef.get();
  const userData = userSnap.data();
  const apiKeys = userData.apiKeys || [];
  apiKeys.push({ apiKeyId, salt, hash });
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
