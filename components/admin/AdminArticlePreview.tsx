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
