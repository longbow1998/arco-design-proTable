import React, {
  ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useState
} from "react"
import {
  AutoComplete,
  Button,
  Form,
  Grid,
  Input,
  InputNumber,
  Select,
  Space,
  TreeSelect
} from "@arco-design/web-react"
import cs from "classnames"
import style from "./index.module.less"
import { IconRefresh, IconSearch } from "@arco-design/web-react/icon"
import { ProTableColumnProps } from "../../type/proTable.type"
import { DatePicker } from "@arco-design/web-react"
const { RangePicker } = DatePicker

const { Row, Col } = Grid

interface Props<T> {
  search: (values, search: boolean) => void
  columns: Array<ProTableColumnProps<T>>
  actionBarRender: ReactNode[]
  toolBarRender: ReactNode[]
  hideResetButton?: boolean
}

const TableExpand = forwardRef<unknown, Props<Record<string, any>>>(
  (props, ref) => {
    const [form] = Form.useForm()

    const [hasSearch, setHasSearch] = useState(false)

    const submit = useCallback(
      values => {
        Object.entries(values).forEach(([key, value]) => {
          // 包含，说明是时间范围
          if (key.includes(",") && value) {
            const [start, end] = key.split(",")
            values[start] = value[0]
            values[end] = value[1]
            delete values[key]
          }
        })
        props.search(values, true)
      },
      [form.getFieldsValue()]
    )

    function reset() {
      form.resetFields()
      props.search({}, true)
    }

    useImperativeHandle(ref, () => ({
      reset: () => reset(),
      submit: () => {
        const timer = setInterval(() => {
          if (Object.keys(form.getFieldsValue())) {
            submit(form.getFieldsValue())
            clearInterval(timer)
          }
        }, 100)
      }
    }))

    useLayoutEffect(() => {
      if (props.columns) {
        for (const column of props.columns) {
          if (column.search) {
            setHasSearch(true)
            return
          }
        }
        props.columns.flatMap(item => {
          item.search
        })
      }
    }, [props.columns])

    return (
      <>
        {hasSearch && (
          <Form
            form={form}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            labelAlign="right"
            onSubmit={submit}>
            <div className={style["table-form"]}>
              <div className={style["search-left"]}>
                <Row gutter={6}>
                  {props.columns.flatMap(item => {
                    if (item.search) {
                      if (!item.valueType || item.valueType === "text") {
                        return (
                          <Col
                            span={8}
                            key={item.dataIndex}>
                            <Form.Item
                              label={item.title}
                              field={item.dataIndex}
                              initialValue={item.initialValue}>
                              <Input
                                maxLength={20}
                                allowClear
                                {...item.fieldProps}
                              />
                            </Form.Item>
                          </Col>
                        )
                      } else if (item.valueType === "number") {
                        return (
                          <Col
                            span={8}
                            key={item.dataIndex}>
                            <Form.Item
                              label={item.title}
                              field={item.dataIndex}>
                              <InputNumber
                                maxLength={20}
                                {...item.fieldProps}
                              />
                            </Form.Item>
                          </Col>
                        )
                      } else if (item.valueType === "select") {
                        return (
                          <Col
                            span={8}
                            key={item.dataIndex}>
                            <Form.Item
                              label={item.title}
                              field={item.dataIndex}>
                              <Select
                                allowClear
                                {...item.fieldProps}
                              />
                            </Form.Item>
                          </Col>
                        )
                      } else if (item.valueType === "treeSelect") {
                        return (
                          <Col
                            span={8}
                            key={item.dataIndex}>
                            <Form.Item
                              label={item.title}
                              field={item.dataIndex}>
                              <TreeSelect {...item.fieldProps} />
                            </Form.Item>
                          </Col>
                        )
                      } else if (item.valueType === "date") {
                        return (
                          <Col
                            span={8}
                            key={item.dataIndex}>
                            <Form.Item
                              label={item.title}
                              field={item.dataIndex}>
                              <RangePicker
                                {...item.fieldProps}
                                // showTime={{
                                //   defaultValue: ["00:00:00", "00:00:00"],
                                //   format: "HH:mm"
                                // }}
                                // format="YYYY-MM-DD HH:mm:ss"
                              />
                            </Form.Item>
                          </Col>
                        )
                      } else if (item.valueType === "autoComplete") {
                        return (
                          <Col
                            span={8}
                            key={item.dataIndex}>
                            <Form.Item
                              label={item.title}
                              field={item.dataIndex}>
                              <AutoComplete {...item.fieldProps} />
                            </Form.Item>
                          </Col>
                        )
                      }
                    }
                  })}
                </Row>
              </div>

              <div className={style["search-right"]}>
                <Button
                  type="primary"
                  icon={<IconSearch />}
                  onClick={() => form.submit()}>
                  查询
                </Button>

                {!props.hideResetButton && (
                  <Button
                    icon={<IconRefresh />}
                    onClick={reset}>
                    重置
                  </Button>
                )}
              </div>
            </div>
          </Form>
        )}
        <div
          className={cs(style["option"], {
            [style["option_border"]]: hasSearch
          })}>
          <Space>{props.toolBarRender}</Space>
          <Space>{props.actionBarRender}</Space>
        </div>
      </>
    )
  }
)

export default TableExpand
