import React, { useEffect, useState } from "react";
import { List, Space, Tag } from "antd";
import { MATCH_REQUEST_ENTRY } from "../firebase/data";
import { getAllTeams } from "../firebase/functions";

const EntryList: React.FC = () => {
  const [entries, setEntries] = useState<MATCH_REQUEST_ENTRY[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchMyAPI() {
      setLoading(true);
      let response = await getAllTeams();
      setLoading(false);

      if (response) {
        setEntries(response);
      }
    }

    fetchMyAPI();
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
                  ☎️ Phone: {item.phone}
                </a>,
                <a
                  className="dark:text-gray-400"
                  href={`tel:${item.phone}`}
                  key="list-loadmore-more"
                >
                  Call {item.name}
                </a>,
              ]}
            >
              <List.Item.Meta
                title={
                  <div>
                    <h1 className="dark:text-gray-400">
                      Posted by: {item.name}
                    </h1>
                    <h1 className="dark:text-gray-400">
                      Team: {item.teamName}
                    </h1>
                  </div>
                }
                description={
                  <p className="dark:text-gray-400">{item.message}</p>
                }
              />
              <div className="dark:text-gray-400">
                Skills we are looking for:{" "}
                {(item.desired_skills || []).join(", ")}
              </div>
              <div className="dark:text-gray-400">
                SDGs of Interest: &nbsp;
                <Space wrap>
                  {(item.sdgsOfInterest || []).map((sdg) => {
                    return <Tag key={sdg}> SDG #{sdg.toUpperCase()}</Tag>;
                  })}
                </Space>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default EntryList;
