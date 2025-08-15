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

import moment from "moment";
import * as cheerio from "cheerio";
import { isSaturday, lightFormat, nextSaturday } from "date-fns";
import {
    ARTICLE_VIEW_COOKIE_DURATION,
    PLACEHOLDER_AVATAR,
    SITE_URL,
    VERCEL_ENV,
} from "@/constants";
import {
    ArticleREST,
    ArticleGraphql,
    Tag,
    CommentREST,
    RelatedMovesREST,
    CategoryREST,
    RelatedListingsREST,
    SearchArticles200Response,
    AuthorFullREST,
    ListAuthor200Response,
    ListSections200Response,
    SectionFullREST,
    ListTags200Response,
    ListPerson200Response,
    PersonREST,
    ListComments200Response, RelatedJobsREST
} from "@/interfaces/article";
import {
    API_ARTICLES_ADMIN,
    API_AUTHORS,
    API_COMMENTS,
    API_FETCH_ARTICLES,
    API_FETCH_PEOPLE,
    API_FETCH_SECTIONS,
    API_FETCH_TAGS_WITH_COUNT,
    API_SEARCH_ARTICLES,
    API_SEARCH_LISTINGS,
    authFetcher,
    genericFetcher,
    makeFetchCommentsUrl,
} from "./api";
import {
    DirectoryListingREST,
    SearchListings200Response,
} from "@/interfaces/listing";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    articleKeys,
    authorKeys,
    commentKeys,
    directoryListingKeys,
} from "./query-key-factory";
import { createContext, useCallback, useContext, useState } from "react";
import slugify from "slugify";
import { PaginatedCommentDisplayList } from "generated/riabiz-django-api/api";
import Cookies from "js-cookie";

export interface ArticleViews {
    [articleId: string]: string;
}

export const isValidEmailRegEx =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const renderPrintableDate = (
    publishDate: moment.MomentInput,
    noDay: boolean = false,
    wantRelative: boolean = true
) => {
    let pubDate = !noDay
        ? moment(publishDate).format("dddd, MMMM D, yyyy [at] h:mm A")
        : moment(publishDate).format("MMMM D, yyyy [at] h:mm A");
    if (
        wantRelative &&
        moment(publishDate).isAfter(moment().subtract(1, "days"))
    ) {
        pubDate = moment(publishDate).fromNow();
    }
    return pubDate;
};

export const getTodayDateISO = (): string => {
    return getDateISO(new Date());
};

export const getDateISO = (date: Date): string => {
    return lightFormat(date, "yyyy-MM-dd");
};

export const getNextWhitepaperSaturdaySendDate = (dateStr: string): string => {
    let date = new Date(dateStr);
    if (!isSaturday(date)) {
        date = nextSaturday(date);
    }
    return getDateISO(date);
};

export const getUtcDateStrings = (pubDate: moment.MomentInput) => {
    return {
        utcYear: moment(pubDate).utc().format("yyyy"),
        utcMonth: moment(pubDate).utc().format("M"),
        utcDay: moment(pubDate).utc().format("D"),
    };
};

// returns true if the page slug is offending:
// any URL that doesn't have only lowercase letters and numbers separated by hypens
export const hasOffendingArticleSlug = (pageSlug: string) => {
    const regex = /^[-\w]+$/;
    const found = pageSlug.match(regex);
    return !found;
};
interface SlugType {
    slug: string;
}
export const makeDirectoryEditLinkUrl = (slug: string) => {
    return `/d/edit_listing/${slug}`;
};
export const buildRelatedMovesUrl = (article: SlugType) => {
    return `/related-people-moves/a/${article.slug}`;
};
export const buildTagUrl = (tag: SlugType | string, page: number = 1) => {
    let slug = "";
    if (typeof tag === "string") {
        slug = tag;
    } else {
        slug = tag.slug;
    }
    return `/tags/${slug}/page/${page}`;
};
export const buildJobsUrl = (tag: SlugType | string, page: number = 1) => {
    let slug = "";
    if (typeof tag === "string") {
        slug = tag;
    } else {
        slug = tag.slug;
    }
    return `/job-board/?category=&letter=&organizationSlug=${slug}`;
};
export const buildPersonUrl = (person: PersonREST | SlugType) => {
    let slug: string;
    if ("slug" in person) {
        slug = person.slug;
    } else {
        slug = slugify(person.full_name, { lower: true, strict: true });
    }
    return `/people/${slug}/page/1`;
};
export const buildAuthorUrl = (author: SlugType) => {
    return `/author/${author.slug}/page/1`;
};
export const buildSectionUrl = (section: SlugType, pageNum: number = 1) => {
    return `/section/${section.slug}/page/${pageNum}`;
};

