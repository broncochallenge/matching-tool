import React, { useEffect, useState } from "react";
import { List, Space, Tag } from "antd";
import { MATCH_REQUEST_ENTRY } from "../firebase/data";
import { getAllTeams } from "../firebase/functions";

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
            <h1 className="text-2xl font-bold dark:text-gray-400">
              Teams' members request
            </h1>
          }
          bordered
          locale={{
            emptyText: "No member requests at the moment. Check back later.",
          }}
          itemLayout="vertical"
          dataSource={entries}
          loading={loading}
          className="dark:text-gray-400"
          renderItem={(item) => (
            <List.Item
              actions={[
                <a
                  href="#"
                  className="dark:text-gray-400"
                  key="list-loadmore-edit"
                >
                  📧 Email: {item.email}
                </a>,
                <a
                  className="dark:text-gray-400"
                  href={`mailto:${item.email}`}
                  key="list-loadmore-more"
                >
                  Email {item.name}
                </a>,
              ]}
            >
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
                  <strong>Majors of current members:</strong> &nbsp;
                  {(item.teamMajors || []).join(", ")}
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
