// 小型棒グラフ — DASH-01 週間カレンダーのボリューム表示などに使用。

type BarItem = {
  // ボリューム値
  v: number;
  // ラベル（曜日など）
  l: string;
  // ハイライト（今日・最高値など）
  hi?: boolean;
};

type BarsProps = {
  data: BarItem[];
  h?: number;
  // max を省略すると data の最大値を使用
  max?: number;
};

export default function Bars({ data, h = 56, max }: BarsProps) {
  const m = max ?? Math.max(...data.map((d) => d.v));

  return (
    <div
      className="flex items-end gap-2"
      style={{ height: h }}
    >
      {data.map((d, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col items-center gap-[6px] h-full justify-end"
        >
          <div
            className="w-full rounded-[6px]"
            style={{
              height: `${(d.v / m) * 100}%`,
              minHeight: 4,
              // ハイライトバーはグラデーション、通常は半透明白
              background: d.hi ? "var(--grad)" : "rgba(255,255,255,0.12)",
            }}
          />
          <span
            className="text-[11px] font-semibold"
            style={{ color: d.hi ? "var(--color-text)" : "var(--color-faint)" }}
          >
            {d.l}
          </span>
        </div>
      ))}
    </div>
  );
}