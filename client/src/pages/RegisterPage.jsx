import { zodResolver } from '@hookform/resolvers/zod';
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

export default function RegisterPage() {
  const { register: registerAccount } = useAuth();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema), defaultValues: DEFAULT_VALUES });

  const onSubmit = async ({ confirmPassword: _confirm, ...payload }) => {
    try {
      const user = await registerAccount(payload);
      toast.success(`Welcome, ${user.name}!`);
    } catch (error) {
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
        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
