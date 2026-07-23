export interface PaginationParams {
  page?: number;
  limit?: number;
}

export class PaginationUtil {
  static getPrismaPagination(params: PaginationParams) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    
    return {
      skip: (page - 1) * limit,
      take: limit,
    };
  }

  static getMeta(totalItems: number, params: PaginationParams) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      totalItems,
      itemsPerPage: limit,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }
}
