import CategoryBadge from '../transactions/CategoryBadge.jsx';

const actionClass = 'rounded-md px-2 py-1 text-sm font-medium';

/** Categories of one type; defaults are labelled and read-only. */
export default function CategoryList({ categories, onEdit, onDelete }) {
  return (
    <ul className="divide-y divide-slate-100">
      {categories.map((category) => (
        <li key={category._id} className="flex items-center justify-between gap-3 py-3">
          <CategoryBadge category={category} />
          {category.isDefault ? (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
              Default
            </span>
          ) : (
            <div className="flex gap-1">
              <button
                type="button"
                className={`${actionClass} text-brand-600 hover:bg-brand-50`}
                onClick={() => onEdit(category)}
              >
                Edit
              </button>
              <button
                type="button"
                className={`${actionClass} text-red-600 hover:bg-red-50`}
                onClick={() => onDelete(category)}
              >
                Delete
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
