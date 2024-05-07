import { QueryResponse } from "@/pages/table/service/index.type"
import http from "@/service"

export function query(
  params: ListParams
): Service<ListResponse<QueryResponse>> {
  return http.post("/api/table/query", params)
}

export function enable(uuid: string): Service {
  return http.post("/api/table/enable", { uuid })
}

export function disable(uuid: string): Service {
  return http.post("/api/table/enable", { uuid })
}

export function remote(uuid: string): Service {
  return http.post("/api/table/delete", { uuid })
}
