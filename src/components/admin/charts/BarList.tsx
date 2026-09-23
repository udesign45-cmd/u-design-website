export type BarListItem = { label: string; value: number; color: string };

/**
 * Horizontal bar list: label and value are always rendered as text (the
 * contrast "relief" for palette slots below 3:1 on white), color is
 * secondary reinforcement, never the only signal.
 */
export function BarList({ items, unit = "leads" }: { items: BarListItem[]; unit?: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));

  if (items.length === 0) {
    return <p className="text-sm text-ink-muted">No data yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-3">
          <p className="w-32 shrink-0 truncate text-sm text-ink" title={item.label}>
            {item.label}
          </p>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-gray">
            <div
              className="h-full rounded-full"
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color }}
            />
          </div>
          <p className="w-16 shrink-0 text-right text-sm tabular-nums text-ink-muted">
            {item.value} {item.value === 1 ? unit.replace(/s$/, "") : unit}
          </p>
        </li>
      ))}
    </ul>
  );
}