export const buildArchivesUrl = (year: number, month: number) => {
    return `/archives/${year}/${month}/`;
};

export const buildDirectoryListingUrl = (listing: DirectoryListingREST) => {
    return `/d/${listing.organization.slug}`;
};

export const buildArticleUrl = (pubDate: moment.MomentInput, slug: string) => {
    // debugger;
    if (VERCEL_ENV != "production" && !pubDate) {
        debugger;
        throw Error("buildArticleUrl: bad publication date");
    }
    const { utcYear, utcMonth, utcDay } = getUtcDateStrings(pubDate);
    return `/a/${utcYear}/${utcMonth}/${utcDay}/${slug}`;
};

export const articleBodyCKE4Compat = (articleBody: string) => {
    const $ = cheerio.load(articleBody);
    $("figure.image").each(function (_i, elem) {
        const cssFigureMap = $(elem).css();
        // detect the use of floats. This is the CKE4 format.
        // Set the width manually to 200px on the content html.
        if (cssFigureMap?.float == "left" || cssFigureMap?.float == "right") {
            // by default float all figures to the right
            if (cssFigureMap?.float == "left") {
                $(elem).addClass("image image_resized image-style-align-left");
            } else {
                $(elem).addClass("image image_resized image-style-align-right");
            }
            $(elem).removeAttr("style");
            $(elem).prop("style", "width:25%;");
        }
    });
    $("img").each(function (_i, elem) {
        $(elem).removeAttr("height");
        $(elem).removeAttr("width");
    });
    $("table").each(function (_i, elem) {
        $(elem).css("border", "1px solid hsl(0, 0%, 30%);");
    });
    return $.html();
};

