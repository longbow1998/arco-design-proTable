import { Space, Button, Popover } from "@arco-design/web-react"
import { IconMore } from "@arco-design/web-react/icon"
import React from "react"

export default function CButtonGroup({ children }) {
  if (!Array.isArray(children)) return <Space>{children}</Space>
  if (children.length < 3) {
    return <Space>{children}</Space>
  } else {
    return (
      <Space>
        {children.slice(0, 2)}
        <Popover
          position="bottom"
          content={<Space direction="vertical">{children.slice(2)}</Space>}>
          <Button
            type="text"
            icon={<IconMore />}
          />
        </Popover>
      </Space>
    )
  }
}
