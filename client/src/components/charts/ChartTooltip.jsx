/**
 * Shared tooltip panel for charts. `rows` is [{ label, value, color? }];
 * text stays in ink colors, a swatch carries the series identity.
 */
export default function ChartTooltip({ title, rows }) {
  return (
    <div className="min-w-40 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
      {title && <p className="mb-1 font-medium text-slate-900">{title}</p>}
      <dl className="space-y-1">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <dt className="flex items-center gap-2 text-slate-500">
              {row.color && (
                <span className="size-2.5 rounded-sm" style={{ backgroundColor: row.color }} />
              )}
              {row.label}
            </dt>
            <dd className="font-medium tabular-nums text-slate-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
