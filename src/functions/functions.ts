import { BRONCO_CHALLENGE_ENTRY, entriesMock, membersMock } from "./data";

export async function addNewSubmission(entry: BRONCO_CHALLENGE_ENTRY) {
  try {
    console.log({ entry });

    return entry;
  } catch (error) {
    return null;
  }
}
export async function findTeamMembers(skills: string[]) {
  try {
    return membersMock;
  } catch (error) {
    return null;
  }
}
export async function findTeams(skills: string[]) {
  try {
    return entriesMock;
  } catch (error) {
    return null;
  }
}
