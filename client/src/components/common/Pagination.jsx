const MAX_VISIBLE_PAGES = 5;

/** Page numbers centred on the current page, at most MAX_VISIBLE_PAGES wide. */
const getVisiblePages = (page, totalPages) => {
  const count = Math.min(MAX_VISIBLE_PAGES, totalPages);
  const start = Math.min(Math.max(1, page - Math.floor(count / 2)), totalPages - count + 1);
  return Array.from({ length: count }, (_, i) => start + i);
};

const pageButtonClass = (isActive) =>
  `min-w-9 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
    isActive ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
  }`;

const navButtonClass =
  'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50';

export default function Pagination({ page, limit, total, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const firstItem = (page - 1) * limit + 1;
  const lastItem = Math.min(page * limit, total);

  return (
    <nav
      aria-label="Pagination"
      className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-sm text-slate-500">
        Showing <span className="font-medium text-slate-700">{firstItem}</span>–
        <span className="font-medium text-slate-700">{lastItem}</span> of{' '}
        <span className="font-medium text-slate-700">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className={navButtonClass}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Prev
        </button>
        <div className="hidden items-center gap-1 sm:flex">
          {getVisiblePages(page, totalPages).map((number) => (
            <button
              key={number}
              type="button"
              className={pageButtonClass(number === page)}
              aria-current={number === page ? 'page' : undefined}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          ))}
        </div>
        <span className="px-2 text-sm text-slate-500 sm:hidden">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          className={navButtonClass}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
