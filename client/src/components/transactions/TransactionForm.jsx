import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { NOTE_MAX_LENGTH } from '../../constants/transactions.js';
import { handleFormError } from '../../utils/apiError.js';
import { toCategoryOptions } from '../../utils/categories.js';
import { transactionSchema } from '../../validation/transaction.schema.js';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import Textarea from '../common/Textarea.jsx';
import TypeToggle from './TypeToggle.jsx';

/**
 * Add/edit form. Works in major units; the parent converts to minor units.
 * Server validation errors are mapped back onto the fields.
 */
export default function TransactionForm({
  defaultValues,
  categories,
  currency,
  submitLabel,
  onSubmit,
  onCancel,
}) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(transactionSchema), defaultValues });

  const type = useWatch({ control, name: 'type' });
  const categoryOptions = useMemo(() => toCategoryOptions(categories, type), [categories, type]);

  // Switching type clears a category that belongs to the other type.
  const handleTypeChange = (nextType, onChange) => {
    onChange(nextType);
    const current = categories.find((c) => c._id === getValues('category'));
    if (current && current.type !== nextType) setValue('category', '');
  };

  const submit = async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      handleFormError(error, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <TypeToggle
            value={field.value}
            onChange={(next) => handleTypeChange(next, field.onChange)}
          />
        )}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label={`Amount (${currency})`}
          inputMode="decimal"
          placeholder="0.00"
          autoFocus
          error={errors.amount?.message}
          {...register('amount')}
        />
        <Input label="Date" type="date" error={errors.date?.message} {...register('date')} />
      </div>

      <Select
        label="Category"
        placeholder="Select a category"
        options={categoryOptions}
        error={errors.category?.message}
        {...register('category')}
      />

      <Textarea
        label="Note"
        placeholder="What was it for? (optional)"
        maxLength={NOTE_MAX_LENGTH}
        error={errors.note?.message}
        {...register('note')}
      />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
