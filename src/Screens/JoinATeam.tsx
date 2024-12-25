import { FormEvent, useState } from "react";
import Navbar from "../Components/Navbar";
import Spinner from "../Components/Spinner";
import { message, Modal, Select, SelectProps } from "antd";
import {
  academicLevels,
  majors,
  PARTICIPANT,
  sdgs,
  skills_and_interests,
} from "../firebase/data";
import { crewateMember } from "../firebase/functions";
import { useNavigate } from "react-router-dom";

export default function JoinATeam() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [sdgsSelected, setSdgsSelected] = useState<string[]>([]);
  const [major, setMajor] = useState("");
  const [academic_level, setAcademic_level] = useState("");

  const [loading, setLoading] = useState(false);

  const skillsets = skills_and_interests.flatMap((i) => i.detail).sort();

  const majorsOptions: SelectProps["options"] = majors.map((i) => {
    return { label: i.name, value: i.name };
  });
  const levelsOptions: SelectProps["options"] = academicLevels.map((i) => {
    return { label: i, value: i };
  });
  const skillsOptions: SelectProps["options"] = skillsets.map((i) => {
    return { label: i, value: i };
  });

  const sdgOptions: SelectProps["options"] = sdgs.map((i) => {
    return { label: `SDG ${i.id} - ${i.short}`, value: i.id };
  });
  const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();

  const countDown = () => {
    let secondsToGo = 5;
    const goto = () => {
      navigate("/students", { replace: true });
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
    if (!academic_level) return message.error("Select a major!");
    if (!academic_level) return message.error("Select an academic level!");
    if (!skills.length) return message.error("Select one or more skills!");
    if (!sdgsSelected.length) return message.error("Select one or more SDGs!");
    const participant: PARTICIPANT = {
      academic_major: major,
      email,
      id: "",
      name,
      sdgsOfInterest: sdgsSelected,
      skills,
      academic_level,
      time: Date.now().toString(),
      active: true,
    };

    setLoading(true);
    await crewateMember(participant)
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
        <h1 className="text-3xl mb-8">Share your skills and interests</h1>
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 d"
              placeholder="John Doe"
              required
              onChange={(e) => {
                setName(e.target.value);
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 d"
              placeholder="first.last@wmich.edu"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="major"
            className="block mb-4 text-sm font-medium text-gray-900 "
          >
            What's your major?
          </label>
          <Select
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg  focus:ring-blue-500 focus:border-blue-500 d"
            style={{ width: "100%" }}
            placeholder="Please select"
            onChange={setMajor}
            options={majorsOptions}
            size="large"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="major"
            className="block mb-4 text-sm font-medium text-gray-900 "
          >
            What's your academic level?
          </label>
          <Select
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg  focus:ring-blue-500 focus:border-blue-500 d"
            style={{ width: "100%" }}
            placeholder="Please select"
            onChange={setAcademic_level}
            options={levelsOptions}
            size="large"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="sdgs"
            className="block mb-4 text-sm font-medium text-gray-900 "
          >
            What skillsets do you have?
          </label>
          <Select
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg  focus:ring-blue-500 focus:border-blue-500 d"
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select"
            onChange={setSkills}
            options={skillsOptions}
            size="large"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="sdgs"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            What SDGs are you interested in?
          </label>
          <Select
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg  focus:ring-blue-500 focus:border-blue-500 d"
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select"
            onChange={setSdgsSelected}
            options={sdgOptions}
            size="large"
          />
        </div>

        <button
          type="submit"
          className="flex gap-x-3 justify-center items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center "
        >
          Advertise my interests and skills
          {loading && <Spinner />}
        </button>
      </form>
    </div>
  );
}
