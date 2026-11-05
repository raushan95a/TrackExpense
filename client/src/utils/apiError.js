import toast from 'react-hot-toast';

const FALLBACK_MESSAGE = 'Something went wrong';
const NETWORK_MESSAGE = 'Cannot reach the server. Check your connection.';

/** Extracts a human-readable message from an axios error. */
export const getErrorMessage = (error, fallback = FALLBACK_MESSAGE) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.request && !error.response) return NETWORK_MESSAGE;
  return fallback;
};

/**
 * Shows server errors on a react-hook-form form: field errors go next to their
 * inputs and the overall message is shown as a toast.
 */
export const handleFormError = (error, setError) => {
  const fieldErrors = error?.response?.data?.errors ?? [];
  fieldErrors.forEach(({ field, msg }) => setError(field, { type: 'server', message: msg }));
  toast.error(getErrorMessage(error));
};
