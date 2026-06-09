export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-bg">
      <main className="pb-[calc(64px+26px)]">{children}</main>
      {/* TabBar は INFRA-03 で実装 */}
    </div>
  );
}
