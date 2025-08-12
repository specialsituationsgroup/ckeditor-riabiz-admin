import Meta from "@/components/partials/seo-meta";
import { FRONTEND_SIGNIN_URL, PLACEHOLDER_AVATAR } from "@/constants";
import React, { ReactElement, useState } from "react";
import AdminLayout from "@/components/layouts/admin-layout";
import { Transition } from "@headlessui/react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, ExternalLinkIcon } from "@heroicons/react/solid";
import { API_ENDPOINT } from "@/utils/api";
import ArticleContainer from "@/components/article/article-container";
import { useSession } from "next-auth/react";
import { parseJSON, format } from "date-fns";
import Link from "next/link";
import type {
    ArticleREST,
    RevisionREST,
    PreviewArticleGraphql,
} from "@/interfaces/article";
import { Session } from "next-auth";
import { GetServerSideProps, GetServerSidePropsContext } from "next/types";
import { ParsedUrlQuery } from "querystring";
import ConfirmRestoreRevision from "@/components/admin/ConfirmRestoreRevision";
import { toast } from "react-toastify";
import router from "next/router";
import { getToken } from "next-auth/jwt";

type EditorProps = {
    article: ArticleREST;
    revisions: Array<RevisionREST>;
    authToken: string;
};
export default function CreateArticlePage({
    article,
    revisions,
    authToken,
}: EditorProps) {
    const [openRevision, setOpenRevision] = useState<RevisionREST | null>(null);
    const [showRestoreConfirm, setRestoreConfirm] = useState<boolean>(false);
    const updatedBy = article.updated_by;
    const updatedAt = article.updated;
    const articleRevisionsList = revisions;

    const updatedByLabel = updatedBy
        ? `${updatedBy.first_name ? updatedBy.first_name : updatedBy.username}`
        : "";
    const humanUpdatedBy = updatedBy
        ? `Last updated at ${format(
              parseJSON(updatedAt),
              "Pp"
          )} by ${updatedByLabel}`
        : `Created at ${format(parseJSON(article.created), "Pp")}`;

    const fullArticle = (revision: RevisionREST): PreviewArticleGraphql => {
        return {
            deckhead: article.deckhead,
            authors: {
                edges: article.authors.map((a) => ({
                    node: { name: a.name, slug: a.slug },
                })),
            },
            pk: article.pk,
            articleSnippet: article.truncated_teaser,
            canonicalUrl: "",
            numberOfComments: article.comments ? article.comments.length : 0,
            publishDate: article.publish_date,
            slug: article.slug,
            punchWord: article.punch_word,
            image: {
                image: article.image?.image?.cdn_url ?? PLACEHOLDER_AVATAR,
            },
            headline: revision.headline,
            imageCaption: article.image_caption,
        };
    };

    const onSubmit = async (callback: Function) => {
        const findRevision = revisions
            .filter((revision) => revision.pk == openRevision?.pk)
            .pop();
        if (findRevision == undefined) {
            toast("We could not find the correct revision data", {
                type: "error",
            });
        }

        const req = await fetch(
            `${API_ENDPOINT}api/v1/article-revision/${findRevision?.pk}/restore/`,
            {
                method: "POST",
                headers: {
                    Authorization: `Token ${authToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
        callback();
        if (req.status != 200) {
            toast("Something went wrong saving this article", {
                type: "error",
            });
            return;
        }
        toast("Article restored successfully", { type: "success" });
        router.push(`/admin/a/${findRevision?.article}`);
    };

    return (
        <>
            <Meta title={`Edit Article | RIABiz Admin`} />
            <div className="flex">
                <div className="w-full sm:w-3/4">
                    <form className="mt-6 flex flex-col">
                        <div className="flex items-center space-x-6 bg-white">
                            <div className="text-2xl text-gray-700">
                                <span className="pr-3">Article Revisions</span>
                                <div className="pr-6">
                                    <p className="text-lg text-gray-500">
                                        {article.headline || "N/A"}
                                    </p>
                                    <p className="flex space-x-2 text-base text-gray-400">
                                        <span>{humanUpdatedBy}</span>
                                    </p>
                                    <div className="flex flex-1 items-center py-1">
                                        <ExternalLinkIcon
                                            className="h-5 w-5 flex-shrink-0 text-blue"
                                            aria-hidden="true"
                                        />
                                        <Link
                                            href={`/admin/a/${article.pk}`}
                                            passHref
                                            className="ml-2 flex-1 truncate text-base text-blue"
                                        >
                                            Edit article on admin
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ConfirmRestoreRevision
                            setIsOpen={setRestoreConfirm}
                            revision={openRevision}
                            isOpen={showRestoreConfirm}
                            onConfirm={(callback) => onSubmit(callback)}
                        />
                        {/* Editor */}
                        {articleRevisionsList.map((revision) => (
                            <div key={revision.pk} className="py-4">
                                <Disclosure defaultOpen={false}>
                                    <div
                                        onClick={() =>
                                            setOpenRevision((val) =>
                                                val?.pk == revision.pk
                                                    ? null
                                                    : revision
                                            )
                                        }
                                        className="flex w-full cursor-pointer justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                                    >
                                        <span>
                                            {`Saved by ${
                                                revision.updated_by.first_name
                                            } at ${format(
                                                parseJSON(revision.created),
                                                "Pp"
                                            )}`}
                                        </span>
                                        <ChevronUpIcon
                                            className={`${
                                                openRevision?.pk == revision.pk
                                                    ? "rotate-180 transform"
                                                    : ""
                                            } h-5 w-5 text-blue-500`}
                                        />
                                    </div>
                                    <Transition
                                        show={revision.pk == openRevision?.pk}
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0"
                                    >
                                        <Disclosure.Panel
                                            static
                                            className="px-1 pt-3 pb-2 text-sm text-gray-500"
                                        >
                                            <div className="my-3 grid grid-cols-10">
                                                <button
                                                    type="submit"
                                                    onClick={(e) => {
                                                        e!.preventDefault();
                                                        setRestoreConfirm(true);
                                                    }}
                                                    className={`cursor-pointer rounded-md border border-transparent bg-green-600 px-3 py-1 text-lg font-medium text-white shadow-sm hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400`}
                                                >
                                                    Restore
                                                </button>
                                                <div className="col-span-10 max-w-[750px]">
                                                    <ArticleContainer
                                                        article={fullArticle(
                                                            revision
                                                        )}
                                                        articleChildrenOrBodyString={
                                                            revision.body
                                                        }
                                                        adminControls={false}
                                                    />
                                                </div>
                                            </div>
                                        </Disclosure.Panel>
                                    </Transition>
                                </Disclosure>
                            </div>
                        ))}
                        {articleRevisionsList.length == 0 && (
                            <div>
                                <p className="mt-8 text-lg text-gray-500">
                                    <span>
                                        There are no revisions for this article.
                                    </span>
                                </p>
                            </div>
                        )}
                    </form>
                </div>

                {/* Sidebar */}

                <div className="sticky top-0 right-0 ml-4 hidden h-screen sm:block sm:w-1/4">
                    <div className=" grid grid-cols-1"></div>
                </div>
            </div>
        </>
    );
}

CreateArticlePage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

CreateArticlePage.auth = true;

type editorQuery = ParsedUrlQuery & {
    articlePk: string;
};
export const getServerSideProps: GetServerSideProps<
    EditorProps,
    editorQuery
> = async (context) => {
    const token = await getToken({ req: context.req });
    const authToken = token!.accessToken; // middleware checks the existence of an authorized user

    const params = context.params;
    if (params == null || token == null) {
        return {
            notFound: true,
        };
    }
    const articleId = params.articlePk;
    // do some sanity handling
    const regex = /^\d+/;
    const found = articleId.match(regex);
    if (found == null || found.length !== 1) {
        return {
            notFound: true,
        };
    }
    const articleReq = await fetch(
        `${API_ENDPOINT}api/v1/articles/${articleId}/admin/`,
        {
            headers: {
                Authorization: `Token ${authToken}`,
                "Content-Type": "application/json",
            },
        }
    );
    const articleData = await articleReq.json();
    // check if article exists
    if (articleReq.status == 404) {
        return {
            notFound: true,
        };
    }
    // check if token is valid
    if (articleData?.detail == "Invalid token.") {
        return {
            redirect: {
                destination: FRONTEND_SIGNIN_URL,
                permanent: false,
            },
        };
    }
    // fetch revision data
    const revisionsReq = await fetch(
        `${API_ENDPOINT}api/v1/article-revision/?article=${articleId}`,
        {
            headers: {
                Authorization: `Token ${authToken}`,
                "Content-Type": "application/json",
            },
        }
    );
    const revisionsData = await revisionsReq.json();
    return {
        props: {
            authToken,
            revisions: revisionsData.results,
            article: {
                ...articleData,
            },
        },
    };
};
