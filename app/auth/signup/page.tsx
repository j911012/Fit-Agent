"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { signup } from "@/actions/auth";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const [rootError, setRootError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    setRootError(null);
    const result = await signup(data);

    if ("error" in result) {
      if (result.error.name) setError("name", { message: result.error.name[0] });
      if (result.error.email) setError("email", { message: result.error.email[0] });
      if (result.error.password) setError("password", { message: result.error.password[0] });
      return;
    }

    // サインアップ成功後、自動ログイン
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      setRootError("ログインに失敗しました。もう一度お試しください。");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <Card className="w-full max-w-sm">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text">アカウント作成</h1>
        <p className="mt-1 text-sm text-muted">FitAgent でトレーニングを記録しよう</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">名前</label>
          <Input
            {...register("name")}
            placeholder="山田 太郎"
            autoComplete="name"
            error={errors.name?.message}
          />
        </div>

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
            placeholder="8文字以上"
            autoComplete="new-password"
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
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "アカウントを作成"}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-muted">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/auth/login" className="text-text underline underline-offset-2">
          ログイン
        </Link>
      </p>
    </Card>
  );
}
