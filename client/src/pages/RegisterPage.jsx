import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useLocation } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import { ROUTES } from '../constants/routes.js';
import { useAuth } from '../hooks/useAuth.js';
import { handleFormError } from '../utils/apiError.js';
import { registerSchema } from '../validation/auth.schemas.js';

const DEFAULT_VALUES = { name: '', email: '', password: '', confirmPassword: '' };
const HTTP_CONFLICT = 409;
const EMAIL_TAKEN_MESSAGE = 'This email is already registered.';

export default function RegisterPage() {
  const { register: registerAccount } = useAuth();
  const location = useLocation();
  const [emailTaken, setEmailTaken] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema), defaultValues: DEFAULT_VALUES });

  const onSubmit = async ({ confirmPassword: _confirm, ...payload }) => {
    setEmailTaken(false);
    try {
      const user = await registerAccount(payload);
      toast.success(`Welcome, ${user.name}!`);
    } catch (error) {
      // Duplicate email: point the user to login instead of a generic toast.
      if (error?.response?.status === HTTP_CONFLICT) {
        setError('email', { type: 'server', message: EMAIL_TAKEN_MESSAGE });
        setEmailTaken(true);
        return;
      }
      handleFormError(error, setError);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start tracking income and expenses in minutes."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            state={location.state}
            className="font-medium text-brand-600 hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Name"
          autoComplete="name"
          autoFocus
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters with a letter and a number."
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        {emailTaken && (
          <p role="alert" className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            You already have an account with this email.{' '}
            <Link
              to={ROUTES.LOGIN}
              state={location.state}
              className="font-medium text-brand-600 hover:underline"
            >
              Log in instead
            </Link>
          </p>
        )}
        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
