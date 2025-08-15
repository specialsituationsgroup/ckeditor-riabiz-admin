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

import { PK, RESTArticleImage } from "@/interfaces/article";
import { DateString, Timely, Ordered } from "@/interfaces/customEmail";
import { GetWhitepapersQuery } from "graphql/types";

export type RESTWhitePaperListQueryResult = {
    results: RESTWhitePaper[];
    count: number;
    next: string | null;
    previous: string | null;
};

export type RESTWhitePaper = {
    readonly pk: PK;
    title: string;
    description: string;
    organization: RESTOrganization;
    publish_date: string;
    author_name: string;
    image_caption: string;
    whitepaper_image: string;
    upload_document?: string;
    clickthrough_url?: string;
};

export type RESTOrganization = Timely &
    Ordered & {
        readonly pk: PK;
        name: string;
        slug?: string;
        logo?: RESTArticleImage | null;
        readonly created?: string;
        readonly updated?: string;
        billing_stripe_user: string;
    };
export type WhitepaperSnippetGraphQL = NonNullable<
    NonNullable<GetWhitepapersQuery>["whitepapers"]
>["edges"][number]["node"];
