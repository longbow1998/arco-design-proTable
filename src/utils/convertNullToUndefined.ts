/**
 * null转为undefined
 * 防止提交后端返回的null
 */
function convertNullToUndefined<T>(data: T): T {
  if (data === null || typeof data !== "object") {
    return
  }

  const newData = JSON.parse(JSON.stringify(data))
  for (const key in newData) {
    if (newData[key] === null) {
      newData[key] = undefined
    }
  }

  return newData
}

export default convertNullToUndefined
