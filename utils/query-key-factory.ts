import { Premium, Published } from "./listing-helpers";

const directoryListingKeys = {
    all: ["listings"] as const,
    lists: () => [...directoryListingKeys.all, "list"] as const,
    list: ({
        search,
        page,
        premium = "both",
        published = "both",
    }: {
        search?: string;
        page: string;
        premium?: Premium;
        published?: Published;
    }) =>
        [
            ...directoryListingKeys.lists(),
            { premium, published, page, search },
        ] as const,
    details: () => [...directoryListingKeys.all, "detail"] as const,
    detail: (id: number) => [...directoryListingKeys.details(), id] as const,
    detailSlug: (slug: string) =>
        [...directoryListingKeys.details(), slug] as const,
};
const articleKeys = {
    all: ["articles"] as const,
    lists: () => [...articleKeys.all, "list"] as const,
    list: (filters: string, page: string) =>
        [...articleKeys.lists(), { filters, page }] as const,
    details: () => [...articleKeys.all, "detail"] as const,
    detail: (id: number) => [...articleKeys.details(), id] as const,
};
const authorKeys = {
    all: ["author"] as const,
    lists: () => [...authorKeys.all, "list"] as const,
    list: (filters: string, page: string) =>
        [...authorKeys.lists(), { filters, page }] as const,
    details: (slugs: string[]) =>
        [...authorKeys.lists(), { slugs }, "detail"] as const,
    detail: (slug: string) => [...authorKeys.details([slug])] as const,
};
const tagKeys = {
    all: ["tag"] as const,
    lists: () => [...tagKeys.all, "list"] as const,
    list: (filters: string, page: string) =>
        [...tagKeys.lists(), { filters, page }] as const,
    details: (slugs: string[]) =>
        [...tagKeys.lists(), { slugs }, "detail"] as const,
    detail: (slug: string) => [...tagKeys.details([slug])] as const,
};
const commentKeys = {
    all: ["comments"] as const,
    lists: () => [...commentKeys.all, "list"] as const,
    list: (article: string, page: string) =>
        [...commentKeys.lists(), { article, page }] as const,
    details: () => [...commentKeys.all, "detail"] as const,
    detail: (id: number) => [...commentKeys.details(), id] as const,
};

export { directoryListingKeys, articleKeys, authorKeys, tagKeys, commentKeys };
