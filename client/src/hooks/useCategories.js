import { categoriesApi } from '../api/categories.api.js';
import { useFetch } from './useFetch.js';

const fetchCategories = () => categoriesApi.list().then((data) => data.categories);

/** All categories visible to the user (defaults + own). */
export function useCategories() {
  const { data, ...rest } = useFetch(fetchCategories, 'categories');
  return { categories: data ?? [], ...rest };
}
