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

import { GetFullArticleQuery, GetFeaturedArticlesQuery } from "graphql/types";
import { PaginateBase, PaginateResults, SearchPaginateResults } from "./rest";

export type PK = number;

export type ImageREST = InnerImageRest & {
    pk: PK;
    title: string;
    altText: string;
    image: InnerImageRest;
    url: string;
};
export type InnerImageRest = {
    uuid: string;
    cdn_url: string;
};
export type ListAuthor200Response = PaginateResults & {
    results?: AuthorFullREST[];
};
export type ListTeamMember200Response = PaginateResults & {
    results?: TeamMemberREST[];
};
export type ListTag200Response = PaginateResults & {
    results?: TagAdminREST[];
};
export type SearchAuthor200Response = SearchPaginateResults & {
    results?: AuthorFullREST[];
};
export type TagWithCountREST = Tag & {
    reference_count: number;
};
// TODO: reconcile this with ListTag200Response - names are too similar
export type ListTags200Response = PaginateBase & {
    results?: TagWithCountREST[];
};
export type ListPerson200Response = PaginateBase & {
    results?: PersonREST[];
};
export type ListSections200Response = PaginateBase & {
    results?: SectionFullREST[];
};

export type TagAdminREST = TagWithCountREST & {
    is_person: boolean;
};
export type TagAdminRESTCreate = Pick<TagAdminREST, "name">;
export interface AuthorFullREST {
    readonly pk: number;
    name: string;
    slug: string;
    image?: InnerImageREST;
    profile_image?: string;
    title?: string;
    biography?: string;
    blurb?: string;
    twitter_name?: string;
    phone_numbers: Array<PhoneNumber>;
    email_addresses: Array<EmailAddress>;
    article_count: number;
}

export type Author = {
    name: string;
    slug: string;
    pk: PK;
};

export type Tag = {
    name: string;
    slug: string;
    pk?: number;
    jobCount?: number;
};
export type PersonREST = {
    readonly pk?: number;
    first_name: string;
    middle_name?: string;
    last_name?: string;
    readonly full_name: string;
    image?: ImageREST;
};
export type SectionFullREST = {
    readonly pk?: number;
    title: string;
    slug: string;
    published: boolean;
    description?: string;
    tagline?: string;
    readonly created?: string;
    readonly updated?: string;
    publishDate?: string;
    bannerUrl?: string;
    image: ImageREST;
    adCode?: string;
};

export type Section = {
    title: string;
    slug: string;
    pk: PK;
    published: boolean;
};

export type User = {
    first_name: string;
    last_name: string;
    pk: PK;
    username: string;
};

export type BaseArticle = {
    created: string;
    deckhead?: string;
    full?: boolean;
    headline: string;
    published: boolean;
    slug: string;
    teaser?: string;
    updated: string;
};
export type CommentREST = {
    pk: PK;
    body: string;
    created: string;
    author_name: string;
    avatar_url?: string;
    is_legacy: boolean;
    approved: boolean;
};
export type RelatedMovesREST = {
    slug: string;
    headline: string;
    deckhead: string;
    image: ImageREST;
    publish_date: string;
};
export type RelatedJobsREST = {
    slug: string;
    title: string;
    created_at: string;
    logo: string;
    organization_logo: string;
    organization_slug: string;
};
export type OrganizationREST = {
    readonly pk?: number;
    name: string;
    slug: string;
    tags: TagWithCountREST[];
    logo?: ImageREST;
    number_of_ftes?: number;
    revenue?: number;
    founding_year?: number;
    company_type_notes?: string;
    corporate_url?: string;
    corporate_phone?: string;
    corporate_principal_name: string;
    corporate_principal_image?: ImageREST;
    billing_stripe_user?: string;
    readonly organization_marketing_contacts?: string;
    ria_dept_name?: string;
    ria_contact_name?: string;
    ria_contact_email?: string;
    ria_contact_phone?: string;
    ria_contact_image?: ImageREST;
    readonly created?: string;
    readonly updated?: string;
    readonly address: ListAddress200ResponseResultsInner;
    addresses: Array<ListAddress200ResponseResultsInner>;
    marketing_contact?: Array<ListOrganizations200ResponseResultsInnerMarketingContactInner>;
};
export interface ListOrganizations200ResponseResultsInnerMarketingContactInner {
    readonly pk?: number;
    marketing_contact_name?: string;
    marketing_contact_phone?: string;
    marketing_contact_email?: string;
    readonly organization_id?: string;
    readonly created?: string;
    readonly updated?: string;
}
export interface ListAddress200ResponseResultsInner {
    readonly pk?: number;
    street_address_1?: string;
    street_address_2?: string;
    city: string;
    territory: ListAddress200ResponseResultsInnerTerritory;
    postal_code?: string;
}
export interface ListAddress200ResponseResultsInnerTerritory {
    readonly pk?: number;
    name?: string;
    abbr: string;
    country: number;
}
export type CategoryREST = {
    readonly pk?: number;
    title: string;
    slug: string;
    readonly created?: string;
    readonly updated?: string;
};
export type RelatedListingsREST = {
    organization: OrganizationREST;
    categories: CategoryREST[];
};
export type ListComments200Response = PaginateBase & {
    results?: Array<CommentREST>;
};
export type ListArticles200Response = PaginateBase & {
    results?: Array<ArticleREST>;
};
export type SearchArticles200Response = SearchPaginateResults & {
    results?: Array<ArticleREST>;
};
export type ListArticleRevisions200Response = {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results?: Array<RevisionREST>;
};
export type RevisionREST = {
    pk: PK;
    body: string;
    headline: string;
    article: number;
    updated_by: User;
    created: string;
};
export type ArticleREST = BaseArticle & {
    pk: PK;
    body: string[];
    is_brief: boolean;
    tags: Tag[];
    authors: Author[];
    editors: Author[];
    comment_count: number;
    unapproved_comment_count?: number;
    comments: CommentREST[];
    editors_note?: string;
    featured_caption: string;
    image?: ImageREST;
    image_caption?: string;
    // currently we don't have any use for these:
    // image_flattened?: any,
    // jumbo_image?: any,
    // main_article_of?: any[],
    other_tags: Tag[] | [];
    people_tags: Tag[] | [];
    publish_date?: string;
    publish_day?: number;
    publish_month?: number;
    publish_year?: number;
    punch_word?: string;
    related_moves: RelatedMovesREST[];
    related_jobs: RelatedJobsREST[];
    related_listings: RelatedListingsREST[];
    sections: SectionFullREST[];
    truncated_teaser?: string;
    updated_by?: User;
    users_editing?: User[];
};
export type TeamMemberRESTCreate = Pick<
    TeamMemberREST,
    "name" | "job_title" | "importance" | "description"