export const transformArticlePayloadToGQL = (
    article: ArticleREST
): ArticleGraphql => {
    const articleLinkUrl =
        article.publish_date !== null
            ? buildArticleUrl(article.publish_date, article.slug)
            : "#";

    const canonicalUrl = SITE_URL + articleLinkUrl;

    return {
        body: article.body,
        isBrief: article.is_brief,
        created: article.created,
        updated: article.updated,
        published: article.published,
        headline: article.headline,
        deckhead: article.deckhead,
        pk: article.pk,
        id: article.pk,
        punchWord: article.punch_word,
        editorsNote: article.editors_note,
        publishDate: article.publish_date,
        teaser: article.truncated_teaser,
        featuredCaption: article.featured_caption,
        imageCaption: article.image_caption,
        slug: article.slug,
        numberOfComments: article.comments // article.comment_count not set
            ? article.comments.length
            : 0,
        canonicalUrl: canonicalUrl,
        comments: {
            edges: article.comments.map((c: CommentREST) => ({
                node: {
                    id: c.pk,
                    pk: c.pk,
                    isLegacy: c.is_legacy,
                    body: c.body,
                    avatarUrl: c.avatar_url,
                    authorName: c.author_name,
                    created: c.created,
                    approved: c.approved,
                },
            })),
        },
        relatedListings: article.related_listings.map(
            (listing: RelatedListingsREST) => ({
                organization: {
                    name: listing.organization.name,
                    slug: listing.organization.slug,
                    corporatePrincipalName:
                        listing.organization.corporate_principal_name,
                },

                categories: {
                    edges: listing.categories.map((a: CategoryREST) => ({
                        node: { title: a.title },
                        
                    })),
                },
            })
        ),
        relatedJobs: article.related_jobs ?? [],
        relatedMovesSnippet: article.related_moves.map(
            (listing: RelatedMovesREST) => ({
                slug: listing.slug,
                headline: listing.headline,
                deckhead: listing.deckhead,

                image: {
                    image: listing.image.image.cdn_url,
                },

                publishDate: listing.publish_date,
            })
        ),
        peopleTags: {
            edges: article.people_tags.map((tag: Tag) => ({
                node: {
                    name: tag.name,
                    slug: tag.slug,
                    pk: tag.pk,
                },
            })),
        },
        otherTags: {
            edges: article.other_tags.map((tag: Tag) => ({
                node: {
                    name: tag.name,
                    slug: tag.slug,
                    pk: tag.pk,
                    jobCount: tag?.jobCount,
                },
            })),
        },
        sections: {
            edges: article.sections.map((section) => ({
                node: {
                    title: section.title,
                    slug: section.slug,
                    pk: section.pk ?? 0,
                },
            })),
        },
        authors: {
            edges: article.authors.map((a) => ({
                node: { name: a.name, slug: a.slug },
            })),
        },
        editors: {
            edges: article.editors.map((e) => ({
                node: { name: e.name, slug: e.slug },
            })),
        },
        image: {
            image: article?.image?.image?.cdn_url ?? PLACEHOLDER_AVATAR,
        },
    };
};
export interface usePaginateProps {
    page?: string;
    page_size?: string;
}
interface useOrderByProps {
    order_by?: string;
}
type useAllArticlesProps = useOrderByProps & usePaginateProps;
export const useAllArticles = ({
    page = "1",
    page_size = "100",
    order_by = "-publish_date",
}: useAllArticlesProps) => {
    return useQuery(articleKeys.list("", String(page)), () =>
        fetchArticles({ page: page, page_size: page_size, order_by: order_by })
    );
};
export const fetchArticles = async (options: useAllArticlesProps) => {
    let url = new URL(API_FETCH_ARTICLES);

    let params = { ...options };
    url.search = new URLSearchParams(params).toString();
    const data: SearchArticles200Response = await genericFetcher(url);

    return data;
};
interface useSearchProps {
    search: string;
    page?: string;
    page_size?: string;
}
interface SearchArticlesProps {
    onSuccess?: (data: SearchArticles200Response) => void;
}
interface articleSearchProps extends useSearchProps {
    options: SearchArticlesProps;
}
const articleSearchOnSuccess = (
    data: SearchArticles200Response,
    queryClient: QueryClient
) => {
    if (data != null && data.next_page != null) {
        const search = data.query_params.search;
        const page = String(data.next_page);
        queryClient.prefetchQuery(articleKeys.list(search, page), () =>
            searchArticles({ search, page })
        );
    }
};
export const useSearchArticle = ({
    search,
    page = "1",
    page_size = "20",
    options,
}: articleSearchProps) => {
    const queryClient = useQueryClient();
    const onSuccessFunc = useCallback(
        (data: SearchArticles200Response) => {
            articleSearchOnSuccess(data, queryClient);
            options.onSuccess?.(data);
        },
        [options, queryClient]
    );
    return useQuery(
        articleKeys.list(search, String(page)),
        () => searchArticles({ search, page, page_size }),
        {
            ...options,
            onSuccess: onSuccessFunc,
            refetchOnWindowFocus: false,
            staleTime: 5 * 6 * 1000,
        }
    );
};
interface adminComments {
    articlePk: number;
    authToken: string;
}
export const useAdminComments = async ({
    articlePk,
    authToken,
}: adminComments) => {
    return useQuery(commentKeys.list(articlePk.toString(), "1"), () =>
        fetchAdminComments({ articlePk, authToken })
    );
};
export const fetchAdminComments = async ({
    articlePk,
    authToken,
}: adminComments): Promise<ListComments200Response> => {
    let url = new URL(makeFetchCommentsUrl(articlePk));
    const comment_data: ListComments200Response = await genericFetcher(url, {
        headers: {
            Authorization: `Token ${authToken}`,
        },
    });
    return comment_data;
};
export const listUnapprovedComments = async (
    authToken: string
): Promise<PaginatedCommentDisplayList> => {
    let url = new URL(API_COMMENTS);
    let params = { approved: "false" };
    url.search = new URLSearchParams(params).toString();
    const comment_data: PaginatedCommentDisplayList = await genericFetcher(
        url,
        {
            headers: {
                Authorization: `Token ${authToken}`,
            },
        }
    );
    return comment_data;
};
export const handleComment = async ({
    authToken,
    pk,
    approve,
}: {
    pk: number;
    authToken: string;
    approve: boolean;
}): Promise<CommentREST> => {
    let url = new URL(
        `${API_COMMENTS}${pk}/${approve ? "approve" : "unapprove"}/`
    );
    return authFetcher(url, {
        method: "PATCH",
        headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
        },
    });
};
export const patchComment = async ({
    authToken,
    pk,
    body,
}: {
    pk: number;
    authToken: string;
    body: string;
}): Promise<CommentREST> => {
    let url = new URL(`${API_COMMENTS}${pk}/`);
    const payload = {
        body,
    };
    return authFetcher(url, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
        },
    });
};
export const deleteComment = async ({
    authToken,
    pk,
}: {
    pk: number;
    authToken: string;
}): Promise<Response> => {
    let url = new URL(`${API_COMMENTS}${pk}/`);
    return authFetcher(url, {
        method: "DELETE",
        headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
        },
    });
};
export const searchArticles = async (options: useSearchProps) => {
    let url = new URL(API_SEARCH_ARTICLES);
    let params = { ...options };
    url.search = new URLSearchParams(params).toString();
    const article_data: SearchArticles200Response = await genericFetcher(url);
    return article_data;
};
interface articleAdminListProps {
    search: string;
    page: string;
    page_size: string;
    ordering: string;
    authToken: string;
}
export const listArticles = async ({
    search,
    page,
    page_size,
    ordering,
    authToken,
}: articleAdminListProps): Promise<SearchArticles200Response> => {
    const url = new URL(API_ARTICLES_ADMIN);
    let searchParam = {};
    let unapprovedParam = {};
    if (search) {
        searchParam = { search: search };
    }
    if (ordering === "unapproved_comments") {
        unapprovedParam = { unapproved: "true" };
        ordering = "-updated";
    }
    let params = {
        page,
        page_size,
        ordering,
        ...searchParam,
        ...unapprovedParam,
    };
    url.search = new URLSearchParams(params).toString();
    return authFetcher(url, {
        headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
        },
    });
};
export const useListArticles = ({
    search,
    page = "1",
    page_size = "20",
    ordering = "-updated",
    authToken,
}: articleAdminListProps) => {
    const filters = `search=${search}&page_size=${page_size}&ordering=${ordering}`;
    return useQuery(articleKeys.list(filters, page), () =>
        listArticles({ search, page, page_size, authToken, ordering })
    );
};

