import { useEffect, useId, useRef } from 'react';
import Icon from './Icon.jsx';

/**
 * Accessible dialog built on native <dialog> (focus trap + Escape for free).
 * `isBusy` blocks closing while a request is in flight.
 */
export default function Modal({ isOpen, title, onClose, isBusy = false, size = 'md', children }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const requestClose = () => {
    if (!isBusy) onClose();
  };

  const handleCancel = (event) => {
    event.preventDefault(); // keep open/closed state under React's control
    requestClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      aria-labelledby={titleId}
      className={`m-auto w-[calc(100%-2rem)] rounded-2xl p-0 shadow-xl backdrop:bg-slate-900/40 ${
        size === 'sm' ? 'max-w-md' : 'max-w-lg'
      }`}
    >
      {isOpen && (
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
            <button
              type="button"
              onClick={requestClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close"
            >
              <Icon name="close" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
