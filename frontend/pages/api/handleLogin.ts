import type { NextApiRequest, NextApiResponse } from "next";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";

// users can be 'gifted' free credits by adding a credits entry
// to the 'wallet_credits' Firestore collection
// this function will check those entries
// and add them to the 'users' collection, which the backend checks
// when running a job

const MONTHLY_CREDITS = 100; // to-do configure in db

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { uid, walletAddress, isCreator } = JSON.parse(req.body);

    // TODO check that the uid's username == the wallet
    // since username is stored as wallet address on sign-up
    // this would prevent api calls with the wrong wallet addr

    if (!uid || !walletAddress) {
      throw new Error("Missing uid or walletAddress");
    }

    // get user doc
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    // check for gifted credits
    const docRef = doc(db, "wallet_credits", walletAddress);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("got wallet credits", data);
      const { credits } = data;

      // update user credits
      let newCredits; // new total credits
      if (userSnap.exists()) {
        // user already has credits, increment
        const userData = userSnap.data();
        newCredits = userData.credits + credits;
      } else {
        // user doesnt have a db entry yet, set credits
        newCredits = credits;
      }
      // update the database
      await updateDoc(userRef, {
        credits: newCredits,
      });

      // store a record of the gift (as we do for charges and creator subs)
      // use timestamp to ensure a unique doc is created
      const timestampStr = new Date().toUTCString();
      const giftRef = doc(db, "users", uid, "gifts", timestampStr);
      await updateDoc(giftRef, {
        credits: credits,
        receivedAt: timestampStr,
      });
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
      if (userSnap.exists()) {
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
              const monthRef = doc(db, "users", uid, "creator_credits", docId);
              const monthSnap = await getDoc(monthRef);
              if (!monthSnap.exists()) {
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
        const monthRef = doc(
          db,
          "users",
          uid,
          "creator_credits",
          `${currentYear}-${currentMonth}`
        );
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
    }
  } catch (error: any) {
    try {
      res.status(500).json({ error: error.message });
    } catch {
      res.status(500).json({ unknown_error: error });
    }
  }
}
