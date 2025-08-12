import { PaginateResults } from "./rest";
type PageREST = {
    id: number;
    title: string;
    slug_reference: string;
    css_classes: string;
    body: string;
};
export type ListPage200Response = PaginateResults & {
    results?: PageREST[];
};
