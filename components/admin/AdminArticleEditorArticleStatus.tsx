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

import { ExternalLinkIcon } from "@heroicons/react/solid";
import Link from "next/link";
import React from "react";

export function AdminArticleEditorArticleStatus(props: {
    previewMode: boolean;
    brief: undefined | boolean;
    publishState: boolean;
    disabled: boolean;
    onClick: (e: React.BaseSyntheticEvent) => void;
    publishSaveState: boolean;
    headline: string;
    dirty: boolean;
    humanUpdatedBy: string;
    published: boolean;
    articleLinkUrl: string | null;
}) {
    const articleType = props.brief
        ? "Brief"
        : "Article";
    return (
        <div className="flex items-center space-x-6 bg-white">
            <div className="text-2xl text-gray-700">
                <span className="pr-3">
                    {props.previewMode
                        ? `Previewing ${articleType}`
                        : `Editing ${articleType}`}
                </span>
                {props.publishState ? (
                    <button
                        type="submit"
                        disabled={props.disabled}
                        onClick={props.onClick}
                        className={`cursor-pointer rounded-md border border-transparent bg-red-100 px-3 py-1 text-lg font-medium text-red-500 shadow-sm hover:bg-red-200 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed disabled:bg-red-400`}
                    >
                        {props.publishSaveState
                            ? "Unpublishing..."
                            : "Unpublish"}
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={props.disabled}
                        onClick={props.onClick}
                        className={`cursor-pointer rounded-md border border-transparent bg-green-600 px-3 py-1 text-lg font-medium text-white shadow-sm hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300`}
                    >
                        {props.publishSaveState ? "Publishing..." : "Publish"}
                    </button>
                )}
                <div className="pr-6">
                    <p className="text-lg text-gray-500">
                        {props.headline || "N/A"}
                    </p>
                    <p className="flex space-x-2 text-base text-gray-400">
                        <span
                            className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium uppercase ${
                                props.dirty
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                            }`}
                        >
                            {props.dirty ? "unsaved" : "saved"}
                        </span>
                        <span>{props.humanUpdatedBy}</span>
                    </p>
                    {props.published && props.articleLinkUrl && (
                        <div className="flex flex-1 items-center py-1">
                            <ExternalLinkIcon
                                className="h-5 w-5 flex-shrink-0 text-blue"
                                aria-hidden="true"
                            />
                            <Link
                                href={props.articleLinkUrl}
                                passHref
                                target="_blank"
                                className="ml-2 flex-1 truncate text-base text-blue"
                            >
                                View article on riabiz.com
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
