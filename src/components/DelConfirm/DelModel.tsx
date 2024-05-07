import { Form, Input, Message, Modal } from "@arco-design/web-react"
import React, { useState } from "react"

function DelConfirmModal(
  props: Readonly<{
    reqDel: (unknown) => Service
    visible: boolean
    close: () => void
    params: Record<string, string>
    reload: () => void
  }>
) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  async function onOk() {
    setLoading(true)
    form
      .validate()
      .then(async () => {
        const res = await props.reqDel(props.params)
        if (res.code === 0) {
          Message.success(res.message)
          props.close()
          form.resetFields()
          props.reload()
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Modal
      title="删除确认"
      visible={props.visible}
      onCancel={props.close}
      confirmLoading={loading}
      onOk={onOk}>
      <Form form={form}>
        <Form.Item
          label="删除确认"
          field="confirm"
          rules={[
            {
              validator(value, callback) {
                if (value !== "删除") {
                  callback("请输入 删除")
                } else {
                  callback()
                }
              }
            }
          ]}>
          <Input placeholder="请输入 删除 以确认删除" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DelConfirmModal
