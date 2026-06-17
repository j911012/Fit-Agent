import TabBar from "@/components/layout/TabBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-bg">
      {/* TabBar 分の高さ（コンテンツ ~52px + paddingBottom 26px ≒ 90px）を確保 */}
      <main className="pb-[90px]">{children}</main>
      <div className="fixed bottom-0 inset-x-0 z-40">
        <TabBar />
      </div>
    </div>
  );
}
