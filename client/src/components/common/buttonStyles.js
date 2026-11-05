const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ' +
  'transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-600',
  secondary:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
  ghost: 'text-slate-600 hover:bg-slate-100 focus-visible:outline-slate-400',
};

/** Shared by <Button> and <LinkButton> so links can look like buttons. */
export const buttonClass = ({ variant = 'primary', fullWidth = false, className = '' } = {}) =>
  `${BASE} ${VARIANTS[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;
