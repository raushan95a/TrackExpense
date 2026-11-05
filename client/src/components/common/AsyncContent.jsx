import ErrorState from './ErrorState.jsx';
import Loader from './Loader.jsx';

/**
 * Renders the loading / error / empty / ready states of a useFetch() result.
 * While refetching, the previous content stays visible but dimmed.
 */
export default function AsyncContent({ state, isEmpty = () => false, empty, children }) {
  const { data, error, isLoading, reload } = state;

  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!data) return <Loader />;
  if (isEmpty(data)) return empty;

  return (
    <div className={`transition-opacity ${isLoading ? 'opacity-60' : ''}`} aria-busy={isLoading}>
      {children(data)}
    </div>
  );
}
