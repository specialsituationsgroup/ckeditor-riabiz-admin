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
import { DocumentAddIcon, DocumentTextIcon } from "@heroicons/react/outline";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import { API_GET_WHITEPAPERS, genericFetcher } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { useEffect, useRef, useState } from "react";
import { CogIcon } from "@heroicons/react/solid";
import { parseISO, format, formatDistance } from "date-fns";
import ConfigNewsletter from "@/components/admin/ConfigNewsletterModal";
import type { ArticleREST } from "@/interfaces/article";
import { SearchIcon } from "@heroicons/react/solid";
import { useForm } from "react-hook-form";
import WhitePaperDialog, {
    WhitepaperTabProps,
} from "@/components/admin/WhitePaperModal";
import { useRouter } from "next/router";
import { PLACEHOLDER_AVATAR } from "@/constants";
import Meta from "@/components/partials/seo-meta";
import NewArticleDialog from "@/components/admin/NewArticleModal";
import {
    RESTWhitePaper,
    RESTWhitePaperListQueryResult,
} from "@/interfaces/whitepaper";
import {
    getNextWhitepaperSaturdaySendDate,
    getTodayDateISO,
    listArticles,
    listUnapprovedComments,
    useListArticles,
} from "@/utils/article-helpers";
import { Published } from "@/utils/listing-helpers";
import { ParsedUrlQuery } from "querystring";
import { getToken } from "next-auth/jwt";
import { getFirstQueryParam } from "@/utils/query";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { articleKeys } from "@/utils/query-key-factory";
import Pagination from "@/components/pagination/Pagination";
import NewBriefDialog from "@/components/admin/NewBriefModal";

const EDIT_URL = `/admin/a`;
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

/**
 * Article List components
 */

type ArticleProps = {
    article: ArticleREST;
    selected: ArticleREST[];
    setter: (list: ArticleREST[]) => void;
};

const ArticleComponent = ({ article, selected, setter }: ArticleProps) => {
    const checked = <CheckCircleIcon className="h-5 w-5 text-green-800" />;
    const cross = <XCircleIcon className="h-5 w-5 text-red-800" />;
    const baseColClass = "py-4 text-sm";
    const normColClass = classNames(baseColClass, "text-gray-500");

    // render article times - relative for create / update - absolute for publish
    const createdTime = formatDistance(parseISO(article.created), Date.now(), {
        addSuffix: true,
    });
    const updatedTime = formatDistance(parseISO(article.updated), Date.now(), {
        addSuffix: true,
    });
    const createUpdateRender = (
        <>
            <dd className="font-bold">Created: </dd>
            <dt>{createdTime}</dt>
            <dd className="font-bold">Updated: </dd>
            <dt>{updatedTime}</dt>
        </>
    );

    const dateStr = "dd MMM, yyyy - hh:mm aa";
    const publishedTime =
        article.published && article.publish_date
            ? format(parseISO(article.publish_date), dateStr)
            : "";
    const publishRender = (
        <>
            <div className="float-left pr-1">
                {article.published ? checked : cross}
            </div>
            <div>{article.published ? publishedTime : "Draft"}</div>
        </>
    );

    const headlineRender = (
        <>
            <div className="max-w-[100px] basis-1/3 pr-4">
                <Link
                    href={`${EDIT_URL}/${article.pk}`}
                    passHref
                    legacyBehavior
                >
                    {article.image ? (
                        <a>
                            <Image
                                src={article.image.cdn_url}
                                alt={
                                    article.image.altText ??
                                    "featured article image"
                                }
                                height={100}
                                width={100}
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    height: "auto",
                                }}
                            />
                        </a>
                    ) : (
                        <a>
                            <Image
                                src={PLACEHOLDER_AVATAR}
                                alt="placeholder"
                                height={100}
                                width={100}
                                style={{
                                    maxWidth: "100%",
                                    height: "auto",
                                }}
                            />
                        </a>
                    )}
                </Link>
            </div>
            <div className="basis-2/3 text-lg line-clamp-3">
                <Link href={`${EDIT_URL}/${article.pk}`} legacyBehavior>
                    {article.headline}
                </Link>
            </div>
        </>
    );

    return (
        <tr
            key={article.pk}
            className={selected.includes(article) ? "bg-gray-50" : undefined}
        >
            <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                {article.published ? (
                    <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                        value={article.pk}
                        checked={selected.includes(article)}
                        onChange={(e) =>
                            setter(
                                e.target.checked
                                    ? [...selected, article]
                                    : selected.filter((art) => art !== article)
                            )
                        }
                    />
                ) : null}
            </td>

            {/* Main Display of Article Image & Article Headline */}
            {/* SMALL VIEW */}
            <td className={classNames("pr-3 sm:hidden", baseColClass)}>
                {headlineRender}
            </td>

            {/* Larger Sizes */}
            <td
                className={classNames(
                    "hidden pr-3 sm:table-cell",
                    baseColClass
                )}
            >
                <div className="flex flex-row">{headlineRender}</div>
            </td>

            <td
                className={classNames(
                    "hidden pr-3 sm:table-cell",
                    baseColClass
                )}
            >
                <div className={classNames(baseColClass, "")}>
                    <div className="">
                        <span className="font-bold">New: </span>
                        {article.unapproved_comment_count ?? 0}
                    </div>
                    <div className="">
                        <span className="font-bold">Total: </span>
                        {article.comment_count}
                    </div>
                </div>
            </td>

            {/* One column for dates when small */}
            <td className={classNames("sm:hidden", normColClass)}>
                <dl className="">
                    {createUpdateRender}
                    <dd className="font-bold">Published: </dd>
                    <dt>{publishRender}</dt>
                </dl>
            </td>

            {/* Two columns for dates when bigger */}
            <td className={classNames("hidden sm:table-cell", normColClass)}>
                <dl className="">{createUpdateRender}</dl>
            </td>
            <td
                className={classNames(
                    "hidden align-top sm:table-cell",
                    normColClass
                )}
            >
                {publishRender}
            </td>
        </tr>
    );
};

