import React, {
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react"
import { Table, PaginationProps, TableProps } from "@arco-design/web-react"
import TableExpand from "./components/TableExpand"
import { ProTableColumnProps } from "./type/proTable.type"

export interface ProTableActionRef<T = undefined> {
  reload: () => void
  getList: () => T extends undefined ? Array<Record<string, unknown>> : Array<T>
}

const ProTable = forwardRef<
  unknown,
  {
    request: (
      params: Record<string, any>
    ) => Service<ListResponse<Record<string, any>>>
    columns: Array<ProTableColumnProps<Record<string, any>>>
    actionBarRender?: ReactNode[]
    toolBarRender?: ReactNode[]
    /**不需要分页管理器 */
    // pagination?: false
    /**不需要分页 */
    pageSize?: false
    /**数据二次处理 */
    dataRender?: (
      data: Array<Record<string, any>>
    ) => Array<Record<string, any>> | Promise<Array<Record<string, any>>>
    /**自动刷新列表 */
    autoRefresh?: boolean
    autoRefreshTime?: number
    /**立刻搜索 */
    immediateSearch?: boolean
  } & TableProps
>((props, ref) => {
  /**
   * 防止二次请求
   * 如果是在getList请求中修改了params那么副作用会检测到参数的修改又进行请求,所以通过这个状态来控制中断副作用的二次请求,只在真正的因为参数变化而需要触发请求的时候再获取数据 例如筛选通过修改参数的利用副作用去请求数据 */
  const [isGetListSaveParams, setIsGetListSaveParams] = useState(false)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState({})
  const [data, setData] = useState<Array<Record<string, unknown>>>([])
  const [pagination, setPagination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    current: 1,
    pageSize: 10,
    pageSizeChangeResetCurrent: true
  })

  const tableExpandRef = useRef<{
    submit: () => void
  }>()

  useImperativeHandle(ref, () => ({
    reload: () => getList(params, true),
    getList: () => data
  }))

  const getList = useCallback(
    async (
      values: { [key: string]: string } = params,
      search = false,
      isLoading = true
    ) => {
      // 保存参数
      if (JSON.stringify(params) !== JSON.stringify(values)) {
        setIsGetListSaveParams(true)
        setParams(values)
      }
      // 是否显示loading
      if (isLoading) setLoading(true)
      // 如果是搜索，重置分页
      let current,
        pageSize = 10
      if (search) {
        current = 1
      } else {
        current = pagination.current
        pageSize = pagination.pageSize
      }
      try {
        const res = await props.request({
          page: props.pageSize === false ? undefined : current,
          pageSize: props.pageSize === false ? undefined : pageSize,
          ...values
        })
        if (res.code === 0) {
          // 数据二次处理
          if (props.dataRender) {
            const formatData = await props.dataRender(res.data.pageData)
            setData(formatData)
          } else {
            setData(res.data.pageData)
            if (res.data.pageData) {
              setData(res.data.pageData)
            } else {
              setData(res.data as unknown as Array<Record<string, unknown>>)
            }
          }
          setPagination({
            ...pagination,
            current,
            pageSize,
            total: res.data.total
          })
        } else {
          throw new Error(res.message)
        }
      } catch (err) {}
      // 关闭loading
      if (isLoading) setLoading(false)
    },
    [params, pagination, props]
  )

  useEffect(() => {
    if (isGetListSaveParams) {
      setIsGetListSaveParams(false)
      return
    }
    if (props.immediateSearch) {
      tableExpandRef.current.submit()
    } else {
      getList()
    }
  }, [pagination.current, pagination.pageSize, params])

  useEffect(() => {
    if (props.autoRefresh && props.autoRefreshTime) {
      const interval = setInterval(() => {
        getList(params, false, false)
      }, props.autoRefreshTime)
      return () => {
        clearInterval(interval)
      }
    }
  }, [props.autoRefresh, props.autoRefreshTime, params, getList])

  return (
    <>
      <TableExpand
        ref={tableExpandRef}
        columns={props.columns}
        search={getList}
        actionBarRender={props.actionBarRender}
        toolBarRender={props.toolBarRender}
        hideResetButton={props.immediateSearch}
      />
      <Table
        loading={loading}
        columns={props.columns.filter(v => !v.hide)}
        rowKey={props.rowKey || "uuid"}
        data={data}
        pagination={props.pagination === false ? false : pagination}
        onChange={({ current, pageSize }, sorter) => {
          // 如果有排序
          if (sorter) {
            // 如果是多列排序
            if (Array.isArray(sorter)) {
            }
            // 单列排序
            else {
              // 如果有排序,添加排序参数
              if (sorter.direction) {
                setParams({
                  ...params,
                  orderField: sorter.field,
                  orderType: sorter.direction === "ascend" ? "ASC" : "DESC"
                })
              }
              // 如果没有排序,清空排序参数
              else {
                setParams({
                  ...params,
                  orderField: undefined,
                  orderType: undefined
                })
              }
            }
          }
          setPagination({
            ...pagination,
            current,
            pageSize
          })
        }}
        scroll={props.scroll}
      />
    </>
  )
})

export default ProTable
