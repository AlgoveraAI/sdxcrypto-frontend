exports.getFirebaseToken = async function (req, res, auth) {
  // create a firebase user using the admin sdk and custom token
  // this is used to create a user for the web3 provider

  // const { uid } = req.body;
  const { uid } = JSON.parse(req.body);
  console.log("creating firebase user", uid);

  auth.createCustomToken(uid).then((customToken) => {
    console.log("custom token", customToken);
  });

  try {
  } catch (error) {
    console.log("error", error);
  }
};
