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
import { loginSchema } from '../validation/auth.schemas.js';

export default function LoginPage() {
  const { login } = useAuth();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  // PublicOnlyRoute redirects once the user is authenticated.
  const onSubmit = async (values) => {
    try {
      const user = await login(values);
      toast.success(`Welcome back, ${user.name}!`);
    } catch (error) {
      handleFormError(error, setError);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to see your spending."
      footer={
        <>
          New here?{' '}
          <Link
            to={ROUTES.REGISTER}
            state={location.state}
            className="font-medium text-brand-600 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          autoFocus
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
}
