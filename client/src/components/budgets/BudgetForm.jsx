import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { withFormErrors } from '../../utils/apiError.js';
import { toCategoryOptions } from '../../utils/categories.js';
import { budgetSchema } from '../../validation/budget.schema.js';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import CategoryBadge from '../transactions/CategoryBadge.jsx';

/**
 * Set a monthly limit for one expense category (major units in, parent converts).
 * The category is fixed when editing because a budget is identified by it.
 */
export default function BudgetForm({
  categories,
  defaultValues,
  isEdit,
  currency,
  onSubmit,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(budgetSchema), defaultValues });

  return (
    <form
      onSubmit={handleSubmit(withFormErrors(onSubmit, setError))}
      noValidate
      className="space-y-5"
    >
      {isEdit ? (
        <div>
          <p className="mb-1.5 text-sm font-medium text-slate-700">Category</p>
          <CategoryBadge category={categories.find((c) => c._id === defaultValues.category)} />
        </div>
      ) : (
        <Select
          label="Category"
          placeholder="Select an expense category"
          options={toCategoryOptions(categories)}
          error={errors.category?.message}
          {...register('category')}
        />
      )}
      <Input
        label={`Monthly limit (${currency})`}
        inputMode="decimal"
        placeholder="0.00"
        autoFocus
        error={errors.limit?.message}
        {...register('limit')}
      />
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isEdit ? 'Save limit' : 'Set budget'}
        </Button>
      </div>
    </form>
  );
}
