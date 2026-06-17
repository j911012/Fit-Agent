"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, Plus, Sparkles, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type RegularTab = {
  id: string;
  href: string;
  icon: LucideIcon;
  label: string;
  center?: false;
};

type CenterTab = {
  id: string;
  href: string;
  icon: LucideIcon;
  label: string;
  center: true;
};

type Tab = RegularTab | CenterTab;

const tabs: Tab[] = [
  { id: "home", href: "/dashboard", icon: Home, label: "ホーム" },
  { id: "workouts", href: "/workouts", icon: Dumbbell, label: "記録" },
  { id: "new", href: "/workouts/new", icon: Plus, label: "", center: true },
  { id: "ai", href: "/ai", icon: Sparkles, label: "AIコーチ" },
  { id: "profile", href: "/profile", icon: User, label: "マイ" },
];

export default function TabBar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    // /workouts/new は独立ページのため /workouts のアクティブに含めない
    if (href === "/workouts") return pathname === "/workouts";
    return pathname.startsWith(href);
  };

  return (
    <div className="border-t border-border pt-[10px] pb-[26px] bg-[rgba(11,12,17,0.92)] backdrop-blur-[16px]">
      <div className="flex items-center justify-around px-[14px]">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;

          // 中央の + ボタン: グラデーション背景・浮き上がり
          if (tab.center) {
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className="flex items-center justify-center w-14 h-14 rounded-[20px] no-underline"
                style={{
                  background: "var(--grad)",
                  boxShadow: "0 8px 22px rgba(255,61,119,0.45)",
                  transform: "translateY(-6px)",
                }}
              >
                <TabIcon size={28} color="#0B0C11" strokeWidth={2.6} />
              </Link>
            );
          }

          const active = isActive(tab.href);
          const iconColor = active ? "var(--color-text)" : "var(--color-faint)";

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className="flex flex-col items-center gap-1 w-[60px] no-underline"
            >
              <TabIcon size={25} color={iconColor} strokeWidth={active ? 2.2 : 1.9} />
              <span className="text-[10.5px] font-semibold" style={{ color: iconColor }}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
