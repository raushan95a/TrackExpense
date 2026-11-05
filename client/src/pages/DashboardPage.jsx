import { Link } from 'react-router-dom';
import { analyticsApi } from '../api/analytics.api.js';
import { transactionsApi } from '../api/transactions.api.js';
import CategoryPieChart from '../components/charts/CategoryPieChart.jsx';
import MonthlyBarChart from '../components/charts/MonthlyBarChart.jsx';
import AsyncContent from '../components/common/AsyncContent.jsx';
import Card from '../components/common/Card.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Icon from '../components/common/Icon.jsx';
import LinkButton from '../components/common/LinkButton.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import MonthPicker from '../components/common/MonthPicker.jsx';
import RecentTransactions from '../components/dashboard/RecentTransactions.jsx';
import SummaryCards from '../components/dashboard/SummaryCards.jsx';
import { RECENT_TRANSACTIONS_LIMIT } from '../constants/charts.js';
import { ROUTES } from '../constants/routes.js';
import { TRANSACTION_TYPES } from '../constants/transactions.js';
import { useAuth } from '../hooks/useAuth.js';
import { useFetch } from '../hooks/useFetch.js';
import { useSelectedMonth } from '../hooks/useSelectedMonth.js';
import { formatMonthLabel, getMonthDateRange } from '../utils/date.js';

const viewAllClass = 'text-sm font-medium text-brand-600 hover:underline';

export default function DashboardPage() {
  const { user } = useAuth();
  const currency = user.currency;
  const [month, setMonth] = useSelectedMonth();
  const year = Number(month.slice(0, 4));
  const monthRange = getMonthDateRange(month);
  const monthTransactionsUrl = `${ROUTES.TRANSACTIONS}?${new URLSearchParams(monthRange)}`;

  const summary = useFetch(() => analyticsApi.summary(month), `summary:${month}`);
  const breakdown = useFetch(
    () => analyticsApi.byCategory(month, TRANSACTION_TYPES.EXPENSE),
    `by-category:${month}`,
  );
  const monthly = useFetch(() => analyticsApi.monthly(year), `monthly:${year}`);
  const recent = useFetch(
    () => transactionsApi.list({ ...monthRange, limit: RECENT_TRANSACTIONS_LIMIT }),
    `recent:${month}`,
  );

  const addButton = (
    <LinkButton to={ROUTES.NEW_TRANSACTION}>
      <Icon name="plus" className="size-4" />
      Add transaction
    </LinkButton>
  );

  return (
    <>
      <PageHeader
        title={`Hi, ${user.name.split(' ')[0]} 👋`}
        description={`Here is your money at a glance for ${formatMonthLabel(month)}.`}
        actions={
          <>
            <MonthPicker month={month} onChange={setMonth} />
            {addButton}
          </>
        }
      />

      <SummaryCards state={summary} currency={currency} />

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card
          title="Spending by category"
          description={formatMonthLabel(month)}
          className="lg:col-span-2"
        >
          <AsyncContent
            state={breakdown}
            isEmpty={(data) => data.categories.length === 0}
            empty={
              <EmptyState
                icon="tag"
                title="No expenses this month"
                description="Expenses you add will be grouped by category here."
              />
            }
          >
            {(data) => (
              <CategoryPieChart
                categories={data.categories}
                total={data.total}
                currency={currency}
              />
            )}
          </AsyncContent>
        </Card>

        <Card
          title="Monthly trend"
          description={`Income vs expense in ${year}`}
          className="lg:col-span-3"
        >
          <AsyncContent
            state={monthly}
            isEmpty={(data) => data.totals.income === 0 && data.totals.expense === 0}
            empty={
              <EmptyState
                icon="wallet"
                title={`No transactions in ${year}`}
                description="Your month-by-month totals will appear here."
              />
            }
          >
            {(data) => <MonthlyBarChart months={data.months} currency={currency} />}
          </AsyncContent>
        </Card>
      </div>

      <Card
        title="Recent transactions"
        description={formatMonthLabel(month)}
        className="mt-6"
        action={
          <Link to={monthTransactionsUrl} className={viewAllClass}>
            View all
          </Link>
        }
      >
        <AsyncContent
          state={recent}
          isEmpty={(data) => data.transactions.length === 0}
          empty={
            <EmptyState
              title="Nothing recorded this month"
              description="Add an income or expense to get started."
              action={addButton}
            />
          }
        >
          {(data) => <RecentTransactions transactions={data.transactions} currency={currency} />}
        </AsyncContent>
      </Card>
    </>
  );
}
