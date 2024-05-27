import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import {
  BRONCO_CHALLENGE_ENTRY,
  academicLevels,
  grad_and_undergrad_majors,
  sdgs,
  skills_and_interests,
} from "../firebase/data";
import Spinner from "../Components/Spinner";
import { message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { getTeams } from "../firebase/functions";

export default function JoinATeam() {
  const [skills, setSkills] = useState<string[]>([]);
  const [sdgsSelected, setSdgsSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [yourFullName, setYourFullName] = useState("");
  const [yourEmail, setYourEmail] = useState("");
  const [yourMajor, setYourMajor] = useState(grad_and_undergrad_majors[0]);
  const [yourLevel, setYourLevel] = useState(academicLevels[0]);

  const skillsets = skills_and_interests.flatMap((i) => i.detail).sort();

  const selectSkill = (skill: string) => {
    if (skills.findIndex((x) => x === skill) !== -1) {
      setSkills((prev) => prev.filter((x) => x !== skill));
    } else {
      setSkills((prev) => [...prev, skill]);
    }
  };
  const selectSdg = (sdg: string) => {
    if (sdgsSelected.findIndex((x) => x === sdg) !== -1) {
      setSdgsSelected((prev) => prev.filter((x) => x !== sdg));
    } else {
      setSdgsSelected((prev) => [...prev, sdg]);
    }
  };

  const skillsToString = skills.join(", ");
  const sdgsToString = sdgsSelected.map((i) => `SDG ${i}`).join(", ");

  const [entries, setEntries] = useState<BRONCO_CHALLENGE_ENTRY[]>([]);

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<boolean | undefined> => {
    e.preventDefault();
    if (!skills.length) {
      return message.warning("Select one or more skills.");
    }
    if (!sdgsSelected.length) {
      return message.warning("Select one or more SDGs.");
    }
    setLoading(true);
    setEntries([]);
    await getTeams(skills, sdgsSelected, {
      academic_level: yourLevel,
      academic_major: yourMajor,
      email: yourEmail,
      name: yourFullName,
      skills,
      team: [],
      id: "",
    })
      .finally(() => {
        setLoading(false);
      })
      .then((result) => {
        setEntries(result || []);
        window.scrollTo({
          top: document.body.scrollHeight - 500,
          behavior: "smooth",
        });
      })
      .catch(() => {
        message.error("Error loading matches, Try again!");
      });
  };
  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={onSubmit}>
          <div className="grid gap-x-6 md:grid-cols-2">
            <div className="mb-2">
              <label
                htmlFor="fullName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Full Name
              </label>
              <input
                type="text"
                autoComplete="given-name"
                id="fullName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="John Doe"
                required
                onChange={(e) => {
                  setYourFullName(e.target.value);
                }}
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@wmich.edu"
                required
                onChange={(e) => {
                  setYourEmail(e.target.value);
                }}
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="academicMajor"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your Academic Major
              </label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="academicMajor"
                id="academicMajor"
                onChange={(e) => {
                  setYourMajor(e.target.value);
                }}
              >
                {grad_and_undergrad_majors.map((i, index) => (
                  <option key={index} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label
                htmlFor="academicLevel"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your Academic Level
              </label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="academicLevel"
                id="academicLevel"
                onChange={(e) => {
                  setYourLevel(e.target.value);
                }}
              >
                {academicLevels.map((i, index) => (
                  <option key={index} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="sdgs"
              className="block mb-4 text-lg font-bold text-gray-900 dark:text-white"
            >
              What SDGs are you interested in?
            </label>
            <ul className="w-full text-sm h-40 overflow-x-auto font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ">
              {sdgs.map((i, index) => (
                <li
                  key={index}
                  className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600"
                >
                  <div className="flex items-center ps-3">
                    <input
                      id={i.id}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      defaultChecked={
                        sdgsSelected.findIndex((x) => x === i.id) !== -1
                      }
                      onChange={() => selectSdg(i.id)}
                    />
                    <label
                      htmlFor="vue-checkbox"
                      className="w-full py-3 ms-2   text-gray-900 dark:text-gray-300"
                    >
                      SDG {i.id} - {i.short}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p className="my-2 text-sm">{sdgsToString}</p>
          <div className="mb-4">
            <label
              htmlFor="sdgs"
              className="block mb-4 text-lg font-bold text-gray-900 dark:text-white"
            >
              What skillsets do you have?
            </label>
            <ul className="w-full text-sm h-40 overflow-x-auto font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ">
              {skillsets.map((i, index) => (
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
            type="submit"
            className="flex gap-x-3 justify-center items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Find Teams
            {loading && <Spinner />}
          </button>
        </form>
        <div>
          {entries.length > 0 && (
            <div className="my-4">
              <hr />
              <h1 className="font-bold text-xl mb-2">
                {entries.length} teams found
              </h1>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {entries.map((i, index) => (
                  <li key={index} className="py-3 sm:py-4">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {i.team_name}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          SDGs of Interest:{" "}
                          {i.sdgs_of_interest.map((i) => `SDG ${i}`).join(", ")}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          {i.members.length} members
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        <a href={`mailto:${i.members[0].email}`}>
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
        <div className="h-96" />
      </div>
    </div>
  );
}
