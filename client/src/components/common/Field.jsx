import { useId } from 'react';

/**
 * Label + control + help/error text. `children` is a render function that
 * receives the accessibility props to spread onto the control.
 */
export default function Field({ label, error, hint, className = '', children }) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': message ? messageId : undefined,
      })}
      {message && (
        <p id={messageId} className={`mt-1.5 text-xs ${error ? 'text-red-600' : 'text-slate-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
