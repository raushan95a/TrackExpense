/** Spinner; `fullScreen` centres it in the viewport. */
export default function Loader({ fullScreen = false, label = 'Loading' }) {
  const spinner = (
    <div role="status" className="flex flex-col items-center gap-3 text-slate-500">
      <span className="size-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
      <span className="text-sm">{label}…</span>
    </div>
  );

  if (!fullScreen) return <div className="flex justify-center py-10">{spinner}</div>;
  return <div className="flex min-h-screen items-center justify-center">{spinner}</div>;
}
