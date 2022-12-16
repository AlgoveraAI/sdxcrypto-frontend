// prepare app
const _admin = require("firebase-admin");

// export vars
_admin.initializeApp();
exports.admin = _admin;
exports.firestore = _admin.firestore();
exports.remoteConfig = _admin.remoteConfig();
exports.auth = _admin.auth();