interface SearchListingsProps {
    onSuccess?: (data: SearchListings200Response) => void;
    keepPreviousData?: boolean;
    staleTime?: number;
}
interface listingSearchProps extends useSearchProps {
    options: SearchListingsProps;
}
const listingSearchOnSuccess = (
    data: SearchListings200Response,
    queryClient: QueryClient
) => {
    if (data != null && data.next_page != null) {
        const search = data.query_params.search;
        const page = String(data.next_page);
        queryClient.prefetchQuery(
            directoryListingKeys.list({ search, page }),
            () => searchListings({ search, page })
        );
    }
};
export const useSearchListing = ({
    search,
    page = "1",
    page_size = "20",
    options,
}: listingSearchProps) => {
    const queryClient = useQueryClient();
    const onSuccessFunc = useCallback(
        (data: SearchListings200Response) => {
            listingSearchOnSuccess(data, queryClient);
            options.onSuccess?.(data);
        },
        [options, queryClient]
    );
    return useQuery(
        directoryListingKeys.list({ search, page }),
        () => searchListings({ search, page, page_size }),
        {
            ...options,
            onSuccess: onSuccessFunc,
            refetchOnWindowFocus: false,
            staleTime: 5 * 6 * 1000,
        }
    );
};

export const searchListings = async (options: useSearchProps) => {
    let url = new URL(API_SEARCH_LISTINGS);

    let params = { ...options };
    url.search = new URLSearchParams(params).toString();
    const listing_data: SearchListings200Response = await genericFetcher(url);

    return listing_data;
};
export const fetchAllTags = async (
    page: string = "1"
): Promise<ListTags200Response> => {
    let url = new URL(API_FETCH_TAGS_WITH_COUNT);
    let params = { page: page, page_size: "100" };
    url.search = new URLSearchParams(params).toString();
    return await genericFetcher(url);
};
export const fetchAllPeople = async (
    page: string = "1"
): Promise<ListPerson200Response> => {
    let url = new URL(API_FETCH_PEOPLE);
    let params = { page: page, page_size: "100" };
    url.search = new URLSearchParams(params).toString();
    return await genericFetcher(url);
};
export const fetchSections = async (): Promise<SectionFullREST[]> => {
    let url = new URL(API_FETCH_SECTIONS);
    const data: ListSections200Response = await genericFetcher(url);
    return data.results || [];
};
export const fetchAllAuthors = async ({
    page = "1",
    page_size = "20",
}: usePaginateProps): Promise<ListAuthor200Response> => {
    let url = new URL(API_AUTHORS);
    let params = { page: page, page_size: page_size };
    url.search = new URLSearchParams(params).toString();
    return await genericFetcher(url);
};
export const fetchAuthors = async (
    authorSlugs: string[]
): Promise<AuthorFullREST[]> => {
    let url = new URL(API_AUTHORS);
    let params = { slugs: authorSlugs.join(",") };
    url.search = new URLSearchParams(params).toString();
    const data: ListAuthor200Response = await genericFetcher(url);
    return data.results || [];
};
export type AuthorRESTCreate = Pick<
    AuthorFullREST,
    "name" | "twitter_name" | "biography" | "blurb" | "profile_image" | "image"
