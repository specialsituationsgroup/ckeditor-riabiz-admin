// The types in this file are intended to capture the following output
// {
// "count": 960,
//     "next": null,
//     "previous": null,
//     "page_links": [
//         {
//             "query_params": {
//                 "ordering": [
//                     "-updated"
//                 ],
//                 "page_size": [
//                     "20"
//                 ],
//                 "search": [
//                     "financial"
//                 ]
//             },
//             "number": 1,
//             "is_active": true,
//             "is_break": false
//         },
//         {
//             "query_params": {
//                 "ordering": [
//                     "-updated"
//                 ],
//                 "page": [
//                     "2"
//                 ],
//                 "page_size": [
//                     "20"
//                 ],
//                 "search": [
//                     "financial"
//                 ]
//             },
//             "number": 2,
//             "is_active": false,
//             "is_break": false
//         },
//         {
//             "query_params": {
//                 "ordering": [
//                     "-updated"
//                 ],
//                 "page": [
//                     "3"
//                 ],
//                 "page_size": [
//                     "20"
//                 ],
//                 "search": [
//                     "financial"
//                 ]
//             },
//             "number": 3,
//             "is_active": false,
//             "is_break": false
//         },
//         {
//             "query_params": null,
//             "number": null,
//             "is_active": false,
//             "is_break": true
//         },
//         {
//             "query_params": {
//                 "ordering": [
//                     "-updated"
//                 ],
//                 "page": [
//                     "48"
//                 ],
//                 "page_size": [
//                     "20"
//                 ],
//                 "search": [
//                     "financial"
//                 ]
//             },
//             "number": 48,
//             "is_active": false,
//             "is_break": false
//         }
//     ],
//     "query_params": {
//         "search": "financial",
//         "ordering": "-updated",
//         "page_size": "20"
//     },
type PaginateParamNames = "search" | "ordering" | "page_size" | "page";
interface paginateParams {
    page: string;
    page_size: string;
}
interface searchParams extends paginateParams {
    search: string;
}
export type PaginateBase = {
    count: number;
    next: null;
    previous: null;
    next_page: number | null;
    previous_page: number | null;
};
interface PaginateQueryParams {
    page_size: string[];
    page: string[];
}
export interface QuerySearchParams extends PaginateQueryParams {
    search: string[];
}
export interface PageLink<Query extends PaginateQueryParams> {
    query_params: Query;
    number: number;
    is_active: boolean;
    is_break: boolean;
}
export type PaginatePageLinks = PageLink<PaginateQueryParams>;
export type SearchPageLinks = PageLink<QuerySearchParams>;
export interface SearchPaginateResults extends PaginateBase {
    query_params: searchParams;
    page_links: SearchPageLinks[];
}
export interface PaginateResults extends PaginateBase {
    query_params: paginateParams;
    page_links: PaginatePageLinks[];
}
