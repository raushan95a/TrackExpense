import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { transactionsApi } from '../api/transactions.api.js';
import ErrorState from '../components/common/ErrorState.jsx';
import Loader from '../components/common/Loader.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import TransactionForm from '../components/transactions/TransactionForm.jsx';
import { ROUTES } from '../constants/routes.js';
import { useAuth } from '../hooks/useAuth.js';
import { useCategories } from '../hooks/useCategories.js';
import { useFetch } from '../hooks/useFetch.js';
import {
  emptyTransactionValues,
  toTransactionFormValues,
  toTransactionPayload,
} from '../utils/transactionForm.js';

const fetchTransaction = (id) =>
  id ? transactionsApi.get(id).then((data) => data.transaction) : Promise.resolve(null);

/** Handles both /transactions/new and /transactions/:id/edit. */
export default function TransactionFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const categoriesState = useCategories();
  const transactionState = useFetch(() => fetchTransaction(id), `transaction:${id ?? 'new'}`);

  const goBack = () => navigate(ROUTES.TRANSACTIONS);

  const handleSubmit = async (values) => {
    const payload = toTransactionPayload(values);
    if (isEdit) await transactionsApi.update(id, payload);
    else await transactionsApi.create(payload);
    toast.success(isEdit ? 'Transaction updated' : 'Transaction added');
    goBack();
  };

  const renderBody = () => {
    const failed = categoriesState.error ?? transactionState.error;
    if (failed) {
      return (
        <ErrorState
          error={failed}
          onRetry={() => {
            categoriesState.reload();
            transactionState.reload();
          }}
        />
      );
    }
    if (categoriesState.isLoading || transactionState.isLoading) return <Loader />;

    return (
      <TransactionForm
        key={id ?? 'new'}
        defaultValues={
          isEdit ? toTransactionFormValues(transactionState.data) : emptyTransactionValues()
        }
        categories={categoriesState.categories}
        currency={user.currency}
        submitLabel={isEdit ? 'Save changes' : 'Add transaction'}
        onSubmit={handleSubmit}
        onCancel={goBack}
      />
    );
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title={isEdit ? 'Edit transaction' : 'Add transaction'}
        description={isEdit ? 'Update the details below.' : 'Record a new income or expense.'}
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">{renderBody()}</div>
    </div>
  );
}
