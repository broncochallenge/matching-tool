import { FormEvent, useState } from "react";
import Navbar from "../Components/Navbar";
import {
  sdgs,
  MATCH_REQUEST_ENTRY,
  PARTICIPATION_STATUS,
  skills_and_interests,
  grad_and_undergrad_majors,
} from "../firebase/data";
import { Modal, Select, SelectProps, message } from "antd";
import { useNavigate } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { addEntry } from "../firebase/functions";

export default function FindTeamMembers() {
  const [email, setEmail] = useState("");
  const [messageText, setMessageText] = useState("");
  const [yourFullName, setYourFullName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamSdgs, setTeamSdgs] = useState<string[]>([]);
  const [teamMajors, setTeamMajors] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const skillsets = skills_and_interests.flatMap((i) => i.detail).sort();
  const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();
  const countDown = () => {
    let secondsToGo = 5;
    const goto = () => {
      navigate("/team-requests");
    };
    const instance = modal.success({
      title: "Successful.",
      content: `You will be redirected after ${secondsToGo} second.`,
      onOk: goto,
      afterClose: goto,
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
    const newSubmision: MATCH_REQUEST_ENTRY = {
      id: "",
      members: [],
      participation_status: PARTICIPATION_STATUS.ON_A_TEAM,
      memberEmails: [],
      // important data
      name: yourFullName,
      teamName: teamName,
      message: messageText,
      desired_skills: skills,
      sdgsOfInterest: teamSdgs,
      email: email,
      teamMajors,
      time: Date.now().toString(),
      active: true,
    };

    setLoading(true);
    await addEntry(newSubmision)
      .then(countDown)
      .finally(() => {
        setLoading(false);
      });
  };

  const teamsMajorsOptions: SelectProps["options"] =
    grad_and_undergrad_majors.map((i) => {
      return { label: i, value: i };
    });
  const skillsOptions: SelectProps["options"] = skillsets.map((i) => {
    return { label: i, value: i };
  });
  const sdgOptions: SelectProps["options"] = sdgs.map((i) => {
    return { label: `SDG ${i.id} - ${i.short}`, value: i.id };
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      {contextHolder}
      <form onSubmit={onSubmitForm} className="max-w-2xl mx-auto p-4">
        <h2 className="text-3xl mb-4">
          Identify yourself and describe what you need in a team member.
        </h2>
        <div className="grid gap-x-6 md:grid-cols-2">
          <div className="mb-2">
            <label
              htmlFor="fullName"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Your Name
            </label>
            <input
              type="text"
              autoComplete="given-name"
              id="fullName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
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
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Your email
            </label>
            <input
              type="email"
              autoComplete="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="first.last@wmich.edu"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="mb-2">
          <label
            htmlFor="teamName"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Your Team Name
          </label>
          <input
            type="text"
            id="teamName"
            placeholder="The Awesome Avengers"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            required
            onChange={(e) => {
              setTeamName(e.target.value);
            }}
          />
        </div>
        <div className="mb-2">
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Your message to potential team members
          </label>
          <textarea
            id="message"
            onChange={(e) => {
              setMessageText(e.target.value);
            }}
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
            placeholder="Hey there, we are Team [Your Team Name] working on solving problems related to [Your SDG Focus]."
          ></textarea>
        </div>
        <div className="mb-2">
          <label
            htmlFor="teamMembersMajors"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Your current team members' Majors
          </label>

          <Select
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg  focus:ring-blue-500 focus:border-blue-500 "
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select"
            onChange={setTeamMajors}
            options={teamsMajorsOptions}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="sdgs"
            className="block mb-4 text-sm font-medium text-gray-900 "
          >
            What skills are you looking for in a teammate?
          </label>
          <Select
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg  focus:ring-blue-500 focus:border-blue-500 "
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select"
            onChange={setSkills}
            options={skillsOptions}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="sdgs"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Select the Sustainable Development Goals relevant to your project
          </label>
          <Select
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg  focus:ring-blue-500 focus:border-blue-500 "
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select"
            onChange={setTeamSdgs}
            options={sdgOptions}
          />
        </div>

        <button
          type="submit"
          className="flex gap-x-3 justify-center items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center "
        >
          Find Teammates
          {loading && <Spinner />}
        </button>
      </form>
    </div>
  );
}