/**
 * AdminArticles main component
 *
 */

type AdminArticleProps = WhitepaperTabProps & {
    authToken: string;
    page: string;
    newComments: number;
};

export default function AdminArticles({
    currentWhitepapers,
    authToken,
    page,
    newComments,
}: AdminArticleProps) {
    const router = useRouter();

    const checkbox = useRef<HTMLInputElement>(null);
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);

    const [selectedArticles, setSelectedArticles] = useState<ArticleREST[]>([]);
    const [numSelectedArticles, setNumSelectedArticles] = useState("");

    const [showWPDialog, setShowWPDialog] = useState(false);
    const [showNewArticle, setShowNewArticle] = useState(false);
    const [showNewBrief, setShowNewBrief] = useState(false);
    const [showDaily, setShowDaily] = useState(false);

    const [comment, setComment] = useState<Comment>("both");
    const [published, setPublished] = useState<Published>("both");

    const pageSizeStr = getFirstQueryParam(router.query?.page_size) ?? "20";
    const page_size = parseInt(pageSizeStr);
    const ordering = getFirstQueryParam(router.query.ordering) || "-updated";
    const searchString = getFirstQueryParam(router.query.search) ?? "";

    const { register, handleSubmit } = useForm({
        defaultValues: {
            search: searchString,
        },
    });

    const { data: articleData } = useListArticles({
        ordering,
        page,
        page_size: pageSizeStr,
        search: searchString,
        authToken,
    });
    useEffect(() => {
        if (articleData && articleData.results) {
            const isIndeterminate =
                selectedArticles.length > 0 &&
                selectedArticles.length < articleData.results.length;
            setChecked(selectedArticles.length === articleData.results.length);
            setIndeterminate(isIndeterminate);
            const ckBox: HTMLInputElement | null = checkbox.current;
            if (ckBox) {
                ckBox.indeterminate = isIndeterminate;
            }
            setNumSelectedArticles(makeText(selectedArticles.length));
        }
    }, [selectedArticles, articleData]);

    if (!articleData) return null;

    const makeUrl = ({
        newPage,
        newSearch,
        newOrdering,
        newPageSize,
    }: {
        newPage: string;
        newSearch: string;
        newOrdering: string;
        newPageSize: string;
    }) => {
        return `/admin/articles/${newPage}?search=${newSearch}&ordering=${newOrdering}&page_size=${newPageSize}`;
    };

    const setPage = (newPage: number) => {
        router.push(
            makeUrl({
                newPage: newPage.toString(),
                newSearch: searchString,
                newOrdering: ordering,
                newPageSize: pageSizeStr,
            })
        );
    };
    const setNewPublished = (newPublished: Published) => {
        const newOrdering =
            newPublished === "both"
                ? "-updated"
                : newPublished === "published"
                ? "-published,-updated"
                : "published,-updated";
        setPublished(newPublished);
        router.push(
            makeUrl({
                newPage: "1",
                newSearch: searchString,
                newPageSize: pageSizeStr,
                newOrdering,
            })
        );
    };

    const setNewComment = (newComment: Comment) => {
        if (newComment === "new") {
            setComment(newComment);
            router.push(
                makeUrl({
                    newPage: "1",
                    newSearch: "",
                    newPageSize: pageSizeStr,
                    newOrdering: "unapproved_comments",
                })
            );
        }
        setComment(newComment);
        setPublished("both");
        router.push(
            makeUrl({
                newPage: "1",
                newSearch: searchString,
                newPageSize: pageSizeStr,
                newOrdering: "-updated",
            })
        );
    };

    const articles: ArticleREST[] = articleData?.results ?? [];
    const paginateProps = {
        paginateResults: articleData,
        setPage,
        pageSize: page_size,
        search: searchString,
    };

    const onSubmit = (data: { search: string }) => {
        const search = data.search;
        router.push(
            makeUrl({
                newPage: "1",
                newOrdering: ordering,
                newPageSize: pageSizeStr,
                newSearch: search,
            })
        );
    };

    const makeText = (num: number) => {
        let text = "";
        if (num > 0) {
            text = "(" + num + " Article";
            if (num > 1) text += "s";
            text += ")";
        }
        return text;
    };
    type Comment = "new" | "both";
    const isCurrentNav = (value: Comment | Published, test: string) => {
        let activeClasses = "bg-indigo-50 text-indigo-600";
        if (value === test) {
            return activeClasses;
        }
        return "bg-white text-gray-500 hover:bg-gray-50";
    };

    function toggleAll() {
        // only allow published articles to be selected: RIA-71
        setSelectedArticles(
            checked || indeterminate ? [] : articles.filter((a) => a.published)
        );
        setChecked(!checked && !indeterminate);
        setIndeterminate(false);
    }

    const configDaily = () => {
        setShowDaily(true);
    };

    const whitePaper = () => {
        setShowWPDialog(true);
    };

    const newArticle = () => {
        setShowNewArticle(true);
    };

    const newBrief = () => {
        setShowNewBrief(true);
    };

    const commentClasses =
        newComments > 0
            ? "bg-green-500 hover:bg-green-200 text-white hover:text-green-700"
            : "bg-blue-500 hover:bg-blue-200 text-white hover:text-blue-700";

    return (
        <>
            <Meta title={"Articles | RIABiz Admin"} />
            <ConfigNewsletter
                selected={selectedArticles}
                show={showDaily}
                closeCallback={() => setShowDaily(false)}
            />
            <WhitePaperDialog
                setIsOpen={setShowWPDialog}
                isOpen={showWPDialog}
                currentWhitepapers={currentWhitepapers}
            />
            <NewArticleDialog
                setIsOpen={setShowNewArticle}
                isOpen={showNewArticle}
            />
            <NewBriefDialog
                setIsOpen={setShowNewBrief}
                isOpen={showNewBrief}
            />


            <div className="mx-auto mt-6 max-w-7xl">
                {/* Top Banner */}
                <div className="flex flex-col items-start md:flex-row md:items-center">
                    {/* Top Button Row */}
                    <div className="-mx-2 mt-4 sm:mt-0 sm:flex-none">
                        <button
                            onClick={newArticle}
                            type="button"
                            className={classNames(
                                "m-2 inline-flex cursor-pointer items-center justify-center px-4 py-2",
                                "bg-blue font-medium text-white",
                                "rounded-md border border-transparent shadow-sm",
                                "hover:bg-blue-200 hover:text-blue-700 sm:w-auto"
                            )}
                        >
                            <DocumentAddIcon className="h-9 w-9" />
                            <span className="pt-1 pl-1">New Article</span>
                        </button>
                        <button
                            onClick={newBrief}
                            type="button"
                            className={classNames(
                                "m-2 inline-flex cursor-pointer items-center justify-center px-4 py-2",
                                "bg-amber-700 font-medium text-white",
                                "rounded-md border border-transparent shadow-sm",
                                "hover:bg-amber-400 hover:text-gray-400 sm:w-auto"
                            )}
                        >
                            <DocumentAddIcon className="h-9 w-9" />
                            <span className="pt-1 pl-1">New Brief</span>
                        </button>
                        <button
                            onClick={whitePaper}
                            type="button"
                            className={classNames(
                                "m-2 inline-flex cursor-pointer items-center justify-center px-4 py-2",
                                "bg-blue font-medium text-white",
                                "rounded-md border border-transparent shadow-sm",
                                "hover:bg-blue-200 hover:text-blue-700 sm:w-auto"
                            )}
                        >
                            <DocumentTextIcon className="h-9 w-9" />
                            <span className="pt-1 pl-1">
                                Send Whitepaper Preview
                            </span>
                        </button>
                        <button
                            onClick={configDaily}
                            type="button"
                            className={classNames(
                                "m-2 inline-flex cursor-pointer items-center justify-center px-4 py-2",
                                "bg-blue font-medium text-white",
                                "rounded-md border border-transparent shadow-sm",
                                "hover:bg-blue-200 hover:text-blue-700 sm:w-auto"
                            )}
                        >
                            <CogIcon className="h-9 w-9 pr-2" />
                            <div className="text-center">
                                <div>Configure Daily Newsletter</div>
                                <div className="text-xs">
                                    {numSelectedArticles}
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => setNewComment("new")}
                            type="button"
                            disabled={newComments === 0}
                            className={classNames(
                                "m-2 inline-flex cursor-pointer items-center justify-center px-4 py-2 font-medium rounded-md border border-transparent shadow-sm sm:w-auto",
                                commentClasses
                            )}
                        >
                            <CheckCircleIcon className="h-8 w-8 pr-2" />
                            <div className="text-center">
                                <div>Unapproved Comments: {newComments}</div>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-start md:flex-row md:items-center">
                    <div>
                        {/* Filter Bar */}
                        <div className="z-0 mr-4 inline-flex rounded-md">
                            <button
                                className={`relative inline-flex rounded-l-md border border-gray-300 px-4 py-2 text-sm font-medium hover:no-underline ${isCurrentNav(
                                    published,
                                    "both"
                                )}`}
                                type="button"
                                onClick={() => setNewPublished("both")}
                            >
                                All
                            </button>
                            <button
                                className={`relative inline-flex border border-gray-300 px-4 py-2 text-sm font-medium hover:no-underline ${isCurrentNav(
                                    published,
                                    "published"
                                )}`}
                                type="button"
                                onClick={() => setNewPublished("published")}
                            >
                                Published
                            </button>
                            <button
                                className={`relative inline-flex  rounded-r-md border border-gray-300 px-4 py-2 text-sm font-medium hover:no-underline ${isCurrentNav(
                                    published,
                                    "draft"
                                )}`}
                                type="button"
                                onClick={() => setNewPublished("draft")}
                            >
                                Draft
                            </button>
                        </div>
                        <div className="z-0 mr-4 inline-flex rounded-md">
                            <button
                                className={`relative inline-flex  rounded-l-md border border-gray-300 px-4 py-2 text-sm font-medium hover:no-underline ${isCurrentNav(
                                    comment,
                                    "both"
                                )}`}
                                type="button"
                                onClick={() => setNewComment("both")}
                            >
                                All Comments
                            </button>
                            <button
                                className={`relative inline-flex rounded-r-md border border-gray-300 px-4 py-2 text-sm font-medium hover:no-underline ${isCurrentNav(
                                    comment,
                                    "new"
                                )}`}
                                type="button"
                                onClick={() => setNewComment("new")}
                            >
                                Unapproved
                            </button>
                        </div>
                    </div>
                    {/* Search Bar */}
                    <div className="my-2 -mx-2 flex flex-1 items-center justify-start px-2 md:my-0 md:justify-end">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="w-full">
                                <label htmlFor="search" className="sr-only">
                                    Search
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <SearchIcon
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <input
                                        {...register("search")}
                                        name="search"
                                        className="block w-full rounded-md border border-gray-300 bg-white py-3 pl-10 pr-3 text-base leading-5 placeholder-gray-500 focus:border-indigo-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        placeholder="Search articles"
                                        type="search"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="my-2">
                <Pagination {...paginateProps} />
            </div>

            <div className="my-8 flex flex-col">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            {/* Checkbox functions */}
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr className="text-left">
                                        <th
                                            scope="col"
                                            className="relative w-12 px-6 sm:w-16 sm:px-8"
                                        >
                                            <input
                                                type="checkbox"
                                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                                                ref={checkbox}
                                                checked={checked}
                                                onChange={toggleAll}
                                            />
                                        </th>

                                        <th
                                            scope="col"
                                            className="min-w-[6rem] px-2 py-3.5 pr-3 font-semibold text-gray-900"
                                        >
                                            Headline
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-1 py-3.5 pr-3 font-semibold text-gray-900"
                                        >
                                            Comments
                                        </th>

                                        {/* Dates are displayed in one column for small, otherwise two columns */}
                                        <th
                                            scope="col"
                                            className="min-w-[140px] px-1 py-3.5 pr-3 font-semibold text-gray-900 sm:hidden"
                                        >
                                            Dates
                                        </th>

                                        <th
                                            scope="col"
                                            className="hidden w-[140px] px-1 py-3.5 pr-3 font-semibold text-gray-900 sm:table-cell"
                                        >
                                            Created / Updated
                                        </th>
                                        <th
                                            scope="col"
                                            className="hidden w-[200px] px-1 py-3.5 pr-3 font-semibold text-gray-900 sm:table-cell"
                                        >
                                            Published
                                        </th>
                                    </tr>
                                </thead>

                                {/* Now the list of articles */}
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {articles.map((article) => (
                                        <ArticleComponent
                                            key={article.pk}
                                            selected={selectedArticles}
                                            setter={setSelectedArticles}
                                            article={article}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-2 mb-8">
                <Pagination {...paginateProps} />
            </div>
        </>
    );
}

AdminArticles.getLayout = function getLayout(page: React.ReactNode) {
    return <AdminLayout>{page}</AdminLayout>;
};

AdminArticles.auth = true;

type articlesQuery = ParsedUrlQuery & {
    page: string;
};

export const getServerSideProps: GetServerSideProps<
    AdminArticleProps,
    articlesQuery
> = async (context) => {
    // keep typescript happy
    const req: GetServerSidePropsContext["req"] = context.req;
    const token = await getToken({ req });

    const params = context.params;
    if (params == null || token == null) {
        return {
            notFound: true,
        };
    }
    // validate we have a proper page
    const page = params?.page;

    // set the defaults
    const pageSizeStr = getFirstQueryParam(context.query?.page_size) ?? "20";
    const ordering = getFirstQueryParam(context.query.ordering) || "-updated";
    const search = getFirstQueryParam(context.query.search) ?? "";

    const filters = `search=${search}&page_size=${pageSizeStr}&ordering=${ordering}`;
    const queryClient = new QueryClient();
    const data = await queryClient.prefetchQuery(
        articleKeys.list(filters, page),
        () =>
            listArticles({
                search,
                page,
                page_size: pageSizeStr,
                ordering,
                authToken: token.accessToken,
            })
    );

    // need to fetch the whitepapers for next saturday
    let wpUrl = new URL(API_GET_WHITEPAPERS);
    const date = getNextWhitepaperSaturdaySendDate(getTodayDateISO());
    let args = { date: date };
    wpUrl.search = new URLSearchParams(args).toString();
    const whitepaper_data: RESTWhitePaperListQueryResult = await genericFetcher(
        wpUrl,
        {
            method: "GET",
            headers: {
                Authorization: `Token ${token.accessToken}`,
            },
        }
    );

    const totalWhitepapers: number = whitepaper_data.count;
    let currentWhitepapers: RESTWhitePaper[] = [];
    if (totalWhitepapers > 0) {
        currentWhitepapers = whitepaper_data.results;
    }

    const comment_data = await listUnapprovedComments(token.accessToken);

    return {
        props: {
            page,
            newComments: comment_data.count ?? 0,
            dehydratedState: dehydrate(queryClient),
            currentWhitepapers,
            authToken: token.accessToken,
        },
    };
};
