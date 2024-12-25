/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const base64 = require("base-64");

admin.initializeApp();
const db = admin.firestore();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

async function managePostReminders() {
  const postsQuerySnapshot = await db
    .collection("participants")
    .where("active", "==", true)
    .get();

  const entriesQuerySnapshot = await db
    .collection("challengeEntry")
    .where("active", "==", true)
    .get();

  async function updateItem(snapDoc, database) {
    const item = snapDoc.data();

    // when outside Aug 1 and Nov 30; make all items inactive
    if (isOutsideAug1ToNov30()) {
      const itemRef = db.collection(database).doc(item.id);
      const updatedItem = {
        ...item,
        active: false,
      };
      await itemRef.update(updatedItem);
    } else {
      // send email for all items older than 2 weeks
      if (isMoreThanTwoWeeksAgo(item.time)) {
        sendLinkToEmail(item.email);
      }
    }
  }

  postsQuerySnapshot.forEach(async (snapDoc) => {
    await updateItem(snapDoc, "participants");
  });

  entriesQuerySnapshot.forEach(async (snapDoc) => {
    await updateItem(snapDoc, "challengeEntry");
  });
}

exports.manageActivePosts = functions.pubsub
  .schedule("0 0 */14 7-12 *") // Every 14 days from July to December
  .timeZone("UTC")
  .onRun(async (context) => {
    logger.info("Running scheduled post manager...", { structuredData: true });
    await managePostReminders();
  });

function isMoreThanTwoWeeksAgo(epochTime) {
  // Get the current time in milliseconds
  const now = Date.now();

  // Calculate two weeks in milliseconds
  const twoWeeksInMillis = 14 * 24 * 60 * 60 * 1000;

  // Convert the epoch time to milliseconds (if it's in seconds)
  const epochTimeMillis =
    epochTime * (epochTime.toString().length === 10 ? 1000 : 1);

  // Check if the time is more than two weeks ago
  return now - epochTimeMillis > twoWeeksInMillis;
}

async function sendLinkToEmail(email) {
  var encodedData = base64.encode(email);
  let url = "https://matching-tool-lime.vercel.app/";
  url += "delete-entries?data=" + encodedData;
  const text = `Have you found the team or team member you are looking for? If yes, use this link to remove your request post.

  Link: ${url}

  All request posts will be removed automatically after November 30.
  Best regards,
  The Bronco Challenge Team
`;

  const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Found team or team member?</title>
      </head>
      <body>
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #2E86C1;">Bronco Challenge</h2>
          <p>Have you found the team or team member you are looking for? If yes, use this link to remove your request post.</p>
          <h3 style="color: #2E86C1;">Link: <span style="color: #E74C3C;">${url}</span></h3>
          <br>
          <p>All request posts will be removed automatically after November 30.</p>
          <p>Best regards,</p>
          <p>The Bronco Challenge Team</p>
        </div>
      </body>
      </html>
`;
  const mailRef = db.collection("mail");
  await mailRef
    .doc((Math.random() * 10000).toString())
    .set({
      to: email,
      message: { subject: "Found team or team member?", text, html },
    })
    .then(() => {
      console.log("Queued email for delivery!");
    })
    .catch(() => {
      return null;
    });
}

function isOutsideAug1ToNov30() {
  const today = new Date(); // Get today's date
  const year = today.getFullYear();

  // Define the start and end of the range
  const startDate = new Date(year, 7, 1); // August 1 (month is zero-indexed)
  const endDate = new Date(year, 10, 30); // November 30

  // Check if today is outside the range
  return today < startDate || today > endDate;
}
