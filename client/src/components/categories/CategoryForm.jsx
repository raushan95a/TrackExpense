import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../constants/categories.js';
import { withFormErrors } from '../../utils/apiError.js';
import { categorySchema } from '../../validation/category.schema.js';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import CategoryBadge from '../transactions/CategoryBadge.jsx';
import TypeToggle from '../transactions/TypeToggle.jsx';
import SwatchPicker from './SwatchPicker.jsx';

/** Create/edit a custom category with a live preview. */
export default function CategoryForm({ defaultValues, isEdit, onSubmit, onCancel }) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(categorySchema), defaultValues });

  const [name, icon, color] = useWatch({ control, name: ['name', 'icon', 'color'] });

  return (
    <form
      onSubmit={handleSubmit(withFormErrors(onSubmit, setError))}
      noValidate
      className="space-y-5"
    >
      <Controller
        control={control}
        name="type"
        render={({ field }) => <TypeToggle value={field.value} onChange={field.onChange} />}
      />
      <Input
        label="Name"
        placeholder="e.g. Gym"
        autoFocus
        error={errors.name?.message}
        {...register('name')}
      />
      <Controller
        control={control}
        name="icon"
        render={({ field }) => (
          <SwatchPicker
            label="Icon"
            options={CATEGORY_ICONS}
            value={field.value}
            onChange={field.onChange}
            renderOption={(option) => option}
          />
        )}
      />
      <Controller
        control={control}
        name="color"
        render={({ field }) => (
          <SwatchPicker
            label="Color"
            options={CATEGORY_COLORS}
            value={field.value}
            onChange={field.onChange}
            getLabel={(option) => `Color ${option}`}
            renderOption={(option) => (
              <span className="size-5 rounded-full" style={{ backgroundColor: option }} />
            )}
          />
        )}
      />
      {errors.color && <p className="text-xs text-red-600">{errors.color.message}</p>}

      <div className="rounded-xl bg-slate-50 p-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Preview</p>
        <CategoryBadge category={{ name: name || 'Category name', icon, color }} />
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isEdit ? 'Save changes' : 'Create category'}
        </Button>
      </div>
    </form>
  );
}
