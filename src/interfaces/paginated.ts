export interface Paginated<T> {
  data: T[];
  totalRows: number;
  totalPages: number;
  page: number;
  perPage: number;
}
