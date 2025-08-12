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
