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

import { API_ENDPOINT, authFetcher } from "@/utils/api";
import { format } from "date-fns";
import { GetServerSideProps } from "next/types";
import { getToken } from "next-auth/jwt";
import { ArticleREST } from "@/interfaces/article";

export default function NoOp() {}

NoOp.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const token = await getToken({ req: context.req });
    const authToken = token!.accessToken; // middleware checks the existence of an authorized user
    if (token == null || token.user == null) {
        return {
            notFound: true,
        };
    }
    const dateFmt = format(new Date(), "MMM Mo ppp");

    const data: ArticleREST = await authFetcher(
        `${API_ENDPOINT}api/v1/articles/`,
        {
            method: "POST",
            headers: {
                Authorization: `Token ${authToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                headline: `Draft by ${
                    token.user.name ? token.user.name : token.user.email
                } on ${dateFmt}`,
            }),
        }
    );
    let articleLinkUrl = `/admin/a/${data.pk}`;
    return {
        redirect: {
            destination: articleLinkUrl,
            permanent: false,
        },
    };
};
