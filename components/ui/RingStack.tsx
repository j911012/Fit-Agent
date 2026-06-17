// 同心円リング SVG — DASH-03 週間サマリーのトレ日数達成率に使用。

type Track = {
  // 0〜1 の進捗値
  value: number;
  // グラデーション [開始色, 終了色]
  grad: [string, string];
};

type RingStackProps = {
  size?: number;
  tracks: Track[];
};

export default function RingStack({ size = 116, tracks }: RingStackProps) {
  const cx = size / 2;
  const gap = 4;
  const sw = 11;

  return (
    // -90度回転でリングを 12時方向から始まるように調整
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: "rotate(-90deg)" }}
    >
      <defs>
        {tracks.map((t, i) => (
          <linearGradient key={i} id={`rg${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={t.grad[0]} />
            <stop offset="1" stopColor={t.grad[1]} />
          </linearGradient>
        ))}
      </defs>
      {tracks.map((t, i) => {
        const r = cx - sw / 2 - i * (sw + gap);
        const circumference = 2 * Math.PI * r;
        const progress = Math.min(t.value, 1);
        return (
          <g key={i}>
            {/* トラック背景 */}
            <circle
              cx={cx}
              cy={cx}
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={sw}
            />
            {/* 進捗リング */}
            <circle
              cx={cx}
              cy={cx}
              r={r}
              fill="none"
              stroke={`url(#rg${i})`}
              strokeWidth={sw}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
            />
          </g>
        );
      })}
    </svg>
  );
}