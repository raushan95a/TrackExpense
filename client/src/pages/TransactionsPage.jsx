import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { transactionsApi } from '../api/transactions.api.js';
import Button from '../components/common/Button.jsx';
import ConfirmModal from '../components/common/ConfirmModal.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import LinkButton from '../components/common/LinkButton.jsx';
import Loader from '../components/common/Loader.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import Pagination from '../components/common/Pagination.jsx';
import TransactionFilters from '../components/transactions/TransactionFilters.jsx';
import TransactionTable from '../components/transactions/TransactionTable.jsx';
import { ROUTES } from '../constants/routes.js';
import { PAGE_SIZE } from '../constants/transactions.js';
import { useAuth } from '../hooks/useAuth.js';
import { useCategories } from '../hooks/useCategories.js';
import { useConfirmAction } from '../hooks/useConfirmAction.js';
import { useFetch } from '../hooks/useFetch.js';
import { useTransactionFilters } from '../hooks/useTransactionFilters.js';
import { getErrorMessage } from '../utils/apiError.js';
import { todayInputDate } from '../utils/date.js';
import { downloadBlob } from '../utils/download.js';
import { omitEmpty } from '../utils/object.js';

export default function TransactionsPage() {
  const { user } = useAuth();
  const { filters, page, setFilters, setPage, resetFilters, hasActiveFilters } =
    useTransactionFilters();
  const { categories } = useCategories();

  const activeFilters = useMemo(() => omitEmpty(filters), [filters]);
  const params = useMemo(
    () => ({ ...activeFilters, page, limit: PAGE_SIZE }),
    [activeFilters, page],
  );
  const { data, error, isLoading, reload } = useFetch(
    () => transactionsApi.list(params),
    JSON.stringify(params),
  );

  const [isExporting, setIsExporting] = useState(false);

  const transactions = data?.transactions ?? [];
  const pagination = data?.pagination;

  // e.g. a shared link with ?page=9 after records were deleted.
  useEffect(() => {
    if (pagination && pagination.totalPages > 0 && page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [pagination, page, setPage]);

  const deletion = useConfirmAction((transaction) => transactionsApi.remove(transaction._id), {
    successMessage: 'Transaction deleted',
    // Removing the last row of a page moves back one page; otherwise refresh in place.
    onSuccess: () => (transactions.length === 1 && page > 1 ? setPage(page - 1) : reload()),
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await transactionsApi.exportCsv(activeFilters);
      downloadBlob(blob, `transactions-${todayInputDate()}.csv`);
    } catch (exportError) {
      toast.error(getErrorMessage(exportError, 'Export failed'));
    } finally {
      setIsExporting(false);
    }
  };

  const renderContent = () => {
    if (error) return <ErrorState error={error} onRetry={reload} />;
    if (!data) return <Loader />;
    if (!transactions.length) {
      return hasActiveFilters ? (
        <EmptyState
          title="No matching transactions"
          description="Try changing or clearing your filters."
          action={
            <Button variant="secondary" onClick={resetFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <EmptyState
          title="No transactions yet"
          description="Add your first income or expense to start tracking."
          action={<LinkButton to={ROUTES.NEW_TRANSACTION}>Add transaction</LinkButton>}
        />
      );
    }
    return (
      <div className={`transition-opacity ${isLoading ? 'opacity-60' : ''}`} aria-busy={isLoading}>
        <TransactionTable
          transactions={transactions}
          currency={user.currency}
          onDelete={deletion.request}
        />
        <Pagination {...pagination} onPageChange={setPage} />
      </div>
    );
  };

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Browse, filter and manage your income and expenses."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={handleExport}
              isLoading={isExporting}
              disabled={!transactions.length}
            >
              Export CSV
            </Button>
            <LinkButton to={ROUTES.NEW_TRANSACTION}>Add transaction</LinkButton>
          </>
        }
      />

      <TransactionFilters
        filters={filters}
        categories={categories}
        onChange={setFilters}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {renderContent()}

      <ConfirmModal
        isOpen={deletion.isOpen}
        title="Delete transaction?"
        message="This transaction will be permanently removed. This cannot be undone."
        confirmLabel="Delete"
        isLoading={deletion.isPending}
        onConfirm={deletion.confirm}
        onCancel={deletion.cancel}
      />
    </>
  );
}
