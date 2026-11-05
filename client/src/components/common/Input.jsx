import Field from './Field.jsx';
import { fieldClass } from './fieldStyles.js';

/** Labelled input with an accessible error message. Works with react-hook-form's register(). */
export default function Input({ label, error, hint, className = '', ref, ...props }) {
  return (
    <Field label={label} error={error} hint={hint} className={className}>
      {(a11y) => <input ref={ref} className={fieldClass(error)} {...a11y} {...props} />}
    </Field>
  );
}
