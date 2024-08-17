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
            <div className="flex justify-between items-center ">
              <h1 className="text-2xl font-bold dark:text-gray-400">
                Teams' student requests
              </h1>
              <Link
                to="/join-a-team"
                className=" flex gap-x-3 justify-center items-center py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 "
              >
                Advertise your interests and skills
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
