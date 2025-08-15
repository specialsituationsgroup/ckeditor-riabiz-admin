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

import { ArticleREST } from "@/interfaces/article";
import { classNames } from "@/utils/tailwind";
import Image from "next/image";

type PreviewProps = {
  article: ArticleREST;
};

export const ArticlePreview = ({ article }: PreviewProps) => {
  const baseColClass = "px-3 py-4 text-sm";

  return (
    <tr key={article.pk}>
      <td className={classNames(" pr-3", baseColClass)}>
        <div className="w-[100px] pr-4">
          {article.image ? (
            <a>
              <Image
                width={100}
                height={100}
                src={article.image.cdn_url}
                alt={article.image.altText}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </a>
          ) : (
            ""
          )}
        </div>
      </td>
      <td className={classNames(" pr-3", baseColClass)}>
        <div className="basis-5/6 line-clamp-3">{article.headline}</div>
      </td>
    </tr>
  );
};
