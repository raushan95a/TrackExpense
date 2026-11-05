import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_THEME, MAX_PIE_SLICES, OTHER_COLOR } from '../../constants/charts.js';
import { formatMoney } from '../../utils/money.js';
import ChartTooltip from './ChartTooltip.jsx';

const OTHER_KEY = '__other__';

/** Keeps the largest slices and folds the tail into one neutral "Other" slice. */
const foldSlices = (categories, total) => {
  if (categories.length <= MAX_PIE_SLICES) return categories;
  const head = categories.slice(0, MAX_PIE_SLICES - 1);
  const tail = categories.slice(MAX_PIE_SLICES - 1);
  const tailTotal = tail.reduce((sum, c) => sum + c.total, 0);
  return [
    ...head,
    {
      categoryId: OTHER_KEY,
      name: `Other (${tail.length})`,
      icon: '',
      color: OTHER_COLOR,
      total: tailTotal,
      percentage: Math.round((tailTotal / total) * 1000) / 10,
    },
  ];
};

function SliceTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) return null;
  const slice = payload[0].payload;
  return (
    <ChartTooltip
      title={slice.name}
      rows={[
        { label: 'Spent', value: formatMoney(slice.total, currency), color: slice.color },
        { label: 'Share', value: `${slice.percentage}%` },
      ]}
    />
  );
}

/**
 * Spending split by category: a donut for the at-a-glance shape plus a ranked
 * list (name, bar, amount, share) so values never rely on color alone.
 */
export default function CategoryPieChart({ categories, total, currency }) {
  const slices = foldSlices(categories, total);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative mx-auto size-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="total"
              nameKey="name"
              innerRadius="62%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              stroke={CHART_THEME.surface}
              strokeWidth={2}
              isAnimationActive={false}
            >
              {slices.map((slice) => (
                <Cell key={slice.categoryId} fill={slice.color} />
              ))}
            </Pie>
            <Tooltip content={<SliceTooltip currency={currency} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-slate-500">Total spent</span>
          <span className="text-base font-semibold tabular-nums text-slate-900">
            {formatMoney(total, currency)}
          </span>
        </div>
      </div>

      <ul className="space-y-3" aria-label="Spending by category">
        {slices.map((slice) => (
          <li key={slice.categoryId}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: slice.color }}
                  aria-hidden="true"
                />
                <span className="truncate text-slate-700">
                  {slice.icon && `${slice.icon} `}
                  {slice.name}
                </span>
              </span>
              <span className="shrink-0 tabular-nums text-slate-900">
                {formatMoney(slice.total, currency)}
                <span className="ml-2 inline-block w-12 text-right text-slate-500">
                  {slice.percentage}%
                </span>
              </span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full"
                style={{ width: `${slice.percentage}%`, backgroundColor: slice.color }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
