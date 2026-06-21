"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [rootError, setRootError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setRootError(null);

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      setRootError("メールアドレスまたはパスワードが正しくありません");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <Card className="w-full max-w-sm">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text">ログイン</h1>
        <p className="mt-1 text-sm text-muted">FitAgent にようこそ</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">メールアドレス</label>
          <Input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">パスワード</label>
          <Input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
          />
        </div>

        {rootError && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{rootError}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 h-11 w-full rounded-xl bg-gradient-to-r from-g1 via-g2 to-g3 text-sm font-semibold text-white hover:opacity-90"
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "ログイン"}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-muted">
        アカウントをお持ちでない方は{" "}
        <Link href="/auth/signup" className="text-text underline underline-offset-2">
          新規登録
        </Link>
      </p>
    </Card>
  );
}
