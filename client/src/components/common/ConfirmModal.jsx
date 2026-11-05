import Button from './Button.jsx';
import Modal from './Modal.jsx';

/** Yes/no confirmation dialog, used before destructive actions. */
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
  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel} isBusy={isLoading} size="sm">
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant={variant} onClick={onConfirm} isLoading={isLoading} autoFocus>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
