/** Builds <Select> options, optionally limited to one transaction type. */
export const toCategoryOptions = (categories, type) =>
  categories
    .filter((category) => !type || category.type === type)
    .map((category) => ({
      value: category._id,
      label: `${category.icon ? `${category.icon} ` : ''}${category.name}`,
    }));
