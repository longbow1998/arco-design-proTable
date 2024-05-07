import React, { useEffect, useState } from "react"
import "@wangeditor/editor/dist/css/style.css"
import { Editor, Toolbar } from "@wangeditor/editor-for-react"

import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor"
import { uploadImg } from "@/service/upload"
import { Message } from "@arco-design/web-react"

type InsertFnType = (url: string, poster: string) => void

function MyEditor(props: {
  html?: string
  getContent?: (html: string) => void
}) {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  // 编辑器内容
  const [html, setHtml] = useState(props.html)

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: ["group-video"]
  }
  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    MENU_CONF: {
      uploadImage: {
        async customUpload(file: File, insertFn: InsertFnType) {
          const formData = new FormData()
          formData.append("file", file)
          formData.append(
            "token",
            JSON.parse(localStorage.getItem("token")).token
          )
          const apiUrl = import.meta.env.VITE_API_URL
          const baseUrl = apiUrl.replace("/api", "")
          try {
            const res = await uploadImg(formData)
            if (res.code === 0) {
              insertFn(baseUrl + res.data.path, "img")
            } else {
              throw new Error(res.message)
            }
          } catch (err) {
            console.error(err.message)
            Message.error(err.message)
          }
        }
      }
    }
  }

  useEffect(() => {
    if (html !== props.html) {
      setHtml(props.html)
    }
  }, [props.html])

  useEffect(() => {
    props.getContent(html)
  }, [html])

  // 及时销毁editor
  useEffect(() => {
    return () => {
      if (editor === null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <>
      <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={editor => setHtml(editor.getHtml())}
          mode="default"
          style={{ height: "500px", overflowY: "hidden" }}
        />
      </div>
    </>
  )
}

export default MyEditor
