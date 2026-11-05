import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CURRENCY_OPTIONS } from '../../constants/currency.js';
import { withFormErrors } from '../../utils/apiError.js';
import { profileSchema } from '../../validation/auth.schemas.js';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';

/** Name and currency; email is shown but cannot be changed. */
export default function ProfileForm({ user, onSubmit }) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, currency: user.currency },
  });

  const submit = async (values) => {
    await onSubmit(values);
    reset(values); // saved values become the new baseline
  };

  return (
    <form
      onSubmit={handleSubmit(withFormErrors(submit, setError))}
      noValidate
      className="space-y-5"
    >
      <Input label="Name" autoComplete="name" error={errors.name?.message} {...register('name')} />
      <Input label="Email" value={user.email} disabled readOnly hint="Email cannot be changed." />
      <Select
        label="Currency"
        options={CURRENCY_OPTIONS}
        hint="Amounts are stored as-is; only the display symbol changes."
        error={errors.currency?.message}
        {...register('currency')}
      />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting} disabled={!isDirty}>
          Save profile
        </Button>
      </div>
    </form>
  );
}
