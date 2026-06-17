"use client";

import { cn } from "@/lib/utils";

type ChipProps = {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
};

export default function Chip({
  children,
  active = false,
  onClick,
  icon,
  className,
}: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-[6px] px-[13px] py-[8px] rounded-full border-none cursor-pointer whitespace-nowrap text-[13.5px] transition-colors",
        className
      )}
      style={{
        // グラデーション背景は CSS 変数経由（Tailwind bg-* では linear-gradient が扱えないため）
        background: active ? "var(--grad)" : "rgba(255,255,255,0.07)",
        color: active ? "#0B0C11" : "var(--color-muted)",
        fontWeight: active ? 700 : 600,
        boxShadow: active ? "0 4px 14px rgba(255,61,119,0.3)" : "none",
      }}
    >
      {icon}
      {children}
    </button>
  );
}