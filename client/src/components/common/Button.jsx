import { buttonClass } from './buttonStyles.js';

export default function Button({
  variant = 'primary',
  type = 'button',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={buttonClass({ variant, fullWidth, className })}
      {...props}
    >
      {isLoading && (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
