import { PaginationMeta } from '../interfaces/pagination.interface';

export const createPaginationMeta = (
  totalItems: number,
  page: number,
  limit: number,
  itemCount: number,
): PaginationMeta => {
  const lastPage = Math.ceil(totalItems / limit);
  return {
    totalItems,
    itemCount,
    itemsPerPage: limit,
    currentPage: page,
    lastPage,
    hasNextPage: page < lastPage,
    hasPreviousPage: page > 1,
  };
};
