"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// import Link from "next/link";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("user");
  const searchParams = useSearchParams();
  const activeTabFromParams = searchParams.get("tab");
  const router = useRouter();

  useEffect(() => {
    if (activeTabFromParams && activeTab !== activeTabFromParams) {
        const newUrl = `/dashboard?tab=${activeTab}`;
        router.push(newUrl);  // Updates the URL with the new tab without a page reload
      }
  },[activeTab])

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-white text-gray-600 w-64 flex flex-col border-r-2 borger-gray-500">
        <div className="text-2xl font-bold p-6 border-b border-white">
          Admin Dashboard
        </div>
        <div className="flex-grow p-4  gap-2">
          <ul className="gap-2 flex flex-col">
            <li
              onClick={() => setActiveTab("user")}
              className={`cursor-pointer py-2 px-3 rounded-lg ${
                activeTab === "user" ? "bg-black text-white" : "bg-white"
              } hover:bg-gray-200 hover:text-black`}
            >
              User
            </li>
            <li
              onClick={() => setActiveTab("product")}
              className={`cursor-pointer py-2 px-3 rounded-lg ${
                activeTab === "product" ? "bg-black text-white" : "bg-white"
              } hover:bg-gray-200 hover:text-black`}
            >
              Product
            </li>
            <li
              onClick={() => setActiveTab("extra")}
              className={`cursor-pointer py-2 px-3 rounded-lg ${
                activeTab === "extra" ? "bg-black text-white" : "bg-white"
              } hover:bg-gray-200 hover:text-black`}
            >
              Extra
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
