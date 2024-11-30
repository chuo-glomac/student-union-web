"use client";
import { getUserPath } from "@/utils/getUrl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Icon } from "./icons";

export const CustomHeader: React.FC<{ labels: any; currentPage: string }> = ({
  labels,
  currentPage,
}) => {
  const router = useRouter();
  const [path, setPath] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await getUserPath(); // Replace with actual logic
      if (!result) {
        router.push("/login");
      }
      setPath(result.url);
    };

    fetchData();
  }, [router]);

  return (
    <header className="bg-white shadow p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">Student Union</div>
        <ul className="flex space-x-4">
          <li>
            <a
              href={`${path}/post`}
              className="text-gray-600 hover:text-gray-900"
            >
              {/* {labels.header.post} */}
              <Icon name="home" solid={currentPage === "post"} />
            </a>
          </li>
          <li>
            <a
              href={`/home/message`}
              className="text-gray-600 hover:text-gray-900"
            >
              {/* {labels.header.message} */}
              <Icon
                name="chat-bubble-left-right"
                solid={currentPage === "message"}
              />
            </a>
          </li>
          <li>
            <a
              href={`/home/notification`}
              className="text-gray-600 hover:text-gray-900"
            >
              {/* {labels.header.notification} */}
              <Icon name="bell" solid={currentPage === "notification"} />
            </a>
          </li>
          <li>
            <a
              href={`/home/profile`}
              className="text-gray-600 hover:text-gray-900"
            >
              {/* {labels.header.profile} */}
              <Icon name="user" solid={currentPage === "profile"} />
            </a>
          </li>
          <li>
            <a
              href={`/home/setting`}
              className="text-gray-600 hover:text-gray-900"
            >
              {/* {labels.header.setting} */}
              <Icon name="cog-6-tooth" solid={currentPage === "setting"} />
            </a>
          </li>
        </ul>
        {/* <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded p-2"
          />
        </div> */}
      </nav>
    </header>
  );
};

export const CustomFooter: React.FC<{ labels: any }> = ({ labels }) => {
  return (
    <footer className="bg-gray-100 p-4 text-center">
      <p>&copy; {labels.rights}</p>
    </footer>
  );
};
