import Field from './Field.jsx';
import { fieldClass } from './fieldStyles.js';

/**
 * Labelled select. `options` is [{ value, label }]; `placeholder` adds an empty first option.
 */
export default function Select({
  label,
  error,
  hint,
  options,
  placeholder,
  className = '',
  ref,
  ...props
}) {
  return (
    <Field label={label} error={error} hint={hint} className={className}>
      {(a11y) => (
        <select ref={ref} className={fieldClass(error)} {...a11y} {...props}>
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}
