import { TableColumnProps } from "@arco-design/web-react"

export type ProTableColumnProps<T> = TableColumnProps<T> & {
  hide?: true
  search?: boolean
  sorter?: boolean
  valueType?:
    | "select"
    | "text"
    | "date"
    | "treeSelect"
    | "number"
    | "autoComplete"
  fieldProps?: Record<string, any>
}
