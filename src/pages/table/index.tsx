import CButtonGroup from "@/components/ButtonGroup"
import DelConfirm from "@/components/DelConfirm/DelPopconfirm"
import ProTable from "@/components/ProTable"
import { ProTableColumnProps } from "@/components/ProTable/type/proTable.type"
import { query, enable, disable, remote } from "@/pages/table/service"
import { QueryResponse } from "@/pages/table/service/index.type"
import { Button, Card, Message, Tag } from "@arco-design/web-react"
import {
  IconDelete,
  IconEdit,
  IconLock,
  IconUnlock
} from "@arco-design/web-react/icon"
import React, { useRef } from "react"
import { exportFile } from "js-xxx"

function Table() {
  const ref = useRef<{ reload: () => void }>()
  return (
    <Card title="搜索参数查看控制台">
      <ProTable
        ref={ref}
        request={query}
        columns={
          [
            { title: "关键词", dataIndex: "keyword", hide: true, search: true },
            { title: "ID", dataIndex: "id", sorter: true },
            { title: "名字", dataIndex: "name" },
            {
              title: "年龄",
              dataIndex: "age",
              search: true,
              valueType: "number"
            },
            {
              title: "地址",
              dataIndex: "address",
              search: true,
              valueType: "select",
              fieldProps: {
                options: [
                  {
                    label: "北京",
                    value: "beijing"
                  },
                  {
                    label: "上海",
                    value: "shanghai"
                  }
                ]
              }
            },
            {
              title: "在职状态",
              dataIndex: "status",
              render(_col, item) {
                if (item.status === 1) {
                  return <Tag color="green">启用</Tag>
                } else {
                  return <Tag color="red">禁用</Tag>
                }
              }
            },
            {
              title: "入职时间",
              dataIndex: "job_time"
            },
            {
              title: "入职时间",
              dataIndex: "job_start_time,job_end_time",
              hide: true,
              search: true,
              valueType: "date"
            },
            {
              title: "分组",
              dataIndex: "group",
              search: true,
              valueType: "autoComplete",
              fieldProps: {
                data: ["前端", "后端", "算法", "测试", "安全"]
              }
            },
            {
              title: "操作",
              dataIndex: "option",
              render: (_, item) => (
                <CButtonGroup>
                  <Button
                    type="text"
                    onClick={() => {
                      Message.success("点击了编辑")
                    }}>
                    <IconEdit />
                    编辑
                  </Button>
                  {item.status === 0 ? (
                    <Button
                      type="text"
                      onClick={async () => {
                        const res = await enable(item.uuid)
                        if (res.code === 0) {
                          ref.current.reload()
                        }
                      }}>
                      <IconUnlock />
                      启用
                    </Button>
                  ) : (
                    <Button
                      type="text"
                      onClick={async () => {
                        const res = await disable(item.uuid)
                        if (res.code === 0) {
                          ref.current.reload()
                        }
                      }}>
                      <IconLock />
                      禁用
                    </Button>
                  )}
                  <DelConfirm
                    reqDel={remote}
                    params={{ uuid: item.uuid }}
                    reload={() => ref.current.reload()}>
                    <Button type="text">
                      <IconDelete />
                      删除
                    </Button>
                  </DelConfirm>
                </CButtonGroup>
              )
            }
          ] as ProTableColumnProps<QueryResponse & ResponseDefault>[]
        }
        actionBarRender={[
          <Button
            type="primary"
            key="refresh"
            onClick={() => ref.current.reload()}>
            刷新
          </Button>,
          <Button
            type="primary"
            key="export"
            onClick={() => {
              exportFile(
                document.getElementsByTagName("table")[0].outerHTML,
                "tableExcel",
                "xls"
              )
            }}>
            导出
          </Button>
        ]}
        toolBarRender={[
          <Button
            type="primary"
            onClick={() => {
              Message.success("点击创建")
            }}
            key="create">
            创建
          </Button>
        ]}
      />
    </Card>
  )
}

export default Table