>;
export interface CreateProps {
    authToken: string;
}
interface AuthorCreateProps extends CreateProps {
    payload: AuthorRESTCreate;
}
interface authorPatchProps extends AuthorCreateProps {
    authorSlug: string;
}
export const patchAuthor = async ({
    authorSlug,
    payload,
    authToken,
}: authorPatchProps): Promise<Response> => {
    let url = new URL(`${API_AUTHORS}${authorSlug}/`);
    const authorResp = await fetch(url, {
        method: "PATCH",
        headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    return authorResp;
};
export const createAuthor = async ({
    payload,
    authToken,
}: AuthorCreateProps): Promise<Response> => {
    let url = new URL(API_AUTHORS);
    const authorResp = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    return authorResp;
};
export const fetchAuthor = async (
    authorSlug: string
): Promise<AuthorFullREST> => {
    let url = new URL(`${API_AUTHORS}${authorSlug}/`);
    const data: AuthorFullREST = await genericFetcher(url);
    return data;
};
type useAllAuthorsProps = usePaginateProps;
export const useAllAuthors = ({
    page = "1",
    page_size = "20",
}: useAllAuthorsProps) => {
    return useQuery(authorKeys.list("", String(page)), () =>
        fetchAllAuthors({ page: page, page_size: page_size })
    );
};
export const useAuthors = (authorSlugs: string[]) => {
    return useQuery(authorKeys.details(authorSlugs), () =>
        fetchAuthors(authorSlugs)
    );
};
export const invalidateAuthorPage = (
    queryClient: QueryClient,
    page: string
) => {
    queryClient.invalidateQueries({
        queryKey: authorKeys.list("", String(page)),
    });
};

type ArticleViewsContextType = {
    articleViews: ArticleViews;
    articleViewCount: number;
    setArticleViews: React.Dispatch<React.SetStateAction<ArticleViews>>;
    viewArticle: (articleId: number) => void;
    clearArticleViews: () => void;
};

const ArticleViewsContext = createContext<ArticleViewsContextType | undefined>(
    undefined
);
export const useGetArticleViews = (): ArticleViewsContextType => {
    const context = useContext(ArticleViewsContext);
    if (!context) {
        throw new Error(
            "useGetArticleViews must be used within an ArticleViewsProvider"
        );
    }
    return context;
};

type ArticleViewsProviderProps = {
    children: React.ReactNode;
};

const getStoredArticleViews = (): ArticleViews => {
    const articleViewsJSON = Cookies.get("articleViews") || "{}";
    let storedArticleViews: ArticleViews = {};

    try {
        storedArticleViews = JSON.parse(articleViewsJSON);
        return storedArticleViews;
    } catch (error) {
        storedArticleViews = {};
        return storedArticleViews;
    }
};

export const ArticleViewsProvider = ({
    children,
}: ArticleViewsProviderProps) => {
    const [articleViews, setArticleViews] = useState<ArticleViews>(
        getStoredArticleViews()
    );

    const viewArticle = useCallback((articleId: number) => {
        setArticleViews((prev) => {
            const today = moment().format("YYYY-MM-DD");
            const newArticleViews = {
                ...prev,
                [articleId]: today,
            };
            Cookies.set("articleViews", JSON.stringify(newArticleViews), {
                expires: ARTICLE_VIEW_COOKIE_DURATION,
            });
            return newArticleViews;
        });
    }, []);

    const clearArticleViews = useCallback(() => {
        Cookies.remove("articleViews");
        setArticleViews({});
    }, []);

    const articleViewCount = Object.keys(articleViews).length;

    return (
        <ArticleViewsContext.Provider
            value={{
                articleViews,
                articleViewCount,
                setArticleViews,
                viewArticle,
                clearArticleViews,
            }}
        >
            {children}
        </ArticleViewsContext.Provider>
    );
};

export function clearExpiredArticleViews() {
    let storedArticleViews = getStoredArticleViews();

    const currentDate = moment().format("YYYY-MM-DD");
    for (const articleId in storedArticleViews) {
        const viewDate = storedArticleViews[articleId];
        const daysSinceViewed = moment(currentDate).diff(viewDate, "days");
        if (daysSinceViewed >= 30) {
            delete storedArticleViews[articleId];
        }
    }

    Cookies.set("articleViews", storedArticleViews, { expires: 365 });
}
