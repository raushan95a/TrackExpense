import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { budgetsApi } from '../api/budgets.api.js';
import BudgetCard from '../components/budgets/BudgetCard.jsx';
import BudgetForm from '../components/budgets/BudgetForm.jsx';
import BudgetProgressBar from '../components/budgets/BudgetProgressBar.jsx';
import AsyncContent from '../components/common/AsyncContent.jsx';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import ConfirmModal from '../components/common/ConfirmModal.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Icon from '../components/common/Icon.jsx';
import Modal from '../components/common/Modal.jsx';
import MonthPicker from '../components/common/MonthPicker.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import { TRANSACTION_TYPES } from '../constants/transactions.js';
import { useAuth } from '../hooks/useAuth.js';
import { useCategories } from '../hooks/useCategories.js';
import { useConfirmAction } from '../hooks/useConfirmAction.js';
import { useFetch } from '../hooks/useFetch.js';
import { useSelectedMonth } from '../hooks/useSelectedMonth.js';
import { formatMonthLabel } from '../utils/date.js';
import { toMajorUnits, toMinorUnits } from '../utils/money.js';

const EMPTY_FORM = { category: '', limit: '' };

export default function BudgetsPage() {
  const { user } = useAuth();
  const currency = user.currency;
  const [month, setMonth] = useSelectedMonth();
  const budgetsState = useFetch(() => budgetsApi.list(month), `budgets:${month}`);
  const { categories } = useCategories();

  // null = closed, { budget: null } = create, { budget } = edit
  const [editor, setEditor] = useState(null);
  const deletion = useConfirmAction((budget) => budgetsApi.remove(budget._id), {
    successMessage: 'Budget removed',
    onSuccess: budgetsState.reload,
  });

  const budgets = useMemo(() => budgetsState.data?.budgets ?? [], [budgetsState.data]);
  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === TRANSACTION_TYPES.EXPENSE),
    [categories],
  );
  // When creating, hide categories that already have a budget this month.
  const availableCategories = useMemo(() => {
    const budgeted = new Set(budgets.map((b) => b.category._id));
    return expenseCategories.filter((c) => !budgeted.has(c._id));
  }, [budgets, expenseCategories]);

  const editing = editor?.budget;
  const closeEditor = () => setEditor(null);

  const handleSave = async (values) => {
    await budgetsApi.upsert({
      category: editing ? editing.category._id : values.category,
      month,
      limit: toMinorUnits(values.limit),
    });
    toast.success(editing ? 'Budget updated' : 'Budget set');
    closeEditor();
    budgetsState.reload();
  };

  const addButton = (
    <Button onClick={() => setEditor({ budget: null })} disabled={!availableCategories.length}>
      <Icon name="plus" className="size-4" />
      Set budget
    </Button>
  );

  return (
    <>
      <PageHeader
        title="Budgets"
        description="Set monthly limits per category and see how you are tracking."
        actions={
          <>
            <MonthPicker month={month} onChange={setMonth} allowFuture />
            {addButton}
          </>
        }
      />

      <AsyncContent
        state={budgetsState}
        isEmpty={(data) => data.budgets.length === 0}
        empty={
          <EmptyState
            icon="target"
            title={`No budgets for ${formatMonthLabel(month)}`}
            description="Set a limit on a category to get a warning before you overspend."
            action={addButton}
          />
        }
      >
        {(data) => (
          <>
            <Card title="This month overall" className="mb-6">
              <BudgetProgressBar
                spent={data.totals.spent}
                limit={data.totals.limit}
                currency={currency}
              />
            </Card>
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.budgets.map((budget) => (
                <BudgetCard
                  key={budget._id}
                  budget={budget}
                  currency={currency}
                  onEdit={(b) => setEditor({ budget: b })}
                  onDelete={deletion.request}
                />
              ))}
            </ul>
          </>
        )}
      </AsyncContent>

      <Modal
        isOpen={Boolean(editor)}
        title={editing ? 'Edit budget' : `Set a budget for ${formatMonthLabel(month)}`}
        onClose={closeEditor}
      >
        <BudgetForm
          key={editing?._id ?? 'new'}
          categories={editing ? expenseCategories : availableCategories}
          defaultValues={
            editing
              ? { category: editing.category._id, limit: toMajorUnits(editing.limit) }
              : EMPTY_FORM
          }
          isEdit={Boolean(editing)}
          currency={currency}
          onSubmit={handleSave}
          onCancel={closeEditor}
        />
      </Modal>

      <ConfirmModal
        isOpen={deletion.isOpen}
        title="Remove budget?"
        message={`The ${deletion.target?.category.name ?? ''} budget for ${formatMonthLabel(month)} will be removed. Your transactions are not affected.`}
        confirmLabel="Remove"
        isLoading={deletion.isPending}
        onConfirm={deletion.confirm}
        onCancel={deletion.cancel}
      />
    </>
  );
}
