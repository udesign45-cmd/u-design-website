export type TrendPoint = { date: string; count: number };

const WIDTH = 720;
const HEIGHT = 220;
const PAD_LEFT = 32;
const PAD_RIGHT = 8;
const PAD_TOP = 16;
const PAD_BOTTOM = 24;

function formatShort(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Line + area over time, brand green. Server-rendered SVG; hover reads via native <title>. */
export function TrendChart({ points }: { points: TrendPoint[] }) {
  if (points.length === 0) return <p className="text-sm text-ink-muted">No data yet.</p>;

  const max = Math.max(1, ...points.map((p) => p.count));
  const innerW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const xStep = points.length > 1 ? innerW / (points.length - 1) : 0;
  const x = (i: number) => PAD_LEFT + i * xStep;
  const y = (v: number) => PAD_TOP + innerH - (v / max) * innerH;

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.count)}`).join(" ");
  const areaPath = `${linePath} L${x(points.length - 1)},${PAD_TOP + innerH} L${x(0)},${PAD_TOP + innerH} Z`;

  const midValue = Math.round(max / 2);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Leads per day, ${points[0]?.date} through ${points[points.length - 1]?.date}, peak ${max}`}
    >
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00d84a" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#00d84a" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Gridlines */}
      {[0, midValue, max].map((v) => (
        <g key={v}>
          <line
            x1={PAD_LEFT}
            x2={WIDTH - PAD_RIGHT}
            y1={y(v)}
            y2={y(v)}
            stroke="#e1e0d9"
            strokeWidth={1}
          />
          <text x={0} y={y(v) + 3} fontSize={10} fill="#898781">
            {v}
          </text>
        </g>
      ))}

      <path d={areaPath} fill="url(#trendFill)" />
      <path d={linePath} fill="none" stroke="#008a2e" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

      {points.map((p, i) => (
        <circle key={p.date} cx={x(i)} cy={y(p.count)} r={p.count > 0 ? 3 : 0} fill="#008a2e">
          <title>
            {formatShort(p.date)}: {p.count} lead{p.count === 1 ? "" : "s"}
          </title>
        </circle>
      ))}

      <text x={PAD_LEFT} y={HEIGHT - 4} fontSize={10} fill="#898781">
        {formatShort(points[0]!.date)}
      </text>
      <text x={WIDTH - PAD_RIGHT} y={HEIGHT - 4} fontSize={10} fill="#898781" textAnchor="end">
        {formatShort(points[points.length - 1]!.date)}
      </text>
    </svg>
  );
}
