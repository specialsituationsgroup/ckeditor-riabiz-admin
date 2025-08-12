import { RESTAuthResponse } from "@/interfaces/next";
import base64 from "base-64";

// API Configuration - Replace these with your own API endpoints
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/";
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:8000/graphql";
const API_KEY_FOR_INTERNAL_USE = process.env.API_KEY || "";

// Base API paths
const API = `${API_ENDPOINT}api/v1`;
const API_NEWSLETTER = `${API}/emails/newsletter/`;
const API_CREATE_PREVIEW = `${API}/emails/create_preview/`;
const API_ARTICLES_ADMIN = `${API}/articles/admin`;
const API_SEARCH_ARTICLES = `${API}/articles/search/`;
const API_FETCH_AUTHORS = `${API}/authors/`;
const API_AUTHORS = `${API}/authors/`;
const API_TEAM_MEMBERS = `${API}/team-members`;
const API_PAGES = `${API}/pages/`;
const API_TAGS = `${API}/tags/`;
const API_TAGS_ADMIN = `${API}/tags/admin/`;
const API_COMMENTS = `${API}/comments/`;
const API_FETCH_ARTICLES = `${API}/articles/`;
const API_FETCH_SECTIONS = `${API}/sections/`;
const API_FETCH_TAGS_WITH_COUNT = `${API}/tags/with_count/`;

const API_INIT_PASSWORD_RESET = `${API_ENDPOINT}rest-auth/password/reset/`;
const API_CONFIRM_PASSWORD_RESET = `${API_ENDPOINT}accounts-app/reset-password/`;

interface StripePaymentIntentResponse {
    clientSecret: string;
    id: string;
}

// Generic fetcher function for API calls
const genericFetcher = async (
    url: string,
    options?: RequestInit
): Promise<any> => {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }
    return response.json();
};

// Authenticated fetcher for protected endpoints
const authFetcher = async (
    url: string,
    options?: RequestInit
): Promise<any> => {
    return genericFetcher(url, options);
};

// GraphQL fetcher
const graphQLFetcher = async (query: string, variables?: any) => {
    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    if (!response.ok) {
        throw new Error(`GraphQL call failed: ${response.statusText}`);
    }

    return response.json();
};

export {
    API_ENDPOINT,
    GRAPHQL_ENDPOINT,
    API_KEY_FOR_INTERNAL_USE,
    API,
    API_NEWSLETTER,
    API_CREATE_PREVIEW,
    API_ARTICLES_ADMIN,
    API_SEARCH_ARTICLES,
    API_FETCH_AUTHORS,
    API_AUTHORS,
    API_TEAM_MEMBERS,
    API_PAGES,
    API_TAGS,
    API_TAGS_ADMIN,
    API_COMMENTS,
    API_FETCH_ARTICLES,
    API_FETCH_SECTIONS,
    API_FETCH_TAGS_WITH_COUNT,
    API_INIT_PASSWORD_RESET,
    API_CONFIRM_PASSWORD_RESET,
    genericFetcher,
    authFetcher,
    graphQLFetcher,
};