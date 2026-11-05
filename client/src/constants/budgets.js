/** Spending at or above this share of the limit counts as "near limit". */
export const BUDGET_WARNING_PERCENT = 80;

export const BUDGET_STATUS = Object.freeze({
  ON_TRACK: 'onTrack',
  NEAR_LIMIT: 'nearLimit',
  OVER: 'over',
});

/** Reserved status colors; always shown with an icon and a text label, never alone. */
export const BUDGET_STATUS_META = Object.freeze({
  [BUDGET_STATUS.ON_TRACK]: { label: 'On track', color: '#0ca30c', icon: 'check' },
  [BUDGET_STATUS.NEAR_LIMIT]: { label: 'Near limit', color: '#fab219', icon: 'alert' },
  [BUDGET_STATUS.OVER]: { label: 'Over budget', color: '#d03b3b', icon: 'alert' },
});
