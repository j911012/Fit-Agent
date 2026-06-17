// Server Component — 表示のみ、インタラクションなし。

import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  // glow: AI提案カードなど視覚的に強調したい場合に使用
  glow?: boolean;
};

export default function Card({ children, className, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-card-solid border border-border rounded-[24px] p-[18px] relative",
        glow
          ? "shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
          : "shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
        className
      )}
    >
      {children}
    </div>
  );
}
