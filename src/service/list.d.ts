interface ListParams {
  page?: number
  pageSize?: number
}

type ListResponseDefault = ResponseDefault

interface ListResponse<T> {
  page: number
  pageSize: number
  total: number
  totalPage: number
  pageData: Array<T & ListResponseDefault>
}
