// 小型折れ線グラフ SVG — DASH-04 停滞検知カードや DASH-05 成長カードに使用。

type SparklineProps = {
  data: number[];
  w?: number;
  h?: number;
  // デフォルトはライムグリーン（CSS 変数 --color-lime）
  color?: string;
  fill?: boolean;
  dot?: boolean;
};

export default function Sparkline({
  data,
  w = 300,
  h = 80,
  color = "var(--color-lime)",
  fill = true,
  dot = true,
}: SparklineProps) {
  if (data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  // 全値が同一の場合のゼロ除算を防ぐ
  const range = max - min || 1;
  const pad = 6;

  const X = (i: number) =>
    data.length > 1 ? pad + (i / (data.length - 1)) * (w - pad * 2) : w / 2;
  const Y = (v: number) => pad + (1 - (v - min) / range) * (h - pad * 2);

  const pts = data.map((v, i) => [X(i), Y(v)] as [number, number]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${X(data.length - 1).toFixed(1)} ${h - pad} L${pad} ${h - pad} Z`;

  // グラデーション ID をデータの内容から生成（SSR で複数インスタンスがある場合の衝突リスクあり、MVP では許容）
  const gradId = `sl${Math.round(w + h + (data[0] ?? 0))}`;
  const lastPt = pts[pts.length - 1];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block", width: "100%" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.28" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gradId})`} />}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {dot && lastPt && (
        <circle
          cx={lastPt[0]}
          cy={lastPt[1]}
          r="3.5"
          fill={color}
          stroke="var(--color-bg)"
          strokeWidth="2"
        />
      )}
    </svg>
  );
}
