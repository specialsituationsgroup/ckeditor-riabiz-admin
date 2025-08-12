/** @format */

import React from "react";
import TopnavAdmin from "@/components/navigation/topnav-admin";
import EnvBanner from "../common/EnvBanner";
import ConnectionBanner from "../common/ConnectionBanner";

const AdminLayout: React.FC<{}> = ({ children }) => {
    return (
        <>
            <div className=" w-full">
                <ConnectionBanner />
                <EnvBanner />
                <TopnavAdmin />
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </>
    );
};

export default AdminLayout;
