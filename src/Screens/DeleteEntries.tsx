import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { MATCH_REQUEST_ENTRY, PARTICIPANT } from "../firebase/data";
import {
  makeEntryInActive,
  makeMemberInActive,
  getActiveEntriesByEmail,
  getActiveMembersByEmail,
} from "../firebase/functions";
import { message, Spin } from "antd";
import moment from "moment";
import base64 from "base-64";

export default function DeleteEntries() {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedData = urlParams.get("data") || "";
  var email = base64.decode(encodedData);

  const [members, setMembers] = useState<PARTICIPANT[]>([]);
  const [entries, setEntries] = useState<MATCH_REQUEST_ENTRY[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState("");

  useEffect(() => {
    async function fetchMemberRequests() {
      setLoading(true);
      let response = await getActiveEntriesByEmail(email);
      setLoading(false);

      if (response) {
        setEntries(response);
      }
    }

    fetchMemberRequests();
  }, []);

  useEffect(() => {
    async function fetchMemberRequests() {
      setLoadingMembers(true);
      await getActiveMembersByEmail(email)
        .finally(() => {
          setLoadingMembers(false);
        })
        .then((result) => {
          setMembers(result || []);
        })
        .catch(() => {
          message.error("Error loading matches, Try again!");
        });
    }

    fetchMemberRequests();
  }, []);

  const allitems = [...members, ...entries];
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto p-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
              Your Entries {(loading || loadingMembers) && <Spin />}
              <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                {!allitems.length && !(loading || loadingMembers)
                  ? "There are no active entries here. "
                  : "Here is the list of your entries."}
              </p>
            </caption>
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Creator Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>

                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {allitems.map((i, index) => (
                <tr
                  className={`bg-white border-b dark:bg-gray-800 ${
                    index < allitems.length - 1 && "dark:border-gray-700"
                  }`}
                  key={index}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {i.name}
                  </th>
                  <td className="px-6 py-4">
                    {isParticipant(i)
                      ? "Skill and interest details"
                      : "Team member request"}
                  </td>

                  <td className="px-6 py-4">
                    {moment(Number(i.time)).fromNow()}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      disabled={deleting !== ""}
                      onClick={() => deleteItem(i)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline disabled:no-underline disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                      Delete {deleting === i.id && <Spin />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  async function deleteItem(i: PARTICIPANT | MATCH_REQUEST_ENTRY) {
    setDeleting(i.id);
    if (isParticipant(i)) {
      await makeMemberInActive(i.id)
        .then(() => {
          const newMembers = members.filter((x) => x.id !== i.id);
          setMembers(newMembers);
        })
        .finally(() => {
          setDeleting("");
        });
    } else {
      await makeEntryInActive(i.id)
        .then(() => {
          const newRequests = entries.filter((x) => x.id !== i.id);
          setEntries(newRequests);
        })
        .finally(() => {
          setDeleting("");
        });
    }
  }
}

function isParticipant(i: PARTICIPANT | MATCH_REQUEST_ENTRY): i is PARTICIPANT {
  return (i as PARTICIPANT).academic_major !== undefined;
}
