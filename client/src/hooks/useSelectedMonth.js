import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { currentMonthKey, MONTH_KEY_PATTERN } from '../utils/date.js';

const MONTH_PARAM = 'month';

/** Selected "YYYY-MM" month kept in the URL (?month=), defaulting to the current month. */
export function useSelectedMonth() {
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get(MONTH_PARAM);
  const month = param && MONTH_KEY_PATTERN.test(param) ? param : currentMonthKey();

  const setMonth = useCallback(
    (next) =>
      setSearchParams(next === currentMonthKey() ? {} : { [MONTH_PARAM]: next }, {
        replace: true,
      }),
    [setSearchParams],
  );

  return [month, setMonth];
}
