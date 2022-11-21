import type { NextApiRequest, NextApiResponse } from "next";
import { updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
const admin = require("firebase-admin");

// users can be 'gifted' free credits by adding a credits entry
// to the 'wallet_credits' Firestore collection
// this function will check those entries
// and add them to the 'users' collection,
// which the backend checks when running a job

// if a user has a creator pass
// it also checks their monthly subscription and adds credits

// prepare app (use admin SDK)
// this requires the GOOGLE_APPLICATION_CREDENTIALS in .env.local
// as per https://firebase.google.com/docs/admin/setup
if (!admin.apps.length) {
  console.log("initializing admin app");
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
} else {
  // if running locally multiple times in a row,
  // the app will already exist
  admin.app();
}
const firestore = admin.firestore();

const MONTHLY_CREDITS = 100; // to-do configure in db

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("got handleWalletConnect request", req.body);
  try {
    const { uid, walletAddress, isCreator } = JSON.parse(req.body);

    // TODO check that the uid's username == the wallet
    // since username is stored as wallet address on sign-up
    // this would prevent api calls with the wrong wallet addr

    if (!uid || !walletAddress) {
      console.log("missing uid or walletAddress");
      throw new Error("Missing uid or walletAddress");
    }

    // get user doc
    console.log("getting users doc", uid);
    const userRef = firestore.collection("users").doc(uid);
    const userSnap = await userRef.get();

    // check for gifted credits
    console.log("getting wallet credits", walletAddress);
    const docRef = firestore.collection("wallet_credits").doc(walletAddress);
    const docSnap = await docRef.get();
    // check it exists
    if (docSnap.exists) {
      const data = docSnap.data();
      console.log("got wallet credits", data);
      const { credits } = data;

      if (credits > 0) {
        // update user credits
        let newCredits; // new total credits
        if (userSnap.exists) {
          // user already has credits, increment
          const userData = userSnap.data();
          newCredits = userData.credits + credits;
        } else {
          // user doesnt have a db entry yet, set credits
          newCredits = credits;
        }
        // add credits to the users doc (uid is the doc id)
        await updateDoc(userRef, {
          credits: newCredits,
        });
        // delete the wallet_credits entry (wallet is the doc id)
        await updateDoc(docRef, {
          credits: 0,
        });
        // store a record of the gift (as we do for charges and creator subs)
        // use timestamp to ensure a unique doc is created
        const timestampStr = new Date().toUTCString();
        // const giftRef = doc(db, "users", uid, "gifts", timestampStr);
        const giftRef = firestore
          .collection("users")
          .doc(uid)
          .collection("gifts")
          .doc(timestampStr);
        await updateDoc(giftRef, {
          credits: credits,
          receivedAt: timestampStr,
        });
      }
    } else {
      console.log("no wallet credits");
    }

    // check Creator Pass monthly subscription
    // if theyre in a new month, assign them their new credits
    // subscription starts from first login as creator, not mint date
    // this all relies on isCreator flag sent from frontend (which has checked wallet)
    const currentDateUTC = new Date();
    const currentMonth = currentDateUTC.getUTCMonth();
    const currentYear = currentDateUTC.getUTCFullYear();
    let totalNewCredits = 0; // total new credits to add from each month processed
    let processNewUser = false; // flag to create new user doc if needed

    if (isCreator) {
      if (userSnap.exists) {
        const data = userSnap.data();
        if (data.creatorStartDate) {
          // user is already in the db and has been processed as a creator already
          const creatorStartDate = data.creatorStartDate;
          const creatorStartDateUTC = new Date(creatorStartDate);
          const creatorStartMonth = creatorStartDateUTC.getUTCMonth();
          const creatorStartYear = creatorStartDateUTC.getUTCFullYear();

          // for each month since the creatorStartDate, check for a receipt of credits
          // if credits havent been received, add them
          // if credits have been received, do nothing
          // (process every month of every year, in case they didnt login for a month)
          for (let y = creatorStartYear; y <= currentYear; y++) {
            // determine the month to start at
            let m;
            if (y === creatorStartYear) {
              m = creatorStartMonth;
            } else {
              m = 1;
            }
            for (; m <= 12; m++) {
              if (y === currentYear && m > currentMonth) {
                break; // dont check future months
              }
              const docId = `${y}-${m}`;
              // const monthRef = doc(db, "users", uid, "creator_credits", docId);
              // const monthSnap = await getDoc(monthRef);
              const monthRef = firestore
                .collection("users")
                .doc(uid)
                .collection("creator_credits")
                .doc(docId);
              const monthSnap = await monthRef.get();
              if (!monthSnap.exists) {
                // month doesnt exist, add it
                console.log("adding creator month", uid, docId);
                await updateDoc(monthRef, {
                  credits: MONTHLY_CREDITS, // record the number of new credits added
                  receivedAt: currentDateUTC.toUTCString(),
                });
                totalNewCredits += MONTHLY_CREDITS;
              }
            }
          }
          console.log("updating credits", uid, totalNewCredits);
          await updateDoc(userRef, {
            credits: data.credits + totalNewCredits,
          });
        } else {
          // user is already in the db but hasnt been processed as a creator yet
          processNewUser = true;
        }
      } else {
        // user is not in the db yet
        processNewUser = true;
      }
      if (processNewUser) {
        const monthRef = firestore
          .collection("users")
          .doc(uid)
          .collection("creator_credits")
          .doc(`${currentYear}-${currentMonth}`);

        console.log("adding creator first month", uid, MONTHLY_CREDITS);
        await updateDoc(monthRef, {
          credits: MONTHLY_CREDITS, // record the number of new credits added
          receivedAt: currentDateUTC.toUTCString(),
        });
        console.log("updating credits", uid, MONTHLY_CREDITS);
        await updateDoc(userRef, {
          credits: MONTHLY_CREDITS,
          creatorStartDate: currentDateUTC.toUTCString(),
        });
      }
      // resolve
    } else {
      console.log("not a creator, no credits to add");
    }
    // resolve
    res.status(200).json({ success: true });
  } catch (error: any) {
    // handle errors
    console.log("error", error);
    try {
      res.status(500).json({ error: error.message });
    } catch {
      res.status(500).json({ unknown_error: error });
    }
  }
}
