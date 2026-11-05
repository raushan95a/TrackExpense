import { getErrorMessage } from '../../utils/apiError.js';
import Button from './Button.jsx';

export default function ErrorState({ error, onRetry, title = 'Could not load data' }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center"
    >
      <h3 className="text-base font-semibold text-red-800">{title}</h3>
      <p className="mt-1 text-sm text-red-700">{getErrorMessage(error)}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
