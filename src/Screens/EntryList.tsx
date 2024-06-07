import React, { useEffect, useState } from "react";
import { Modal, Popover, Space, Table, Tag, message } from "antd";
import type { TableProps } from "antd";
import Navbar from "../Components/Navbar";
import {
  BRONCO_CHALLENGE_ENTRY,
  PARTICIPANT,
  academicLevels,
  grad_and_undergrad_majors,
} from "../firebase/data";
import { addMembertoTeam, getAllTeams } from "../firebase/functions";
import { InfoCircleOutlined } from "@ant-design/icons";
import Spinner from "../Components/Spinner";

const EntryList: React.FC = () => {
  const [entries, setEntries] = useState<BRONCO_CHALLENGE_ENTRY[]>([]);

  useEffect(() => {
    async function fetchMyAPI() {
      let response = await getAllTeams();
      if (response) {
        setEntries(response);
      }
    }

    fetchMyAPI();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<BRONCO_CHALLENGE_ENTRY>();
  const [mFullName, setMFullName] = useState("");
  const [mEmail, setMEmail] = useState("");
  const [mMajor, setMMajor] = useState(grad_and_undergrad_majors[0]);
  const [mLevel, setmLevel] = useState(academicLevels[0]);
  const [loading, setLoading] = useState(false);

  const showModal = (entry: BRONCO_CHALLENGE_ENTRY) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const addNewMember = async () => {
    if (!mFullName) return message.warning("Member's name is required");
    if (!mEmail) return message.warning("Member's email is required");
    const newMember: PARTICIPANT = {
      academic_level: mLevel,
      academic_major: mMajor,
      email: mEmail,
      name: mFullName,
      skills: [],
      team: [],
      id: "",
    };
    if (!selectedEntry) return message.error("Error getting team details!");
    setLoading(true);

    await addMembertoTeam(selectedEntry?.id, newMember)
      .then((response) => {
        if (response) {
          const idx = entries.findIndex((x) => x.id === selectedEntry.id);
          const e = [...entries];
          e.splice(idx, 1, {
            ...selectedEntry,
            members: [...selectedEntry.members, newMember],
            memberEmails: [...selectedEntry.memberEmails, newMember.email],
          });
          setEntries(e);
          setMEmail("");
          setMFullName("");
          handleOk();
        }
      })
      .finally(() => {
        setLoading(false);
      })
      .catch(() => {
        message.error("Error adding new member!");
      });
  };

  const columns: TableProps<BRONCO_CHALLENGE_ENTRY>["columns"] = [
    {
      title: "Team Name",
      dataIndex: "team_name",
      key: "team_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "SDGs",
      key: "sdg",
      dataIndex: "sdg",
      render: (_, { sdgs_of_interest }) => (
        <>
          {sdgs_of_interest.map((sdg) => {
            return <Tag key={sdg}> SDG #{sdg.toUpperCase()}</Tag>;
          })}
        </>
      ),
    },
    {
      title: "Team members",
      key: "record.id",
      dataIndex: "record.id",
      render: (_: any, record: BRONCO_CHALLENGE_ENTRY) => {
        const TeamMember = (member: PARTICIPANT) => {
          const content = (
            <div className="max-w-52">
              <p>
                <b>Name</b>: {member.name}
              </p>
              <p>
                <b>Email</b>: {member.email}
              </p>
              <p>
                <b>Academic Level</b>: {member.academic_level}
              </p>
              <p>
                <b>Academic Major</b>: {member.academic_major}
              </p>
              <p>
                <b>Skills</b>: {member.skills.toLocaleString()}
              </p>
            </div>
          );

          return (
            <Space>
              <div>{member.name}</div>
              <Popover content={content} title="Member details" trigger="click">
                <InfoCircleOutlined />
              </Popover>
            </Space>
          );
        };

        return (
          <Space size="middle" direction="vertical">
            {record.members.map((i, index) => (
              <TeamMember key={index} {...i} />
            ))}

            <button onClick={() => showModal(record)} className="text-blue-500">
              Add new member
            </button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-4 ">
        <Table bordered columns={columns} dataSource={entries} />
      </div>
      <Modal
        title={`Add new member to "${selectedEntry?.team_name || ""}"`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
      >
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
            className="flex gap-x-3 justify-center items-center text-white bg-wmu_brown hover:bg-wmu_brown focus:ring-4 focus:outline-none focus:ring-wmu_brown font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-wmu_brown dark:hover:bg-wmu_brown dark:focus:ring-wmu_brown"
          >
            Add new member{loading && <Spinner />}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EntryList;
