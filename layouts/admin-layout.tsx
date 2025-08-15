/*
 * Admin Writing Interface
 * Copyright (C) 2024 RIABiz
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, see <https://www.gnu.org/licenses/>.
 */

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
