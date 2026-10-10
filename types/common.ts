export interface ApiResponse<T = void> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
}
