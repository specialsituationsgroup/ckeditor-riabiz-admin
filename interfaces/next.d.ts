import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactNode } from "react";
import NextAuth from "next-auth";
import JWT from "next-auth/jwt";
import { Session } from "next-auth";

export interface SessionUser {
    name: string;
    email: string;
    is_staff: boolean;
    is_superuser: boolean;
    groups: GroupName[];
}
export interface CustomSession extends Session {
    accessToken: string;
    is_staff: boolean;
    is_superuser: boolean;
    user: SessionUser;
}

interface RESTAuthUser {
    id: string; // this is a lie, DRF does not give us an 'id' but it is require by nextauth and never used
    pk: number;
    groups: RESTAuthGroup[];
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_superuser: boolean;
}

interface RESTAuthGroup {
    id: number;
    name: string;
}

interface RESTAuthResponse {
    expiry: string;
    token: string; // Django Knox auth token
    user: RESTAuthUser;
}
declare module "next" {
    type NextPageWithLayout = NextPage & {
        getLayout?: (page: ReactNode) => ReactNode;
        auth?: boolean;
    };
}
declare module "next/app" {
    type AppPropsWithLayout = AppProps & {
        Component: NextPageWithLayout;
    };
}
declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        // django knox auth token
        accessToken: string;
        is_staff: boolean;
        is_superuser: boolean;
    }
    interface User {
        // django knox auth token
        token: string;
        first_name: string;
        last_name: string;
        is_staff: boolean;
        is_superuser: boolean;
        groups: RESTAuthGroup[];
    }
}

type GroupName = string;
declare module "next-auth/jwt" {
    /**
     * Returned by `getToken`
     */
    interface JWT {
        // django knox auth token
        user: {
            name: string;
            email: string;
            is_staff: boolean;
            is_superuser: boolean;
            groups: GroupName[];
        };
        accessToken: string;
    }
}
