import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { withFormErrors } from '../../utils/apiError.js';
import { changePasswordSchema } from '../../validation/auth.schemas.js';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' };

export default function PasswordForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(changePasswordSchema), defaultValues: EMPTY });

  const submit = async ({ currentPassword, newPassword }) => {
    await onSubmit({ currentPassword, newPassword });
    reset(EMPTY);
  };

  return (
    <form
      onSubmit={handleSubmit(withFormErrors(submit, setError))}
      noValidate
      className="space-y-5"
    >
      <Input
        label="Current password"
        type="password"
        autoComplete="current-password"
        error={errors.currentPassword?.message}
        {...register('currentPassword')}
      />
      <Input
        label="New password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters with a letter and a number."
        error={errors.newPassword?.message}
        {...register('newPassword')}
      />
      <Input
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Change password
        </Button>
      </div>
    </form>
  );
}
