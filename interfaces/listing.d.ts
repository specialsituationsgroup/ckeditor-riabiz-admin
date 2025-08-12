import type { CategoryREST, OrganizationREST } from "@/interfaces/article";
import type { SearchPaginateResults, PaginateBase } from "@/interfaces/rest";
import { Listing } from "generated/riabiz-django-api/api";

export interface SearchListings200Response extends SearchPaginateResults {
    results?: Array<DirectoryListingREST>;
}
export interface ListListings200Response extends PaginateBase {
    results?: Array<DirectoryListingREST>;
}
export interface ListListingCategorys200Response extends PaginateBase {
    results?: Array<CategoryREST>;
}
export interface DirectoryListingREST extends Listing {
    published: NonNullable<Listing["published"]>;
}
