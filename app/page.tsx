import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-black text-text mb-4">FitAgent</h1>
      <p className="text-muted text-lg mb-8">AIパーソナルトレーニング SaaS — Coming soon</p>
      <div className="flex gap-4">
        <Link
          href="/auth/login"
          className="px-6 py-3 rounded-full text-bg font-bold text-sm"
          style={{ background: "var(--grad)" }}
        >
          ログイン
        </Link>
        <Link
          href="/auth/signup"
          className="px-6 py-3 rounded-full text-text font-bold text-sm border border-border"
        >
          新規登録
        </Link>
      </div>
    </div>
  );
}
