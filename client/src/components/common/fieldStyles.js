/** Shared classes for text inputs, selects and textareas. */
export const fieldClass = (hasError) =>
  `block w-full rounded-lg border bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:bg-slate-50 ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100'
  }`;
