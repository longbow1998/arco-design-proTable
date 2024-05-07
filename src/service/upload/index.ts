import http from ".."
import { UploadImgResponse } from "./index.type"

/**上传照片 */
export function uploadImg(formData: FormData): Service<UploadImgResponse> {
  return http.post("/api/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}
