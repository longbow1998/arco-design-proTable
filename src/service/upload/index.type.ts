import { UploadItem } from "@arco-design/web-react/es/Upload"

export interface UploadImgResponse {
  name: string
  path: string
  ext: string
  mimeType: string
  size: number
  sizeByUnit: string
  width: number
  height: number
  type: string
  original: {
    fileName: string
    tempPath: string
    ext: string
    mimeType: string
  }
  hash: string
}

/**arco Upload组件返回类型 */
export type UploadFileList = Array<
  Omit<UploadItem, "response"> & {
    response: Awaited<Service<UploadImgResponse>>
  }
>
