import { FormEvent, useState } from "react";
import Navbar from "../Components/Navbar";
import {
  sdgs,
  academicLevels,
  grad_and_undergrad_majors,
  PARTICIPANT,
  UN_SDG,
  BRONCO_CHALLENGE_ENTRY,
  PARTICIPATION_STATUS,
  skills_and_interests,
} from "../firebase/data";
import { Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { addEntry } from "../firebase/functions";

export default function Apply() {
  const [members, setMembers] = useState<PARTICIPANT[]>([]);
  const [mFullName, setMFullName] = useState("");
  const [mEmail, setMEmail] = useState("");
  const [mMajor, setMMajor] = useState(grad_and_undergrad_majors[0]);
  const [mLevel, setmLevel] = useState(academicLevels[0]);
  const [yourFullName, setYourFullName] = useState("");
  const [yourEmail, setYourEmail] = useState("");
  const [yourMajor, setYourMajor] = useState(grad_and_undergrad_majors[0]);
  const [yourLevel, setYourLevel] = useState(academicLevels[0]);
  const [teamName, setTeamName] = useState("");
  const [teamSdgs, setTeamSdgs] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const skillsets = skills_and_interests.flatMap((i) => i.detail).sort();
  const selectSkill = (skill: string) => {
    if (skills.findIndex((x) => x === skill) !== -1) {
      setSkills((prev) => prev.filter((x) => x !== skill));
    } else {
      setSkills((prev) => [...prev, skill]);
    }
  };
  const skillsToString = skills.join(", ");

  const addNewMember = () => {
    if (!mEmail) return message.warning("Member's email is required");
    if (!mFullName) return message.warning("Member's name is required");
    const newMember: PARTICIPANT = {
      academic_level: mLevel,
      academic_major: mMajor,
      email: mEmail,
      name: mFullName,
      skills: [],
      team: [],
      id: "",
    };
    setMembers([...members, newMember]);
    setMEmail("");
    setMFullName("");
  };

  const deleteMember = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const selectSDG = (sdg: UN_SDG) => {
    if (teamSdgs.findIndex((x) => x === sdg.id) !== -1) {
      setTeamSdgs((prev) => prev.filter((x) => x !== sdg.id));
    } else {
      teamSdgs.push(sdg.id);
    }
  };

  const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();
  const countDown = () => {
    let secondsToGo = 5;
    const instance = modal.success({
      title:
        "You have successfully submitted your entry for the Bronco Challenge",
      content: `You will be redirected after ${secondsToGo} second.`,
      onOk: () => {
        navigate("/");
      },
      afterClose: () => {
        navigate("/");
      },
      okText: "Redirect now",
    });

    const timer = setInterval(() => {
      secondsToGo -= 1;
      instance.update({
        content: `You will be redirected after ${secondsToGo} second.`,
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      instance.destroy();
    }, secondsToGo * 1000);
  };

  const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!skills.length) {
      return message.warning("Select one or more skills.");
    }
    if (!teamSdgs.length) {
      return message.warning("Select one or more SDGs.");
    }
    const newSubmision: BRONCO_CHALLENGE_ENTRY = {
      members: [
        ...members,
        {
          academic_level: yourLevel,
          academic_major: yourMajor,
          email: yourEmail,
          name: yourFullName,
          skills,
          team: [],
          id: "",
        },
      ],
      participation_status: PARTICIPATION_STATUS.ON_A_TEAM,
      sdgs_of_interest: teamSdgs,
      team_name: teamName,
      id: "",
      desired_skills: [],
      memberEmails: [...members.map((i) => i.email), yourEmail],
    };

    setLoading(true);
    await addEntry(newSubmision)
      .then(countDown)
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <Navbar />
      {contextHolder}
      <form onSubmit={onSubmitForm} className="max-w-2xl mx-auto p-4">
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
        <div className="mb-2">
          <label
            htmlFor="teamName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Team Name
          </label>
          <input
            type="text"
            id="teamName"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            onChange={(e) => {
              setTeamName(e.target.value);
            }}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="sdgs"
            className="block mb-4 text-sm font-medium text-gray-900 dark:text-white"
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
        <div className="mb-4">
          <label
            htmlFor="sdgs"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            SDGs of Interest
          </label>

          <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ">
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
                      teamSdgs.findIndex((x) => x === i.id) !== -1
                    }
                    onChange={() => selectSDG(i)}
                  />
                  <label
                    htmlFor="vue-checkbox"
                    className="w-full py-3 ms-2   text-gray-900 dark:text-gray-300"
                  >
                    <h5 className="font-bold">
                      SDG {i.id} - {i.short}
                    </h5>
                    <p className="text-xs">{i.details}</p>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Team members
          </label>

          <ul className="ps-5 my-2 space-y-1 list-decimal list-inside">
            {members.map((i, index) => (
              <li key={index}>
                <div className="flex justify-between">
                  <div>
                    {i.name} - {i.email}
                    <br />
                    {i.academic_major} - {i.academic_level}
                  </div>
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() => deleteMember(index)}
                  >
                    delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="p-4 border rounded">
            <h4 className="mb-2">Add new team member</h4>
            <div className=" grid gap-6 mb-6 md:grid-cols-2">
              <div className="mb-2">
                <label
                  htmlFor="memberFullName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Member's Full Name
                </label>
                <input
                  type="text"
                  id="memberFullName"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="John Doe"
                  onChange={(e) => {
                    setMFullName(e.target.value);
                  }}
                  value={mFullName}
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="memberEmail"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Member's email
                </label>
                <input
                  type="email"
                  id="memberEmail"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@wmich.edu"
                  onChange={(e) => {
                    setMEmail(e.target.value);
                  }}
                  value={mEmail}
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="memberAcademicMajor"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Member's Academic Major
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="memberAcademicMajor"
                  id="memberAcademicMajor"
                  onChange={(e) => {
                    setMMajor(e.target.value);
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
                  htmlFor="memberAcademicLevel"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Member's Academic Level
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="memberAcademicLevel"
                  id="memberAcademicLevel"
                  onChange={(e) => {
                    setmLevel(e.target.value);
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
            <button
              type="button"
              onClick={addNewMember}
              className="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add new member
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="flex gap-x-3 justify-center items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit application
          {loading && <Spinner />}
        </button>
      </form>
    </div>
  );
}
