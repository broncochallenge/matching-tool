import {
  collection,
  writeBatch,
  doc,
  setDoc,
  query,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "./config";
import { MATCH_REQUEST_ENTRY, PARTICIPANT, SESSION_TOKEN } from "./data";
import { message } from "antd";

export async function addEntry(entry: MATCH_REQUEST_ENTRY) {
  try {
    const members: PARTICIPANT[] = [];
    // a new write batch
    const addMembersBatch = writeBatch(db);
    entry.members.forEach((participant) => {
      // Add a new participant document with a generated id
      const newParticipantRef = doc(collection(db, "participants"));
      const participantUpdated = { ...participant, id: newParticipantRef.id };
      members.push(participantUpdated);
      addMembersBatch.set(newParticipantRef, participantUpdated);
    });
    // Commit the batch
    await addMembersBatch.commit();

    const newEntryRef = doc(collection(db, "challengeEntry"));
    const memberEmails = members.map((i) => i.email);
    const newEntry: MATCH_REQUEST_ENTRY = {
      ...entry,
      members,
      memberEmails,
      id: newEntryRef.id,
    };
    await setDoc(newEntryRef, newEntry);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function sendSessionTokenEmail(email: string, token: string) {
  const text = `Your session token for accessing the Bronco Challenge Matching Tool is below. This token is valid for 1 hour from the time of this email.

Session Token: ${token}

Please use this token to log in and continue your work on the platform. If you did not request this token, please ignore this email or contact our support team.

Thank you,
The Bronco Challenge Team`;

  const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Your Session Token for the Bronco Challenge Matching Tool</title>
</head>
<body>
    <p>Your session token for accessing the Bronco Challenge Matching Tool is below. This token is valid for 1 hour from the time of this email.</p>
    <p><strong>Session Token:</strong> ${token}</p>
    <p>Please use this token to log in and continue your work on the platform. If you did not request this token, please ignore this email or contact our support team.</p>
    <p>Thank you,<br>The Bronco Challenge Team</p>
</body>
</html>
`;
  await setDoc(
    doc(collection(db, "mail"), (Math.random() * 10000).toString()),
    {
      to: email,
      message: {
        subject: "Your Session Token for the Bronco Challenge Matching Tool",
        text,
        html,
      },
    }
  )
    .then(() => {})
    .catch(() => {
      return null;
    });
}

export async function getAllTeams() {
  try {
    // Get all entries
    const entriesQuery = query(collection(db, "challengeEntry"));

    const querySnapshot = await getDocs(entriesQuery);
    const entries: MATCH_REQUEST_ENTRY[] = [];

    querySnapshot.forEach((doc) => {
      entries.push(doc.data() as MATCH_REQUEST_ENTRY);
    });

    return entries;
  } catch (e) {
    console.error("Error fetching documents: ", e);
    return null;
  }
}

export async function generateToken(email: string) {
  try {
    const docRef = doc(collection(db, "sessionToken"));
    const sessionToken: SESSION_TOKEN = {
      id: docRef.id,
      time: Date.now().toString(),
      email,
    };

    await setDoc(docRef, sessionToken)
      .then(async () => {
        await sendSessionTokenEmail(email, docRef.id).then(() => {
          message.success("Check your email for session token.");
        });
      })
      .catch(() => {
        message.error("Error sending token. Try again!");
      });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function loginWithToken(token: string, email?: string) {
  try {
    const docRef = doc(db, "sessionToken", token);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const sessionToken = docSnap.data() as SESSION_TOKEN;
      // Convert the past time string back to a number
      const pastTimeNumber = parseInt(sessionToken.time, 10);

      if (!isLaterThanOneHourAgo(pastTimeNumber)) {
        message.error("Expired token.");
        return null;
      }
      if (email && sessionToken.email !== email) {
        message.error("Invalid token!");
        return null;
      }

      return sessionToken;
    } else {
      message.error("Invalid token!");
      return null;
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
function isLaterThanOneHourAgo(pastTime: number) {
  // Get the current time in milliseconds
  const currentTime = Date.now();

  // Calculate the timestamp for 1 hour ago
  const oneHourAgo = currentTime - 1 * 60 * 60 * 1000; // 1 hour in milliseconds

  // Compare the pastTime with the timestamp of 1 hour ago
  return pastTime > oneHourAgo;
}
