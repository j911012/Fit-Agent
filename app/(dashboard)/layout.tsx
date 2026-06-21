import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import TabBar from "@/components/layout/TabBar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  return (
    <div className="relative min-h-screen bg-bg">
      {/* 開発用ログアウトボタン — PROF-01 実装後に削除 */}
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/auth/login" });
        }}
        className="fixed top-3 right-3 z-50"
      >
        <button
          type="submit"
          className="rounded-lg bg-card-solid border border-border px-3 py-1.5 text-xs text-muted"
        >
          ログアウト
        </button>
      </form>

      {/* TabBar 分の高さ（コンテンツ ~52px + paddingBottom 26px ≒ 90px）を確保 */}
      <main className="pb-[90px]">{children}</main>
      <div className="fixed bottom-0 inset-x-0 z-40">
        <TabBar />
      </div>
    </div>
  );
}
