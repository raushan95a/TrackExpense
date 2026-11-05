/**
 * Radio-group of small buttons, used for both the icon and color pickers.
 * `renderOption(option, isSelected)` draws the button content.
 */
export default function SwatchPicker({ label, options, value, onChange, renderOption, getLabel }) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-slate-700">{label}</legend>
      <div role="radiogroup" className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option === value;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={getLabel?.(option) ?? option}
              onClick={() => onChange(option)}
              className={`flex size-9 items-center justify-center rounded-lg border text-lg transition ${
                isSelected
                  ? 'border-brand-600 ring-2 ring-brand-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {renderOption(option, isSelected)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
