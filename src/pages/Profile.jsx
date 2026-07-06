import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ProfileInfo from "../components/ProfileInfo";
import ManageAddress from "../components/ManageAddress";
import TrackStatus from "../components/TrackStatus";
import Breadcrumb from "../components/Breadcrumb";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="primary-container pt-25 pb-5 lg:pt-[170px] lg:pb-10">
      <div className="grid lg:grid-cols-[320px_1fr] gap-8">

         <div className="absolute top-2 lg:top-33 left-0 w-full z-10">
          <div className="primary-container">
            <Breadcrumb />
          </div>
        </div>

        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div>
          {activeTab === "profile" && <ProfileInfo />}
          {activeTab === "address" && <ManageAddress />}
          {activeTab === "track" && <TrackStatus />}
        </div>

      </div>
    </div>
  );
}