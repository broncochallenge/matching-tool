import {
  collection,
  writeBatch,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  or,
} from "firebase/firestore";
import { db } from "./config";
import { BRONCO_CHALLENGE_ENTRY, PARTICIPANT } from "./data";

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
    await setDoc(newEntryRef, {
      ...entry,
      members,
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
