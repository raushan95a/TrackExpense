import Field from './Field.jsx';
import { fieldClass } from './fieldStyles.js';

export default function Textarea({ label, error, hint, className = '', ref, rows = 3, ...props }) {
  return (
    <Field label={label} error={error} hint={hint} className={className}>
      {(a11y) => (
        <textarea
          ref={ref}
          rows={rows}
          className={`${fieldClass(error)} resize-y`}
          {...a11y}
          {...props}
        />
      )}
    </Field>
  );
}
