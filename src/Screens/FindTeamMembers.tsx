import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { PARTICIPANT, skills_and_interests } from "../functions/data";
import Spinner from "../Components/Spinner";
import { findTeamMembers } from "../functions/functions";
import { message } from "antd";
import { MailOutlined } from "@ant-design/icons";

export default function FindTeamMembers() {
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const sdgs = skills_and_interests.flatMap((i) => i.detail).sort();

  const selectSkill = (skill: string) => {
    if (skills.findIndex((x) => x === skill) !== -1) {
      setSkills((prev) => prev.filter((x) => x !== skill));
    } else {
      setSkills((prev) => [...prev, skill]);
    }
  };

  const skillsToString = skills.join(", ");

  const [members, setMembers] = useState<PARTICIPANT[]>([]);

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4">
        <div className="mb-4">
          <label
            htmlFor="sdgs"
            className="block mb-4 text-lg font-bold text-gray-900 dark:text-white"
          >
            What skills are you looking for in a teammate?
          </label>

          <ul className="w-full text-sm h-40 overflow-x-auto font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ">
            {sdgs.map((i, index) => (
              <li
                key={index}
                className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600"
              >
                <div className="flex items-center ps-3">
                  <input
                    id={i}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    defaultChecked={skills.findIndex((x) => x === i) !== -1}
                    onChange={() => selectSkill(i)}
                  />
                  <label
                    htmlFor="vue-checkbox"
                    className="w-full py-3 ms-2   text-gray-900 dark:text-gray-300"
                  >
                    {i}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="my-2 text-sm">{skillsToString}</p>
        <button
          onClick={async () => {
            if (!skills.length) {
              return message.warning("Select one or more skills.");
            }
            setLoading(true);
            setMembers([]);
            await findTeamMembers(skills)
              .finally(() => {
                setLoading(false);
              })
              .then((result) => {
                setMembers(result || []);
              })
              .catch(() => {
                message.error("Error loading matches, Try again!");
              });
          }}
          className="flex gap-x-3 justify-center items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Find Teammates
          {loading && <Spinner />}
        </button>
        {members.length > 0 && (
          <div className="my-4">
            <hr />
            <h1 className="font-bold text-xl mb-2">
              {members.length} matches found
            </h1>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {members.map((i, index) => (
                <li key={index} className="py-3 sm:py-4">
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                      <span className="font-medium text-gray-600 dark:text-gray-300">
                        {fullNameInitials(i.name)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {i.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        {i.email}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        Major: {i.academic_major}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        Level: {i.academic_level}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        Skills: {i.skills.join(", ")}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      <a href={`mailto:${i.email}`}>
                        <MailOutlined />
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  function fullNameInitials(name: string): React.ReactNode {
    return `${name.split(" ")[0][0] || ""}${name.split(" ")[1][0] || ""}`;
  }
}
