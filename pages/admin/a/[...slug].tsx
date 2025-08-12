import { AdminUploadcareWidget } from "@/components/admin/AdminUploadcareWidget";
import { AdminFormTextInput } from "@/components/admin/AdminFormTextInput";
import { AdminAuthorsDropdown } from "@/components/admin/AdminAuthorsDropdown";
import { AdminTagsDropdown } from "@/components/admin/AdminTagsDropdown";
import { AdminSectionsDropdown } from "@/components/admin/AdminSectionsDropdown";
import { AdminFormLabel } from "@/components/admin/AdminFormLabel";
import Meta from "@/components/partials/seo-meta";
import { FRONTEND_SIGNIN_URL, PLACEHOLDER_AVATAR } from "@/constants";
import React, { ReactElement, useRef, useState } from "react";
import AdminLayout from "@/components/layouts/admin-layout";
import { Control, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Disclosure, Switch } from "@headlessui/react";
import {
    AnnotationIcon,
    ChevronUpIcon,
    ExternalLinkIcon,
    BookOpenIcon
} from "@heroicons/react/solid";
import dynamic from "next/dynamic";
import {
    articleBodyCKE4Compat,
    buildArticleUrl,
    fetchAdminComments,
} from "utils/article-helpers";
import { API_ENDPOINT } from "@/utils/api";
import Image from "next/image";
import FeaturedArticleTile from "@/components/article/featured-article";
import ArticleSnippet from "@/components/article/article-snippet";
import ArticleContainer from "@/components/article/article-container";
import { toast } from "react-toastify";
import * as cheerio from "cheerio";
import { format, parseJSON } from "date-fns";
import { FullArticleCheckbox } from "@/components/admin/FullArticleCheckbox";
import Link from "next/link";
import type {
    ArticleGraphql,
    ArticleREST,
    FeaturedArticleGraphql,
    PreviewArticleGraphql,
} from "@/interfaces/article";
import ErrorToast from "@/components/admin/ErrorToast";
import { WidgetAPI } from "@uploadcare/react-widget";
import { SearchDialog } from "@/components/admin/SearchModal";
import { GetServerSideProps } from "next/types";
import { ParsedUrlQuery } from "querystring";
import { getToken } from "next-auth/jwt";
import { StyledDivider } from "@/custom-styled-components/general";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { commentKeys } from "@/utils/query-key-factory";
import { useIsOnline } from "react-use-is-online";
import PublishModal from "@/components/admin/PublishModal";
import OfflineModal from "@/components/admin/OfflineModal";
import { ArticleComments } from "@/components/admin/ArticleEditorComments";
import { AdminArticleEditorArticleStatus } from "@/components/admin/AdminArticleEditorArticleStatus";
import { ShowHiddenBriefFieldsCheckbox } from "@/components/admin/ShowHiddenBriefFieldsCheckbox";

const Editor = dynamic(() => import("@/components/editor/editor"), {
    ssr: false,
});

type TagFormType = {
    value: string;
    label: string;
    pk: number;
};
export type AuthorFormType = TagFormType;
type SectionFormType = TagFormType & {
    published: boolean;
};

export interface ArticleEditorFormType {
    submitAction: null | (() => void);
    newImageUploaded: boolean;
    showHiddenBriefFields: boolean;
    body: ArticleREST["body"];
    headline: ArticleREST["headline"];
    deckhead: ArticleREST["deckhead"];
    featured_caption: ArticleREST["featured_caption"];
    editors_note: ArticleREST["editors_note"];
    punch_word: ArticleREST["punch_word"];
    image_caption: ArticleREST["image_caption"];
    full: ArticleREST["full"];
    image: NonNullable<ArticleREST["image"]>["image"];
    authors: AuthorFormType[];
    editors: AuthorFormType[];
    tags: TagFormType[];
    sections: SectionFormType[];
    updated: ArticleREST["updated"];
    updated_by: ArticleREST["updated_by"];
    published: ArticleREST["published"];
}

