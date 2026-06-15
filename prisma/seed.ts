import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../lib/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

// プリセット種目マスタ（部位: 胸/背中/脚/肩/腕/体幹）
// 参照: ../../../WF/data.jsx の exerciseLibrary
const presetExercises: { name: string; muscleGroup: string }[] = [
  // 胸
  { name: "ベンチプレス", muscleGroup: "胸" },
  { name: "インクラインダンベルプレス", muscleGroup: "胸" },
  { name: "ケーブルフライ", muscleGroup: "胸" },
  { name: "ディップス", muscleGroup: "胸" },
  // 背中
  { name: "デッドリフト", muscleGroup: "背中" },
  { name: "ラットプルダウン", muscleGroup: "背中" },
  { name: "バーベルロウ", muscleGroup: "背中" },
  { name: "チンニング", muscleGroup: "背中" },
  // 脚
  { name: "スクワット", muscleGroup: "脚" },
  { name: "レッグプレス", muscleGroup: "脚" },
  { name: "レッグカール", muscleGroup: "脚" },
  { name: "カーフレイズ", muscleGroup: "脚" },
  // 肩
  { name: "ショルダープレス", muscleGroup: "肩" },
  { name: "サイドレイズ", muscleGroup: "肩" },
  { name: "フェイスプル", muscleGroup: "肩" },
  // 腕
  { name: "バーベルカール", muscleGroup: "腕" },
  { name: "ハンマーカール", muscleGroup: "腕" },
  { name: "トライセプスプレスダウン", muscleGroup: "腕" },
  // 体幹
  { name: "プランク", muscleGroup: "体幹" },
  { name: "アブローラー", muscleGroup: "体幹" },
  { name: "クランチ", muscleGroup: "体幹" },
];

async function main() {
  // 再実行時の重複を防ぐため、プリセット種目（isCustom:false）を入れ替える
  await prisma.exercise.deleteMany({ where: { isCustom: false } });

  await prisma.exercise.createMany({
    data: presetExercises.map((exercise) => ({ ...exercise, isCustom: false })),
  });

  console.log(`Seeded ${presetExercises.length} preset exercises.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
