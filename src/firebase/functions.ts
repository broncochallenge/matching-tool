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
  const text = `To access Bronco Challenge Matching Tool, please use the following one-time password (OTP). This OTP is valid for 1 hour.

Your OTP: ${token}

If you did not request this, please ignore this email.

Best regards,
The Bronco Challenge Team
`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Bronco Challenge OTP</title>
</head>
<body>
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #2E86C1;">Bronco Challenge</h2>
    <p>To access Matching Tool, please use the following one-time password (OTP). This OTP is valid for 1 hour.</p>
    <h3 style="color: #2E86C1;">Your OTP: <span style="color: #E74C3C;">${token}</span></h3>
    <p>If you did not request this, please ignore this email.</p>
    <br>
    <p>Best regards,</p>
    <p>The Bronco Challenge Team</p>
  </div>
</body>
</html>

`;
  await setDoc(
    doc(collection(db, "mail"), (Math.random() * 10000).toString()),
    {
      to: email,
      message: {
        subject: "Your One-Time Password (OTP) for Bronco Challenge Access",
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
    const token = generateRandomSixDigitString();
    const docRef = doc(db, "sessionToken", token);

    const sessionToken: SESSION_TOKEN = {
      id: token,
      time: Date.now().toString(),
      email,
    };

    await setDoc(docRef, sessionToken)
      .then(async () => {
        await sendSessionTokenEmail(email, token).then(() => {
          message.success("Check your email for OTP.");
        });
      })
      .catch(() => {
        message.error("Error sending OTP. Try again!");
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
function generateRandomSixDigitString(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
