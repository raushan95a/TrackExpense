// Mirrors server/src/constants/category.js.
export const CATEGORY_NAME_MAX_LENGTH = 30;
export const CATEGORY_ICON_MAX_LENGTH = 16;
export const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}){1,2}$/i;

/** Colorblind-validated categorical palette (same as the default categories) + neutral gray. */
export const CATEGORY_COLORS = Object.freeze([
  '#2a78d6',
  '#eb6834',
  '#1baf7a',
  '#eda100',
  '#e87ba4',
  '#008300',
  '#6250d6',
  '#e34948',
  '#8a8984',
]);

export const CATEGORY_ICONS = Object.freeze([
  '🍔',
  '☕',
  '🛒',
  '🚌',
  '⛽',
  '✈️',
  '🏠',
  '💡',
  '📱',
  '💻',
  '🛍️',
  '👕',
  '💊',
  '🏋️',
  '🎬',
  '🎮',
  '📚',
  '🎓',
  '🐶',
  '🎁',
  '💰',
  '💵',
  '📈',
  '🧾',
  '📦',
]);