>;
export interface TeamMemberREST {
    readonly id: number;
    name: string;
    job_title: string;
    emails?: string;
    contact_info?: string;
    description?: string;
    image?: ImageREST;
    published: boolean;
    importance: number;
}

export type GraphqlAuthor = {
    node: {
        name: string;
        slug: string;
    };
};
export type FeaturedArticleGraphqlEdges = {
    edges: GraphqlArticleNode[];
};
export type FeaturedArticleGraphqlNode = {
    node: FeaturedArticleGraphql;
};
export type FeaturedArticleGraphql = NonNullable<
    NonNullable<GetFeaturedArticlesQuery["articles"]>["edges"]
>[number]["node"];

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
// make publishDate optional
// remove the attributes not needed
export type PreviewArticleGraphql = WithOptional<
    Omit<
        ArticleGraphql,
        | "body"
        | "sections"
        | "otherTags"
        | "peopleTags"
        | "created"
        | "updated"
        | "editors"
        | "id"
        | "featuredCaption"
        | "published"
    >,
    "publishDate"
>;

export type GraphqlArticleList = {
    articles: GraphqlArticleEdges;
};
export type GraphqlArticleEdges = {
    edges: GraphqlArticleNode[];
};
export type GraphqlArticleNode = {
    node: ArticleGraphql;
};
export type CommentGraphql = {
    id: PK;
    pk: PK;
    body: string;
    authorName: string;
    avatarUrl?: string;
    created: string;
    isLegacy: boolean;
    approved: boolean;
};
export type CommentGraphqlNode = {
    node: CommentGraphql;
};
export type RelatedListingGraphql = {
    node: RelatedListingGraphql;
};
export type RelatedListingGraphqlNode = {
    node: RelatedListingGraphql;
};
// TODO: Finish using omit<> to fully reduce PreviewArticleGraphql
//
// created: article.created,
// updated: article.updated,
// published: article.published,
// deckhead: deckhead,
// authors: {
//   edges: authors.map((a) => ({ node: { name: a.label, slug: a.value } })),
// },
// pk: article.pk,
// articleSnippet: article.truncated_teaser,
// canonicalUrl: "",
// numberOfComments: article.comment_count,
// id: article.pk,
// publishDate: article.publish_date,
// featuredCaption: watch("featured_caption"),
// slug: article.slug,
// punchWord: watch("punch_word"),
// image: {
//   image: image?.cdn_url ?? PLACEHOLDER_AVATAR,
// },
// headline: watch("headline"),
// imageCaption: watch("image_caption"),
type GeneratedArticleGraphql = NonNullable<
    NonNullable<GetFullArticleQuery>["article"]
>;

export type ArticleGraphql = BaseArticle & {
    authors: {
        edges: GraphqlAuthor[];
    };
    isBrief?: boolean;
    publishDate: string | undefined;
    featuredCaption: string;
    punchWord: string | undefined;
    image: {
        image: string;
        altText?: string;
    };
    id: PK;
    pk: PK;
    articleSnippet?: string;
    body: string[];
    canonicalUrl: string;
    comments?: {
        edges: CommentGraphqlNode[];
    };
    editorsNote?: string;
    numberOfComments: number;
    imageCaption?: string;
    relatedListings?: Array<{
        organization?: {
            name: string;
            slug: string;
            corporatePrincipalName: string;
        } | null;
        categories: {
            edges: Array<{
                node?: {
                    title: string;
                } | null;
            } | null>;
        };
    } | null> | null;
    relatedMovesSnippet?: Array<{
        slug: string;
        headline: string;
        deckhead: string;
        publishDate?: string | null;
        image?: {
            image?: string;
        };
    } | null> | null;
    relatedJobs?:  RelatedJobsREST[] | null;
    peopleTags: GeneratedArticleGraphql["peopleTags"];
    otherTags: GeneratedArticleGraphql["otherTags"];
    sections: GeneratedArticleGraphql["sections"];
    editors: GeneratedArticleGraphql["editors"];
};

export type ArticleStubEdgesGraphql = {
    edges: ArticleStubNodeGraphql[];
};
export type ArticleStubNodeGraphql = {
    node: ArticleStubTypeGraphql;
};

export type ArticleStubTypeGraphql = {
    publishDate?: string;
    slug: string;
    image?: {
        image?: string | null;
    } | null;
    imageCaption?: string;
    headline: string;
    deckhead: string;
};

export type ArticleChildren = string[];
