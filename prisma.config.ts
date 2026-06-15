import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// CLAUDE.md の規約により環境変数は .env.local に記載する
config({ path: ".env.local", quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
