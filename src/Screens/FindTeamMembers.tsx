import { FormEvent, useState } from "react";
import Navbar from "../Components/Navbar";
import {
  sdgs,
  UN_SDG,
  MATCH_REQUEST_ENTRY,
  PARTICIPATION_STATUS,
  skills_and_interests,
} from "../firebase/data";
import { Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { addEntry, loginWithToken } from "../firebase/functions";

export default function FindTeamMembers() {
  const [phone, setPhone] = useState("");
  const [messageText, setMessageText] = useState("");
  const [yourFullName, setYourFullName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamSdgs, setTeamSdgs] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const token = new URLSearchParams(window.location.search).get("token");

  const skillsets = skills_and_interests.flatMap((i) => i.detail).sort();
  const selectSkill = (skill: string) => {
    if (skills.findIndex((x) => x === skill) !== -1) {
      setSkills((prev) => prev.filter((x) => x !== skill));
    } else {
      setSkills((prev) => [...prev, skill]);
    }
  };
  const skillsToString = skills.join(", ");

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
      title: "Successful.",
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
      phone,
    };

    setLoading(true);

    await loginWithToken(token || "")
      .finally(() => {
        setLoading(false);
      })
      .then(async (response) => {
        if (response) {
          await addEntry(newSubmision)
            .then(countDown)
            .finally(() => {
              setLoading(false);
            });
        } else {
          navigate(`/`);
        }
      })
      .catch(() => {
        message.error("Error adding entry. Try again!");
      });
  };

  return (
    <div className="dark:bg-gray-800 min-h-screen">
      <Navbar />
      {contextHolder}
      <form onSubmit={onSubmitForm} className="max-w-2xl mx-auto p-4">
        <div className="grid gap-x-6 md:grid-cols-2">
          <div className="mb-2">
            <label
              htmlFor="fullName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Name
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
              htmlFor="phone"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Phone
            </label>
            <input
              type="tel"
              autoComplete="mobile tel"
              id="phone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="(000) 000 0000"
              required
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="mb-2">
          <label
            htmlFor="teamName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your Team Name
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
        <div className="mb-2">
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your message to potential team members
          </label>
          <textarea
            id="message"
            onChange={(e) => {
              setMessageText(e.target.value);
            }}
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Hey there, we are Team [Your Team Name] working on solving problems related to [Your SDG Focus]."
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="sdgs"
            className="block mb-4 text-sm font-medium text-gray-900 dark:text-white"
          >
            What skills are you looking for in a teammate?
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
            Select the Sustainable Development Goals relevant to your project
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
        <p className="my-2 text-sm">{skillsToString}</p>

        <button
          type="submit"
          className="flex gap-x-3 justify-center items-center text-wmu_brown bg-wmu_gold hover:bg-wmu_gold focus:ring-4 focus:outline-none focus:ring-wmu_gold font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-wmu_gold dark:hover:bg-wmu_gold dark:focus:ring-wmu_gold"
        >
          Find Teammates
          {loading && <Spinner />}
        </button>
      </form>
    </div>
  );
}
