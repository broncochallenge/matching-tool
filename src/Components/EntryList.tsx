import React, { useEffect, useState } from "react";
import { List, Space, Tag } from "antd";
import { MATCH_REQUEST_ENTRY } from "../firebase/data";
import { getAllTeams } from "../firebase/functions";
import { Link } from "react-router-dom";

const EntryList: React.FC = () => {
  const [entries, setEntries] = useState<MATCH_REQUEST_ENTRY[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchMemberRequests() {
      setLoading(true);
      let response = await getAllTeams();
      setLoading(false);

      if (response) {
        setEntries(response);
      }
    }

    fetchMemberRequests();
  }, []);

  return (
    <div>
      <div className="max-w-3xl mx-auto p-4 ">
        <List
          header={
            <div className="flex justify-between items-center flex-wrap gap-3">
              <h1 className="text-2xl font-bold dark:text-gray-400">
                Teams' student requests
              </h1>
              <Link
                to="/join-a-team"
                className="dark:bg-wmu_brown flex gap-x-2 justify-center items-center py-2.5 px-5 me-2 mb-2 text-sm font-medium text-white focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-wmu_brown focus:z-10 focus:ring-4 focus:ring-wmu_brown "
              >
                Advertise your interests and skills{" "}
                <svg
                  className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </Link>
            </div>
          }
          extra={<div>EntryList</div>}
          bordered
          locale={{
            emptyText: "No member requests at the moment. Check back later.",
          }}
          itemLayout="vertical"
          dataSource={entries}
          loading={loading}
          className="dark:text-gray-400"
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div>
                    <h1 className="dark:text-gray-400">
                      <strong>Posted by:</strong> {item.name}
                    </h1>
                    <h1 className="dark:text-gray-400">
                      <strong>Team:</strong> {item.teamName}
                    </h1>
                  </div>
                }
                description={
                  <p className="dark:text-gray-400">{item.message}</p>
                }
              />
              <Space direction="vertical" size={"middle"}>
                <div className="dark:text-gray-400">
                  <strong>Skills we are looking for:</strong>{" "}
                  {(item.desired_skills || []).join(", ")}
                </div>
                <div className="dark:text-gray-400">
                  <strong>SDGs of Interest:</strong> &nbsp;
                  <Space wrap>
                    {(item.sdgsOfInterest || []).map((sdg) => {
                      return <Tag key={sdg}> SDG #{sdg.toUpperCase()}</Tag>;
                    })}
                  </Space>
                </div>
                <div className="dark:text-gray-400">
                  <strong>Majors of current students:</strong> &nbsp;
                  {(item.teamMajors || []).join(", ")}
                </div>
                <div className="dark:text-gray-400">
                  <strong>Email:</strong> &nbsp;
                  {item.email}
                </div>
              </Space>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default EntryList;
