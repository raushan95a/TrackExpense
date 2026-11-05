import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CHART_THEME, SERIES_COLORS } from '../../constants/charts.js';
import { TRANSACTION_TYPES, TYPE_LABELS } from '../../constants/transactions.js';
import { formatMonthLabel, formatShortMonth } from '../../utils/date.js';
import { formatCompactMoney, formatMoney } from '../../utils/money.js';
import ChartTooltip from './ChartTooltip.jsx';

const SERIES = [TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.EXPENSE];
const AXIS_TICK = { fill: CHART_THEME.axisText, fontSize: 12 };
const BAR_RADIUS = [4, 4, 0, 0];

function MonthTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) return null;
  const month = payload[0].payload;
  return (
    <ChartTooltip
      title={formatMonthLabel(month.month)}
      rows={[
        ...SERIES.map((type) => ({
          label: TYPE_LABELS[type],
          value: formatMoney(month[type], currency),
          color: SERIES_COLORS[type],
        })),
        { label: 'Balance', value: formatMoney(month.balance, currency) },
      ]}
    />
  );
}

function Legend() {
  return (
    <ul className="mb-3 flex gap-4 text-sm text-slate-600">
      {SERIES.map((type) => (
        <li key={type} className="flex items-center gap-2">
          <span className="size-2.5 rounded-sm" style={{ backgroundColor: SERIES_COLORS[type] }} />
          {TYPE_LABELS[type]}
        </li>
      ))}
    </ul>
  );
}

/** Screen-reader table with the same figures as the chart. */
function DataTable({ months, currency }) {
  return (
    <table className="sr-only">
      <caption>Income and expense by month</caption>
      <thead>
        <tr>
          <th scope="col">Month</th>
          {SERIES.map((type) => (
            <th key={type} scope="col">
              {TYPE_LABELS[type]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {months.map((m) => (
          <tr key={m.month}>
            <th scope="row">{formatMonthLabel(m.month)}</th>
            {SERIES.map((type) => (
              <td key={type}>{formatMoney(m[type], currency)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Income vs expense per month for a year (grouped bars, one shared axis). */
export default function MonthlyBarChart({ months, currency }) {
  return (
    <div>
      <Legend />
      <div className="h-64" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={months} barGap={2} barCategoryGap="28%" margin={{ left: 0, right: 4 }}>
            <CartesianGrid vertical={false} stroke={CHART_THEME.grid} />
            <XAxis
              dataKey="month"
              tickFormatter={formatShortMonth}
              tick={AXIS_TICK}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={8}
            />
            <YAxis
              tickFormatter={(value) => formatCompactMoney(value, currency)}
              tick={AXIS_TICK}
              axisLine={false}
              tickLine={false}
              width={64}
            />
            <Tooltip
              content={<MonthTooltip currency={currency} />}
              cursor={{ fill: CHART_THEME.cursor }}
            />
            {SERIES.map((type) => (
              <Bar
                key={type}
                dataKey={type}
                name={TYPE_LABELS[type]}
                fill={SERIES_COLORS[type]}
                radius={BAR_RADIUS}
                maxBarSize={16}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <DataTable months={months} currency={currency} />
    </div>
  );
}
