import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { SEARCH_DEBOUNCE_MS, TYPE_OPTIONS } from '../../constants/transactions.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { toCategoryOptions } from '../../utils/categories.js';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';

/** Search, type, category and date-range filters; values live in the URL. */
export default function TransactionFilters({
  filters,
  categories,
  onChange,
  onReset,
  hasActiveFilters,
}) {
  const [search, setSearch] = useState(filters.q);
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);

  const applySearch = useEffectEvent((value) => {
    const q = value.trim();
    if (q !== filters.q) onChange({ q });
  });
  useEffect(() => applySearch(debouncedSearch), [debouncedSearch]);

  const categoryOptions = useMemo(
    () => toCategoryOptions(categories, filters.type),
    [categories, filters.type],
  );

  // A category of the other type cannot match, so clear it when type changes.
  const handleTypeChange = (type) => {
    const selected = categories.find((c) => c._id === filters.category);
    onChange({ type, ...(selected && type && selected.type !== type && { category: '' }) });
  };

  const handleReset = () => {
    setSearch('');
    onReset();
  };

  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <Input
          label="Search notes"
          type="search"
          placeholder="e.g. groceries"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="sm:col-span-2"
        />
        <Select
          label="Type"
          placeholder="All types"
          options={TYPE_OPTIONS}
          value={filters.type}
          onChange={(event) => handleTypeChange(event.target.value)}
        />
        <Select
          label="Category"
          placeholder="All categories"
          options={categoryOptions}
          value={filters.category}
          onChange={(event) => onChange({ category: event.target.value })}
        />
        <Input
          label="From"
          type="date"
          value={filters.from}
          max={filters.to || undefined}
          onChange={(event) => onChange({ from: event.target.value })}
        />
        <Input
          label="To"
          type="date"
          value={filters.to}
          min={filters.from || undefined}
          onChange={(event) => onChange({ to: event.target.value })}
        />
      </div>
      {hasActiveFilters && (
        <div className="mt-3 flex justify-end">
          <Button variant="ghost" onClick={handleReset}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
