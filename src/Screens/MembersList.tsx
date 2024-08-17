import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { List, message, Space } from "antd";
import { PARTICIPANT } from "../firebase/data";
import { getAllMembers } from "../firebase/functions";
import { Link } from "react-router-dom";

export default function MembersList() {
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [members, setMembers] = useState<PARTICIPANT[]>([]);

  useEffect(() => {
    async function fetchMemberRequests() {
      setLoadingMembers(true);
      await getAllMembers()
        .finally(() => {
          setLoadingMembers(false);
        })
        .then((result) => {
          setMembers(result || []);
        })
        .catch(() => {
          message.error("Error loading matches, Try again!");
        });
    }

    fetchMemberRequests();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4">
        <List
          header={
            <div className="flex justify-between items-center ">
              <h1 className="text-2xl font-bold dark:text-gray-400">
                Available Students
              </h1>
              <Link
                to="/find-team-members"
                className=" flex gap-x-3 justify-center items-center py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 "
              >
                Add team member request
              </Link>
            </div>
          }
          bordered
          locale={{
            emptyText: "No students at the moment. Check back later.",
          }}
          itemLayout="vertical"
          dataSource={members}
          loading={loadingMembers}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.name} />
              <Space direction="vertical" size={"middle"}>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  <strong>Email:</strong> {item.email}
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  <strong>Major:</strong> {item.academic_major}
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  <strong>Level:</strong> {item.academic_level}
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  <strong>Skills:</strong> {item.skills.join(", ")}
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  <strong>SDGs of interest: </strong>
                  {item.sdgsOfInterest
                    .map((sdg) => `SDG #${sdg.toUpperCase()}`)
                    .join(", ")}
                </p>
              </Space>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
