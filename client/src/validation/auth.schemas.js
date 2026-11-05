import { z } from 'zod';
import { NAME_MAX_LENGTH } from '../constants/validation.js';
import { strongPasswordField } from './fields.js';

const email = z.string().trim().min(1, 'Email is required').email('Enter a valid email');

const name = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .max(NAME_MAX_LENGTH, `At most ${NAME_MAX_LENGTH} characters`);

const passwordsMatch = (passwordKey) => [
  (data) => data[passwordKey] === data.confirmPassword,
  { path: ['confirmPassword'], message: 'Passwords do not match' },
];

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name,
    email,
    password: strongPasswordField,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(...passwordsMatch('password'));

export const profileSchema = z.object({
  name,
  currency: z.string().min(1, 'Choose a currency'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: strongPasswordField,
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine(...passwordsMatch('newPassword'))
  .refine((data) => data.newPassword !== data.currentPassword, {
    path: ['newPassword'],
    message: 'New password must differ from the current one',
  });
