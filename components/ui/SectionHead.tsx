// セクションタイトル + "もっと見る" リンク。

import Link from "next/link";
import { ChevronRight } from "lucide-react";

type SectionHeadProps = {
  title: string;
  // "もっと見る" のラベルテキスト
  action?: string;
  // action を押したときの遷移先 URL
  href?: string;
};

export default function SectionHead({ title, action, href }: SectionHeadProps) {
  return (
    <div className="flex items-center justify-between px-[2px] mb-3">
      <h2 className="m-0 text-[19px] font-[750] text-text tracking-[0.2px]">{title}</h2>
      {action && href && (
        <Link
          href={href}
          className="flex items-center gap-[2px] text-muted text-[14px] font-semibold no-underline"
        >
          {action}
          <ChevronRight size={15} color="var(--color-muted)" />
        </Link>
      )}
    </div>
  );
}