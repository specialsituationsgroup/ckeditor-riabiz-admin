// Common Interfaces
import { GetJobListingsQuery, GetWhitepapersQuery } from "../graphql/types";

export type PK = number;

export interface ImageREST {
    uuid: string;
    cdn_url: string;
}

export interface LocationREST {
    country: string;
    state_province: string;
}

interface OrganizationType {
    id: string;
    name: string;
    uuid?: string; // Если uuid нужен
}

// Job Listing Types
export interface JobListingREST {
    id: number;
    title: string;
    job_reference: string | null;
    use_summary: boolean;
    summary: string | null;
    description: string | null;
    logo: string | null;
    display_logo: boolean;
    is_external: boolean;
    receipt_url: string;
    submitted_organization_name: string | null;
    external_job_link: string | null;
    apply_url: string | null;
    use_riabiz_apply_form: boolean;
    posting_date: string; // ISO 8601 date string
    expiration_date: string; // ISO 8601 date string
    stripe_transaction_id: string | null;
    application_recipient_emails: string | null;
    locations: string | null;
    locations_description: string | null;
    salary_description: string | null;
    organization: OrganizationType | null;
    status: "Pending" | "Approved" | "Rejected";
    approved_at: string | null; // ISO 8601 datetime string
    rejected_at: string | null; // ISO 8601 datetime string
    jobtype: "Full-time" | "Part-time" | "Contract" | "Internship" | null;
    slug: string;
    applicant_count: number;
    created_at: string | null; // ISO 8601 datetime string
}

export interface FeaturedJobListingREST {
    id: number;
    title: string;
    slug: string;
    created_at: string;
    logo: string | null;
    organization_img: string | null;
    organization_name: string | null;
    organization_slug: string | null;
}

// Pagination Interfaces
export interface PaginateLink {
    query_params: {
        page: string[];
        page_size: string[];
    };
    number: number | null;
    is_active: boolean;
    is_break: boolean;
}

export interface ListJobListings200Response {
    count: number;
    next: string | null;
    previous: string | null;
    page_links: PaginateLink[];
    query_params: {
        page: string;
        page_size: string;
    };
    results: JobListingREST[];
    next_page: number | null;
    previous_page: number | null;
}

// Pagination and Query Props
export type PaginateBase = {
    count: number;
    next?: string | null;
    previous?: string | null;
};

export interface usePaginateProps {
    page: string;
    page_size: string;
}

export interface JobListingProps extends usePaginateProps {
    authToken: string;
}

// Utility Functions
export type FetchJobListingsParams = {
    authToken: string;
    page: string;
    page_size: string;
};
export type JobBoardSnippetGraphQL = NonNullable<
    NonNullable<GetJobListingsQuery>["job-board"]
>["edges"][number]["node"];

