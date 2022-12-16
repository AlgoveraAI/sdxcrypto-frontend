// get env variables
require("dotenv").config();
// @ts-ignore (block scoping errors are irrelevant)
const { updateUserCredits } = require("./utils.ts");
// @ts-ignore (block scoping errors are irrelevant)
const { admin, firestore, remoteConfig, auth } = require("./firebase.ts");

exports.createKey = async function (request, response, admin, firestore) {};

// write function to listed for stripe events
exports.deleteKey = async function (request, response, admin, firestore) {};
