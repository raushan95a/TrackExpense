import { useState } from 'react';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/apiError.js';

/**
 * State for "ask, then run" flows such as delete-with-confirmation.
 * @param {(item: any) => Promise<void>} action  runs when the user confirms
 * @param {{ successMessage: string, onSuccess?: (item: any) => void }} options
 */
export function useConfirmAction(action, { successMessage, onSuccess }) {
  const [target, setTarget] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const confirm = async () => {
    setIsPending(true);
    try {
      await action(target);
      toast.success(successMessage);
      const done = target;
      setTarget(null);
      onSuccess?.(done);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsPending(false);
    }
  };

  return {
    target,
    isOpen: Boolean(target),
    isPending,
    request: setTarget,
    cancel: () => setTarget(null),
    confirm,
  };
}
