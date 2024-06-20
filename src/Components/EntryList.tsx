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
            <h1 className="text-2xl font-bold">Teams' members request</h1>
          }
          bordered
          itemLayout="vertical"
          dataSource={entries}
          loading={loading}
          renderItem={(item) => (
            <List.Item
              actions={[
                <a key="list-loadmore-edit">☎️ Phone: {item.phone}</a>,
                <a href={`tel:${item.phone}`} key="list-loadmore-more">
                  Call {item.name}
                </a>,
              ]}
            >
              <List.Item.Meta
                title={
                  <div>
                    <h1>Posted by: {item.name}</h1>
                    <h1>Team: {item.teamName}</h1>
                  </div>
                }
                description={item.message}
              />
              <div>
                Skills we are looking for:{" "}
                {(item.desired_skills || []).join(", ")}
              </div>
              <div>
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
