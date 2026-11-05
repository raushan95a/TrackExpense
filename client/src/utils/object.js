/** Drops keys whose value is '', null or undefined (e.g. before sending query params). */
export const omitEmpty = (object) =>
  Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => value !== '' && value !== null && value !== undefined,
    ),
  );