type EditorProps = {
    authToken: string;
    article: ArticleREST;
};

export default function CreateArticlePage({ article, authToken }: EditorProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        setError,
        reset,
        formState: { errors, isDirty },
    } = useForm<ArticleEditorFormType>({
        defaultValues: {
            submitAction: null,
            newImageUploaded: false,
            showHiddenBriefFields: false,
            body: article.body,
            headline: article.headline,
            deckhead: article.deckhead,
            featured_caption: article.featured_caption,
            editors_note: article.editors_note,
            punch_word: article.punch_word,
            image_caption: article.image_caption,
            full: article.full,
            image: article.image?.image,
            editors: article.editors.map((e) => ({
                label: e.name,
                value: e.slug,
                pk: e.pk,
            })),
            authors: article.authors.map((a) => ({
                label: a.name,
                value: a.slug,
                pk: a.pk,
            })),
            tags: article.tags.map((t) => ({
                label: t.name,
                value: t.slug,
                pk: t.pk,
            })),
            sections: article.sections.map((s) => ({
                label: s.title,
                published: s.published,
                value: s.slug,
                pk: s.pk,
            })),
            updated: article.updated,
            updated_by: article.updated_by,
            published: article.published,
        },
    });
    const [showHiddenBriefFields, setShowHiddenBriefFields] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [showOffline, setShowOffline] = useState(false);
    const [saveState, setSaveState] = useState(false);
    const [publishSaveState, setPublishSaveState] = useState(false);
    const [lastSavedData, setLastSavedData] = useState(article);
    const [articleChildren, setArticleChildren] = useState<string[]>([]);
    const imageWidgetRef = useRef<WidgetAPI>();
    const { isOffline } = useIsOnline();

    const headline = watch("headline");
    const image = watch("image");
    const deckhead = watch("deckhead");
    const authors = watch("authors");
    const editors = watch("editors");
    const newImageUploaded = watch("newImageUploaded");
    const articleBody = watch("body");
    const publishState = watch("published");
    const updatedBy = watch("updated_by");
    const createdAt = article.created;
    const updatedAt = watch("updated");
    const isBrief = article.is_brief;
    const articleType = isBrief ? "Brief" : "Article";

    const updatedByLabel = updatedBy
        ? `${updatedBy.first_name ? updatedBy.first_name : updatedBy.username}`
        : "";
    const humanUpdatedBy = updatedBy
        ? `Last updated at ${format(
              parseJSON(updatedAt),
              "Pp"
          )} by ${updatedByLabel}`
        : `Created at ${format(parseJSON(createdAt), "Pp")}`;
    const articleLinkUrl = article.publish_date
        ? buildArticleUrl(article.publish_date, article.slug)
        : null;
    const [showPublishConfirm, setShowPublishConfirm] = useState(false);

    const featuredArticle: FeaturedArticleGraphql = {
        publishDate: article.publish_date,
        isBrief: article.is_brief,
        featuredCaption: watch("featured_caption"),
        slug: article.slug,
        punchWord: watch("punch_word") ?? "",
        image: {
            image: image?.cdn_url ?? PLACEHOLDER_AVATAR,
        },
    };
    const previewArticle: PreviewArticleGraphql = {
        deckhead: deckhead,
        authors: {
            edges: authors.map((a) => ({
                node: { name: a.label, slug: a.value },
            })),
        },
        pk: article.pk,
        isBrief: article.is_brief,
        articleSnippet: article.truncated_teaser,
        canonicalUrl: "",
        numberOfComments: article.comment_count,
        publishDate: article.publish_date,
        slug: article.slug,
        punchWord: watch("punch_word"),
        image: {
            image: image?.cdn_url ?? PLACEHOLDER_AVATAR,
        },
        headline: watch("headline"),
        imageCaption: watch("image_caption"),
    };
    const fullArticle: ArticleGraphql = {
        created: article.created,
        updated: article.updated,
        deckhead: deckhead,
        isBrief: article.is_brief,
        authors: {
            edges: authors.map((a) => ({
                node: { name: a.label, slug: a.value },
            })),
        },
        editors: {
            edges: editors.map((e) => ({
                node: { name: e.label, slug: e.value },
            })),
        },
        pk: article.pk,
        articleSnippet: article.truncated_teaser,
        canonicalUrl: "",
        numberOfComments: article.comments ? article.comments.length : 0,
        id: article.pk,
        published: article.published,
        publishDate: article.publish_date,
        featuredCaption: watch("featured_caption"),
        slug: article.slug,
        punchWord: watch("punch_word"),
        image: {
            image: image?.cdn_url ?? PLACEHOLDER_AVATAR,
        },
        headline: watch("headline"),
        imageCaption: watch("image_caption"),
        body: watch("body"),
        sections: {
            edges: [],
        },
        otherTags: {
            edges: [],
        },
        peopleTags: {
            edges: [],
        },
    };
    const onSubmit: SubmitHandler<ArticleEditorFormType> = async (data) => {
        if (isOffline) {
            setShowOffline(true);
            return;
        }
        setSaveState(true);
        const tAuthors = data.authors.map((t: AuthorFormType) => ({
            slug: t.value,
            name: t.label,
            pk: t.pk,
        }));
        const tTags = data.tags.map((t: TagFormType) => ({
            slug: t.value,
            name: t.label,
            pk: t.pk,
        }));
        const tSections = data.sections.map((t: SectionFormType) => ({
            slug: t.value,
            title: t.label,
            pk: t.pk,
            published: t.published,
        }));
        let imageS = {};
        if (newImageUploaded) {
            imageS = {
                image: image,
            };
        }
        const payload = {
            ...data,
            authors: tAuthors,
            tags: tTags,
            sections: tSections,
            ...imageS,
        };
        const articleReq = await fetch(
            `${API_ENDPOINT}api/v1/articles/${article.pk}/`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Token ${authToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        );
        setSaveState(false);
        if (articleReq.status != 200) {
            toast("Something went wrong saving this article", {
                type: "error",
            });
            return;
        }
        const respBody = await articleReq.json();
        setLastSavedData(respBody);
        // Update the tags form state
        // If we created a new tag, we want to update the form state
        // So it contains the ID of the new tag
        type temp4 = {
            slug: string;
            name: string;
            pk: number;
        };
        setValue(
            "tags",
            respBody.tags.map((t: temp4) => ({
                value: t.slug,
                label: t.name,
                pk: t.pk,
            }))
        );
        setValue(
            "authors",
            respBody.authors.map((t: temp4) => ({
                value: t.slug,
                label: t.name,
                pk: t.pk,
            }))
        );
        setValue("updated_by", respBody.updated_by);
        setValue("updated", respBody.updated);
        if (respBody?.image?.image) {
            setValue("image", respBody.image.image);
        }
        toast(`${articleType} saved successfully`);
        reset({}, { keepValues: true, keepIsValid: true });
        window.dispatchEvent(new Event("saveFinished"));
    };
    const onPublish = async () => {
        if (isOffline) {
            setShowOffline(true);
            return;
        }
        if (isDirty) {
            toast.info("Please save your changes before publishing.");
            return;
        }
        // Run some validation
        let msgs = [];
        if (lastSavedData.image == null) {
            msgs.push("Image is required");
        }
        if (!isBrief && lastSavedData.deckhead == "") {
            msgs.push("Deckhead is required");
        }
        if (lastSavedData.image_caption == "") {
            msgs.push("Image caption is required");
        }
        if (!isBrief && lastSavedData.featured_caption == "") {
            msgs.push("Teaser caption is required");
        }
        if (!isBrief && lastSavedData.punch_word == "") {
            msgs.push("Punch word is required");
        }
        if (msgs.length > 0) {
            toast.info(<ErrorToast messages={msgs} />, { theme: "colored" });
            return;
        }
        setPublishSaveState(true);
        const payload = {
            published: !publishState,
        };
        const articleReq = await fetch(
            `${API_ENDPOINT}api/v1/articles/${article.pk}/`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Token ${authToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        );
        setPublishSaveState(false);
        if (articleReq.status != 200) {
            toast(`Something went wrong publishing this ${articleType}`, {
                type: "error",
            });
            return;
        }
        const respBody = await articleReq.json();
        setValue("published", respBody.published);
        if (respBody.published) {
            toast(`${articleType} Published 🎉`);
        } else {
            toast(`${articleType} was unpublished`);
        }
    };
    const togglePreview = (checked: boolean) => {
        if (checked) {
            const articleBody = watch("body") ?? "";
            // Do some checks to prevent preview going wrong
            const articleChilds: Array<string> = [];
            // @ts-expect-error: my compelling reason to not fix and then delete this directive is: there is some undocument foo going on between CKE5 and react-form
            const $ = cheerio.load(articleBody);
            const articleBodyArr = $("body").children();
            articleBodyArr.map((_i, el) => {
                const outerHtml = $.html(el);
                articleChilds.push(outerHtml);
            });
            setArticleChildren(articleChilds);
            setPreviewMode(true);
        } else {
            setArticleChildren([]);
            setPreviewMode(false);
        }
    };

    async function runConvertBriefToFullArticle() {
        if (isOffline) {
            setShowOffline(true);
            return;
        }

        try {
            const payload = {
                is_brief: false,
            };
            await fetch(
                `${API_ENDPOINT}api/v1/articles/${article.pk}/`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Token ${authToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
            toast.success("Successfully converted to full article");

            // Redirect to the updated article page
            window.location.reload();
        } catch (error) {
            toast.error("Failed to convert brief to full article");
        }
    }

    return (
        <>
            <Meta title={`Edit Article | RIABiz Admin`} />
            <div className="flex">
                <div className="w-full sm:w-3/4">
                    <OfflineModal
                        setIsOpen={setShowOffline}
                        isOpen={showOffline}
                    />

                    <form className="mt-6 flex flex-col">
                        <PublishModal
                            setIsOpen={setShowPublishConfirm}
                            publishing={publishState}
                            isOpen={showPublishConfirm}
                            onConfirm={handleSubmit(onPublish)}
                        />
                        <AdminArticleEditorArticleStatus
                            previewMode={previewMode}
                            brief={isBrief}
                            publishState={publishState}
                            disabled={isOffline}
                            onClick={(e) => {
                                e!.preventDefault();
                                if (isOffline) {
                                    setShowOffline(true);
                                } else {
                                    setShowPublishConfirm(true);
                                }
                            }}
                            publishSaveState={publishSaveState}
                            headline={headline}
                            dirty={isDirty}
                            humanUpdatedBy={humanUpdatedBy}
                            published={article.published}
                            articleLinkUrl={articleLinkUrl}
                        />

                        {/* Editor */}
                        <div className="py-4" hidden={previewMode}>
                            <Disclosure defaultOpen={true}>
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="flex w-full cursor-pointer justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                                            <span>
                                                Article Details (click to
                                                expand)
                                            </span>
                                            <ChevronUpIcon
                                                className={`${
                                                    open
                                                        ? "rotate-180 transform"
                                                        : ""
                                                } h-5 w-5 text-blue-500`}
                                            />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-1 pt-3 pb-2 text-sm text-gray-500">
                                            {/** Show Hidden Brief Fields Checkbox **/}
                                            {isBrief && (
                                                <div className="col-span-2 mb-4 mt-2">
                                                    <ShowHiddenBriefFieldsCheckbox
                                                        setShowHiddenBriefFields={
                                                            setShowHiddenBriefFields
                                                        }
                                                        showHiddenBriefFields={
                                                            showHiddenBriefFields
                                                        }
                                                    />
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                                {/** Headline **/}
                                                <div className="col-span-2">
                                                    <AdminFormLabel
                                                        label={"Headline"}
                                                    />
                                                    <AdminFormTextInput
                                                        placeholder={
                                                            "Headline..."
                                                        }
                                                        register={register(
                                                            "headline",
                                                            { required: true }
                                                        )}
                                                    />
                                                    {errors.headline && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            This field is
                                                            required
                                                        </p>
                                                    )}
                                                </div>
                                                {/** Featured Checkbox **/}
                                                {(!isBrief ||
                                                    showHiddenBriefFields) && (
                                                    <div className="col-span-2">
                                                        <FullArticleCheckbox
                                                            register={register(
                                                                "full"
                                                            )}
                                                        />
                                                    </div>
                                                )}
                                                {/** Deckhead **/}
                                                {(!isBrief ||
                                                    showHiddenBriefFields) && (
                                                    <div className="col-span-2">
                                                        <AdminFormLabel
                                                            label={"Deckhead"}
                                                        />
                                                        <AdminFormTextInput
                                                            placeholder={
                                                                "Deckhead..."
                                                            }
                                                            register={register(
                                                                "deckhead"
                                                            )}
                                                        />
                                                    </div>
                                                )}
                                                {/** Teaser caption **/}
                                                {(!isBrief ||
                                                    showHiddenBriefFields) && (
                                                    <div className="col-span-2">
                                                        <AdminFormLabel
                                                            label={
                                                                "Teaser caption"
                                                            }
                                                        />
                                                        <AdminFormTextInput
                                                            placeholder={
                                                                "Teaser caption..."
                                                            }
                                                            register={register(
                                                                "featured_caption"
                                                            )}
                                                        />
                                                        {errors.featured_caption && (
                                                            <p className="mt-1 text-sm text-red-600">
                                                                This field is
                                                                required
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                                {/** Authors **/}
                                                <div className="col-span-2 md:col-span-1">
                                                    <AdminFormLabel
                                                        label={"Authors"}
                                                    />
                                                    <AdminAuthorsDropdown
                                                        control={
                                                            control as unknown as Control<FieldValues>
                                                        }
                                                        name="authors"
                                                        placeholder="Search for authors"
                                                        setValue={setValue}
                                                    />
                                                </div>
                                                {/** Editors **/}
                                                <div className="col-span-2 md:col-span-1">
                                                    <AdminFormLabel
                                                        label={"Editors"}
                                                    />
                                                    <AdminAuthorsDropdown
                                                        placeholder="Search for editors"
                                                        control={
                                                            control as unknown as Control<FieldValues>
                                                        }
                                                        name="editors"
                                                        setValue={setValue}
                                                    />
                                                </div>
                                                {/** Default Image button **/}
                                                <div className="col-span-2 md:col-span-1">
                                                    <AdminFormLabel
                                                        label={"Default image"}
                                                    />
                                                    {image?.cdn_url && (
                                                        <Image
                                                            className="cursor-pointer"
                                                            alt={
                                                                watch(
                                                                    "image_caption"
                                                                ) ?? ""
                                                            }
                                                            src={image.cdn_url}
                                                            width={100}
                                                            height={100}
                                                            onClick={() =>
                                                                imageWidgetRef?.current?.openDialog(
                                                                    ""
                                                                )
                                                            }
                                                            style={{
                                                                maxWidth:
                                                                    "100%",
                                                                height: "auto",
                                                            }}
                                                        />
                                                    )}
                                                    <AdminUploadcareWidget
                                                        name="image"
                                                        widgetRef={
                                                            imageWidgetRef
                                                        }
                                                        cdnUrl={image?.cdn_url}
                                                        setValue={setValue}
                                                        setError={setError}
                                                        register={register}
                                                    />
                                                </div>
                                                {/** Punch word **/}
                                                <div className="col-span-2 md:col-span-1">
                                                    <div>
                                                        <>
                                                            {(!isBrief ||
                                                                showHiddenBriefFields) && (
                                                                <div className="mb-6">
                                                                    <AdminFormLabel
                                                                        label={
                                                                            "Punch word"
                                                                        }
                                                                    />
                                                                    <AdminFormTextInput
                                                                        placeholder={
                                                                            "Punch word..."
                                                                        }
                                                                        register={register(
                                                                            "punch_word"
                                                                        )}
                                                                    />
                                                                    {errors.punch_word && (
                                                                        <p className="mt-1 text-sm text-red-600">
                                                                            This field is required
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </>
                                                        <AdminFormLabel
                                                            label={
                                                                "Default image caption"
                                                            }
                                                        />
                                                        <AdminFormTextInput
                                                            placeholder={
                                                                "Default image caption..."
                                                            }
                                                            register={register(
                                                                "image_caption"
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                {/** Tags **/}
                                                <div className="z-50 col-span-2 md:col-span-1">
                                                    <AdminFormLabel
                                                        label={"Tags"}
                                                    />
                                                    <AdminTagsDropdown
                                                        control={control}
                                                        name="tags"
                                                        setValue={setValue}
                                                    />
                                                </div>
                                                {/** Sections **/}
                                                <div className="col-span-2 md:col-span-1">
                                                    <AdminFormLabel
                                                        label={"Sections"}
                                                    />
                                                    <AdminSectionsDropdown
                                                        control={control}
                                                        name="sections"
                                                    />
                                                </div>
                                                {/** Editor notes **/}
                                                <div className="col-span-2">
                                                    <AdminFormLabel
                                                        label={"Editor notes"}
                                                    />
                                                    <textarea
                                                        className="form-textarea form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        {...register(
                                                            "editors_note"
                                                        )}
                                                        rows={3}
                                                        placeholder="Editor notes..."
                                                    />
                                                </div>
                                            </div>
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                            <Editor
                                articleBody={articleBody}
                                register={register}
                                setValue={setValue}
                            />
                        </div>

                        {/* PREVIEW MODE */}
                        {previewMode && (
                            <div hidden={!previewMode} className="pt-6">
                                <p className="border-b text-xl text-gray-700">
                                    Featured
                                </p>
                                <div
                                    style={{ width: "165px" }}
                                    className="my-3"
                                >
                                    <FeaturedArticleTile
                                        featuredArticle={featuredArticle}
                                    />
                                </div>
                                <p className="mt-4 border-b text-xl text-gray-700">
                                    Snippet
                                </p>
                                <div className="my-3 grid grid-cols-10">
                                    <div className="max-w-[790px col-span-10">
                                        <ArticleSnippet
                                            article={previewArticle}
                                        />
                                    </div>
                                </div>
                                <p className="mt-4 border-b text-xl text-gray-700">
                                    Article Content
                                </p>
                                <div className="my-3 grid grid-cols-10">
                                    <div className="col-span-10 max-w-[750px]">
                                        <ArticleContainer
                                            article={fullArticle}
                                            articleChildrenOrBodyString={
                                                articleChildren
                                            }
                                            adminControls={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* PREVIEW MODE */}
                    </form>
                    <div id="comments" className="mb-20">
                        {/* Comments */}
                        <StyledDivider />
                        <div>
                            {article.comments &&
                                article.comments.length > 0 && (
                                    <ArticleComments
                                        isOffline={isOffline}
                                        articlePk={article.pk}
                                        authToken={authToken}
                                    />
                                )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}

                <div className="sticky top-0 right-0 ml-4 hidden h-screen sm:block sm:w-1/4">
                    <div className=" grid grid-cols-1">
                        <div className="my-4 border-b text-center">
                            <span>Editing:</span>
                        </div>
                        <div className="flex items-center space-x-3 justify-self-center">
                            <span className="text-lg text-gray-600">
                                Preview
                            </span>
                            <Switch
                                checked={previewMode}
                                onChange={togglePreview}
                                className={`${
                                    previewMode ? "bg-gray-400" : "bg-gray-200"
                                }
        relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                            >
                                <span
                                    id="previewArticleBtn"
                                    aria-hidden="true"
                                    className={`${
                                        previewMode
                                            ? "translate-x-9"
                                            : "translate-x-0"
                                    }
          pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                />
                            </Switch>
                        </div>

                        <div className="my-4 border-b text-center">
                            <span>Extras:</span>
                        </div>
                        <div className="">
                            <div className="flex">
                                <SearchDialog
                                    type="article"
                                    buttonName="Headline Search"
                                    id="searchArticleBtn"
                                    title="Generate Article Link"
                                />
                            </div>
                            <div className="flex">
                                <SearchDialog
                                    buttonName="Listing Search"
                                    type="listing"
                                    id="searchListingBtn"
                                    title="Generate Directory Listing Link"
                                />
                            </div>

                            <div className="my-4 border-b text-center">
                                <span>Actions:</span>
                            </div>
                            <div className="flex">
                                <button
                                    type="submit"
                                    id="saveArticleBtn"
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={isOffline || saveState}
                                    className="mx-auto cursor-pointer rounded-md border border-transparent bg-blue px-4 py-2 text-lg font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                                >
                                    {saveState ? "Saving..." : "Save"}
                                </button>
                            </div>
                            <div className="flex">
                                <Link
                                    href={`/admin/revisions/${article.pk}`}
                                    passHref
                                    className="mx-auto my-2 flex "
                                >
                                    <div className="flex rounded-md border border-transparent bg-blue px-4 py-2 font-medium text-white no-underline  hover:bg-blue-700">
                                        <ExternalLinkIcon className="h-8 w-8 text-white" />
                                        <div className="pl-2 pt-1">
                                            Revisions
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="flex">
                                <Link
                                    href="#comments"
                                    passHref
                                    className="mx-auto my-2 flex "
                                >
                                    <div className="flex rounded-md border border-transparent bg-blue px-4 py-2 font-medium text-white no-underline  hover:bg-blue-700">
                                        <AnnotationIcon className="w-6 h-6" />
                                        <div className="pl-2">
                                            Comments
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            {isBrief && (
                                <div className="flex">
                                    <button
                                        type="button"
                                        className="mx-auto cursor-pointer rounded-md border border-transparent bg-blue px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700"
                                        onClick={async () => {
                                            await runConvertBriefToFullArticle();
                                        }}
                                    >
                                        <div className="flex items-center">
                                            <BookOpenIcon className="flex h-8 w-8 text-white" />
                                            <div className="flex pl-2">Convert to Full Article</div>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
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
    slug: [string, string, string, string];
};
export const getServerSideProps: GetServerSideProps<
    EditorProps,
    editorQuery
> = async (context) => {
    const token = await getToken({ req: context.req });
    const authToken = token!.accessToken; // middleware checks the existence of an authorized user
    const notFoundObj = {
        notFound: true,
    } as const;

    const params = context.params;
    if (!params || !authToken) {
        return notFoundObj;
    }
    const [_utcYear_OR_PK, _utcMonth, _utcDay] = params.slug;
    // do some sanity handling
    const regex = /^\d+/;
    const found = _utcYear_OR_PK.match(regex);
    if (found == null || found.length !== 1) {
        return notFoundObj;
    }
    const articleReq = await fetch(
        `${API_ENDPOINT}api/v1/articles/${_utcYear_OR_PK}/admin/`,
        {
            headers: {
                Authorization: `Token ${authToken}`,
                "Content-Type": "application/json",
            },
        }
    );
    const data = await articleReq.json();
    if (articleReq.status == 404) {
        return notFoundObj;
    }
    if (data?.detail == "Invalid token.") {
        return {
            redirect: {
                destination: FRONTEND_SIGNIN_URL,
                permanent: false,
            },
        };
    }
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(commentKeys.list(data.pk, "1"), () =>
        fetchAdminComments({
            authToken,
            articlePk: data.pk,
        })
    );

    return {
        props: {
            authToken: authToken,
            dehydratedState: dehydrate(queryClient),
            article: {
                ...data,
                body: articleBodyCKE4Compat(data.body),
            },
        },
    };
};
