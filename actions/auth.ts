"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";

type SignupResult =
  | { success: true }
  | { error: Partial<Record<keyof SignupInput | "root", string[]>> };

export async function signup(data: SignupInput): Promise<SignupResult> {
  const result = signupSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { name, email, password } = result.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: { email: ["このメールアドレスはすでに使用されています"] } };
  }

  const hashedPassword = await hash(password, 12);
  await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return { success: true };
}
