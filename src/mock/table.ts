import Mock from "mockjs"
import setupMock from "@/utils/setupMock"

const TableList = [
  {
    uuid: "1",
    id: 1,
    created_at: "2024-05-01 00:00:00",
    updated_at: null,
    name: "wang",
    age: 18,
    address: "beijing",
    job_time: "2024-01-01 08:00:00",
    group: "前端",
    status: 1
  }
]
const getTableList = () => {
  return {
    code: 0,
    message: "请求成功",
    data: {
      page: 1,
      pageSize: 20,
      total: TableList.length,
      totalPage: 1,
      pageData: TableList
    }
  }
}

setupMock({
  setup: () => {
    Mock.mock(new RegExp("/api/table/query"), params => {
      console.log(params)
      return getTableList()
    })

    Mock.mock(new RegExp("/api/table/enable"), params => {
      return {
        code: 0,
        message: "启用成功"
      }
    })

    Mock.mock(new RegExp("/api/table/disable"), params => {
      return {
        code: 0,
        message: "禁用成功"
      }
    })

    Mock.mock(new RegExp("/api/table/delete"), params => {
      return {
        code: 0,
        message: "删除成功"
      }
    })
  }
})
