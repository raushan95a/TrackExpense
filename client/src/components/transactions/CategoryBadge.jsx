/** Category icon in a tinted circle followed by its name. */
export default function CategoryBadge({ category }) {
  if (!category) return <span className="text-slate-400">Uncategorised</span>;

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-base"
        style={{ backgroundColor: `${category.color}22` }}
        aria-hidden="true"
      >
        {category.icon || '•'}
      </span>
      <span className="font-medium text-slate-800">{category.name}</span>
    </span>
  );
}
