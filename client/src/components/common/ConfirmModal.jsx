import { useEffect, useRef } from 'react';
import Button from './Button.jsx';

/**
 * Accessible confirmation dialog built on native <dialog>
 * (focus trapping and Escape-to-close come for free).
 */
export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const handleCancel = (event) => {
    event.preventDefault(); // keep the dialog under React's control
    if (!isLoading) onCancel();
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      aria-labelledby="confirm-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl p-0 shadow-xl backdrop:bg-slate-900/40"
    >
      <div className="p-6">
        <h2 id="confirm-title" className="text-lg font-semibold text-slate-900">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant={variant} onClick={onConfirm} isLoading={isLoading} autoFocus>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
