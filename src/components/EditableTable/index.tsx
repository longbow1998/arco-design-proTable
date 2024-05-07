import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback
} from "react"
import {
  Button,
  Table,
  Input,
  Form,
  FormInstance,
  TableColumnProps
} from "@arco-design/web-react"
const FormItem = Form.Item
const EditableContext = React.createContext<{ getForm?: () => FormInstance }>(
  {}
)

function EditableRow(props) {
  const { children, record, className, ...rest } = props
  const refForm = useRef(null)

  const getForm = () => refForm.current

  return (
    <EditableContext.Provider
      value={{
        getForm
      }}>
      <Form
        style={{ display: "table-row" }}
        // eslint-disable-next-line react/no-children-prop
        children={children}
        ref={refForm}
        wrapper="tr"
        wrapperProps={rest}
      />
    </EditableContext.Provider>
  )
}

function EditableCell(props) {
  const { children, className, rowData, column, onHandleSave } = props
  const ref = useRef(null)
  const refInput = useRef(null)
  const { getForm } = useContext(EditableContext)
  const [editing, setEditing] = useState(false)
  const handleClick = useCallback(
    e => {
      if (
        editing &&
        column.editable &&
        ref.current &&
        !ref.current.contains(e.target) &&
        !e.target.classList.contains("js-demo-select-option")
      ) {
        cellValueChangeHandler(rowData[column.dataIndex])
      }
    },
    [editing, rowData, column]
  )
  useEffect(() => {
    editing && refInput.current && refInput.current.focus()
  }, [editing])
  useEffect(() => {
    document.addEventListener("click", handleClick, true)
    return () => {
      document.removeEventListener("click", handleClick, true)
    }
  }, [handleClick])

  const cellValueChangeHandler = value => {
    const form = getForm()
    form.validate([column.dataIndex], (errors, values) => {
      if (!errors || !errors[column.dataIndex]) {
        setEditing(!editing)
        onHandleSave && onHandleSave({ ...rowData, ...values })
      }
    })
  }

  if (editing) {
    return (
      <div ref={ref}>
        <FormItem
          style={{ marginBottom: 0 }}
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          initialValue={rowData[column.dataIndex]}
          field={column.dataIndex}
          rules={[
            {
              required: column.dataIndex === "name" ? true : false,
              message: column.dataIndex === "name" ? "名字是必填项" : undefined
            }
          ]}>
          <Input
            ref={refInput}
            onPressEnter={cellValueChangeHandler}
          />
        </FormItem>
      </div>
    )
  }

  return (
    <div
      className={column.editable ? `editable-cell ${className}` : className}
      onClick={() => {
        column.editable && setEditing(!editing)
      }}>
      {children ? children : "-"}
    </div>
  )
}

function EditableTable(props: {
  data?: Array<Record<string, any>>
  onChange?: (data: Array<Record<string, any>>) => void
  columns: Array<TableColumnProps<Record<string, any>> & { editable?: true }>
}) {
  const [data, setData] = useState([])

  function handleSave(row) {
    const newData = [...data]
    const index = newData.findIndex(item => row.key === item.key)
    newData.splice(index, 1, { ...newData[index], ...row })
    setData(newData)
  }

  function addRow() {
    setData(
      [...data].concat({
        key: Math.random() * 1000,
        name: "",
        phone: ""
      })
    )
  }

  // 动态处理columns，确保删除操作基于最新的data
  const renderedColumns = React.useMemo(() => {
    const originalColumns = [...props.columns]

    // 假设原始columns中没有操作列，我们在这里添加
    if (!originalColumns.some(col => col.dataIndex === "option")) {
      originalColumns.push({
        title: "操作",
        dataIndex: "option",
        render: (_, record) => (
          <Button
            onClick={() => {
              setData(prevData =>
                prevData.filter(item => item.key !== record.key)
              )
            }}
            type="primary"
            status="danger">
            删除
          </Button>
        )
      })
    }

    return originalColumns
  }, [data]) // 注意这里的依赖项，确保当data变化时重新计算columns

  useEffect(() => {
    if (!data.length && props.data && props.data.length) {
      setData(
        props.data.map(item => {
          return {
            ...item,
            key: item.key ? item.key : Math.random() * 1000
          }
        })
      )
    }
  }, [props.data])

  useEffect(() => {
    props.onChange(data)
  }, [data])

  return (
    <>
      <Button
        style={{ marginBottom: 10 }}
        type="primary"
        onClick={addRow}>
        添加
      </Button>
      <Table
        rowKey="name"
        pagination={false}
        data={data}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell
          }
        }}
        columns={renderedColumns.map(column =>
          column.editable
            ? {
                ...column,
                onCell: () => ({
                  onHandleSave: handleSave
                })
              }
            : column
        )}
      />
    </>
  )
}

export default EditableTable
