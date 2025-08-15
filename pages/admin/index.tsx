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

import AdminLayout from "@/components/layouts/admin-layout";
import Meta from "@/components/partials/seo-meta";
import Link from "next/link";
import React from "react";

interface CommonProps {
    name: string;
}
interface ImplementedProps extends CommonProps {
    url: string;
}
interface UnimplementedProps extends CommonProps {
    unimplemented: true;
}
type NavProps = ImplementedProps | UnimplementedProps;

function isUnimplemented(arg: NavProps): arg is UnimplementedProps {
    return (arg as UnimplementedProps).unimplemented;
}

const ListElement: React.FC<NavProps> = (props) => {
    const unimplemented = isUnimplemented(props);
    return unimplemented ? (
        <div className="text-md truncate py-2 font-medium text-gray-500">
            {props.name}
        </div>
    ) : (
        <dt className="text-md truncate py-2 font-medium text-gray-500">
            <Link href={props.url} passHref>
                {props.name}
            </Link>
        </dt>
    );
};

type ColumnProps = {
    name: string;
    elems: NavProps[];
};
const Column: React.FC<ColumnProps> = (props) => {
    return (
        <div
            className="overflow-hidden rounded-lg bg-white px-4 py-5 sm:p-6"
            data-cy={props.name}
        >
            <h2 className="text-xl font-medium leading-6 text-gray-900">
                {props.name}
            </h2>
            <hr />
            {props.elems.map((elem) => (
                <ListElement key={elem.name} {...elem} />
            ))}
        </div>
    );
};
export default function AdminIndex() {
    const elems1: NavProps[] = [
        { name: "Articles", url: "/admin/articles/1" },
        { name: "Archives", unimplemented: true },
        { name: "Tags", url: "/admin/tags/1" },
        { name: "Authors", url: "/admin/authors/1" },
        { name: "People", unimplemented: true },
        { name: "Team", url: "/admin/teammembers/1" },
        { name: "Pages", url: "/admin/pages/1" },
        { name: "Directory", url: "/admin/d/1" },
        { name: "Job Board", url: "/admin/job-board/1" },
    ];
    const elems2: NavProps[] = [
        { name: "Campaigns", unimplemented: true },
        { name: "Dedicate email templates", unimplemented: true },
    ];
    const elems3: NavProps[] = [{ name: "Submissions", unimplemented: true }];
    if (true) {
        return (
            <div>
                <dl className="mt-5 grid grid-cols-1 gap-5 px-4 sm:grid-cols-3 md:px-28">
                    <Column name="General" elems={elems1} />
                    <Column name="Email" elems={elems2} />
                    <Column name="People Moves" elems={elems3} />
                </dl>
            </div>
        );
    }
}

AdminIndex.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <AdminLayout>
            <Meta title={`Home | RIABiz Admin`} noindex={true} />
            {page}
        </AdminLayout>
    );
};
