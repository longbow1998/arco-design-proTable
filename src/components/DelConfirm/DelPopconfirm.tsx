import { Message, Popconfirm } from "@arco-design/web-react"
import React, { ReactNode } from "react"

function DelConfirm(
  props: Readonly<{
    reqDel: (unknown) => Service
    params: Record<string, string> | string
    reload: () => void
    children: ReactNode
    title?: string
    content?: string
  }>
) {
  async function onOk() {
    const res = await props.reqDel(props.params)
    if (res.code === 0) {
      Message.success(res.message)
      props.reload()
    }
  }

  return (
    <Popconfirm
      focusLock
      title={props.title ?? "删除确认"}
      content={props.content ?? "确认删除吗?"}
      onOk={onOk}>
      {props.children}
    </Popconfirm>
  )
}

export default DelConfirm
