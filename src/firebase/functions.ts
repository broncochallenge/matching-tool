import {
  collection,
  writeBatch,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  or,
  getDoc,
} from "firebase/firestore";
import { db } from "./config";
import { BRONCO_CHALLENGE_ENTRY, PARTICIPANT } from "./data";
import { message } from "antd";

export async function addEntry(entry: BRONCO_CHALLENGE_ENTRY) {
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
    const newEntry: BRONCO_CHALLENGE_ENTRY = {
      ...entry,
      members,
      memberEmails,
      id: newEntryRef.id,
    };
    await setDoc(newEntryRef, newEntry).then(async () => {
      await sendWelcomeEmail(memberEmails, entry.team_name);
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function getMembers(skills: string[], yourEmail: string) {
  try {
    // If your email is registered with a team, update the team's desired skills
    const teamsQuery = query(
      collection(db, "challengeEntry"),
      where("memberEmails", "array-contains", yourEmail)
    );
    const teamsQuerySnapshot = await getDocs(teamsQuery);
    if (!teamsQuerySnapshot.empty) {
      // Update teams' desired_skills
      // Get a new write batch
      const updateTeamsBatch = writeBatch(db);
      teamsQuerySnapshot.forEach((teamData) => {
        const team = teamData.data() as BRONCO_CHALLENGE_ENTRY;

        const teamRef = doc(db, "challengeEntry", teamData.id);
        let skillset = new Set([
          ...team.desired_skills,
          ...skills,
        ]) as unknown as string[];
        skillset = Array.from(skillset);
        const teamUpdated: BRONCO_CHALLENGE_ENTRY = {
          ...team,
          desired_skills: skillset,
        };

        updateTeamsBatch.update(teamRef, teamUpdated);
      });
      // Commit the batch
      await updateTeamsBatch.commit();
    }

    // Get members with the desired skills
    const membersQuery = query(
      collection(db, "participants"),
      where("skills", "array-contains-any", skills)
    );
    const membersQuerySnapshot = await getDocs(membersQuery);
    const members: PARTICIPANT[] = [];

    membersQuerySnapshot.forEach((doc) => {
      members.push(doc.data() as PARTICIPANT);
    });

    return members;
  } catch (e) {
    console.error("Error fetching documents: ", e);
    return null;
  }
}

export async function getTeams(
  skills: string[],
  sdgs: string[],
  participant: PARTICIPANT
) {
  try {
    const participantQuery = query(
      collection(db, "participants"),
      where("email", "==", participant.email)
    );
    const participantQuerySnapshot = await getDocs(participantQuery);
    if (participantQuerySnapshot.empty) {
      //Add new participant
      const newParticipantRef = doc(collection(db, "participants"));
      const participantUpdated = { ...participant, id: newParticipantRef.id };
      await setDoc(newParticipantRef, participantUpdated);
    } else {
      // Update participants' skills
      // a new write batch
      const updateMembersBatch = writeBatch(db);
      participantQuerySnapshot.forEach((memberData) => {
        const member = memberData.data() as PARTICIPANT;

        const participantRef = doc(db, "participants", memberData.id);
        let skillset = new Set([
          ...member.skills,
          ...skills,
        ]) as unknown as string[];
        skillset = Array.from(skillset);
        const memberUpdated = { ...member, skills: skillset };

        updateMembersBatch.update(participantRef, memberUpdated);
      });
      // Commit the batch
      await updateMembersBatch.commit();
    }

    // Get entries with the sdgs_of_interest or desired skills
    const entriesQuery = query(
      collection(db, "challengeEntry"),
      or(
        where("sdgs_of_interest", "array-contains-any", sdgs),
        where("desired_skills", "array-contains-any", skills)
      )
    );

    const querySnapshot = await getDocs(entriesQuery);
    const entries: BRONCO_CHALLENGE_ENTRY[] = [];

    querySnapshot.forEach((doc) => {
      entries.push(doc.data() as BRONCO_CHALLENGE_ENTRY);
    });

    return entries;
  } catch (e) {
    console.error("Error fetching documents: ", e);
    return null;
  }
}

export async function sendWelcomeEmail(email: string[], teamName: string) {
  const supportEmail = "Neil.Drobny@wmich.edu";
  const text = `Subject: Welcome to the Bronco Challenge!

Hi ${teamName},

Congratulations on registering for the Bronco Challenge for Sustainable Impact!

We're excited to have you on board and can't wait to see the innovative solutions your team will develop. As you embark on this journey, remember that we're here to support you every step of the way.

Here are a few next steps to get you started:
1. Explore the resources available on our platform.
2. Connect with other teams and potential collaborators.
3. Stay tuned for upcoming events and workshops.

If you have any questions or need assistance, don't hesitate to reach out to us at ${supportEmail}.

Best of luck, and let the challenge begin!

Warm regards,
The Bronco Challenge Team`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to the Bronco Challenge</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <tr>
                        <td align="center" style="background-color: #532E1F; color: #F1C500; padding: 20px;">
                            <h1>Welcome to the Bronco Challenge!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="padding: 20px;">
                            <p>Hi <strong>${teamName}</strong>,</p>
                            <p>Congratulations on registering for the Bronco Challenge for Sustainable Impact!</p>
                            <p>We're excited to have you on board and can't wait to see the innovative solutions your team will develop. As you embark on this journey, remember that we're here to support you every step of the way.</p>
                            <p>Here are a few next steps to get you started:</p>
                            <ol>
                                <li>Explore the resources available on our <a href="https://wmich.edu/sustainability/initiatives/broncochallenge">platform</a>.</li>
                                <li>Connect with other teams and potential collaborators.</li>
                                <li>Stay tuned for upcoming events and workshops.</li>
                            </ol>
                            <p>If you have any questions or need assistance, don't hesitate to reach out to us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
                            <p>Best of luck, and let the challenge begin!</p>
                            <p>Warm regards,</p>
                            <p>The Bronco Challenge Team</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="background-color: #f0f0f0; padding: 10px;">
                            <p style="font-size: 0.9em;">©2024 Bronco Challenge. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
  await setDoc(
    doc(collection(db, "mail"), (Math.random() * 10000).toString()),
    {
      to: email,
      message: { subject: "Welcome to the Bronco Challenge", text, html },
    }
  )
    .then((c) => {})
    .catch((error) => {
      return null;
    });
}

export async function getAllTeams() {
  try {
    // Get all entries
    const entriesQuery = query(collection(db, "challengeEntry"));

    const querySnapshot = await getDocs(entriesQuery);
    const entries: BRONCO_CHALLENGE_ENTRY[] = [];

    querySnapshot.forEach((doc) => {
      entries.push(doc.data() as BRONCO_CHALLENGE_ENTRY);
    });

    return entries;
  } catch (e) {
    console.error("Error fetching documents: ", e);
    return null;
  }
}

export async function addMembertoTeam(entryId: string, member: PARTICIPANT) {
  try {
    const docRef = doc(db, "challengeEntry", entryId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const entry = docSnap.data() as BRONCO_CHALLENGE_ENTRY;

      //if member is already on the team
      if (entry.memberEmails.indexOf(member.email) > -1) {
        message.error("A member with the same email already exists.");
        return null;
      }
      // Add a new participant document with a generated id
      const ref = doc(collection(db, "participants"));
      const newMember = { ...member, id: ref.id };
      await setDoc(ref, newMember).then(async () => {
        // update the entry
        const members = [...entry.members, newMember];
        const memberEmails = [...entry.memberEmails, member.email];
        const updatedEntry: BRONCO_CHALLENGE_ENTRY = {
          ...entry,
          members,
          memberEmails,
        };
        await setDoc(docRef, updatedEntry);
        await sendWelcomeEmail([member.email], entry.team_name);
        return newMember;
      });
    } else {
      message.error("Document not found!");
      return null;
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
