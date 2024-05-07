function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, g => g[1].toUpperCase())
}

/**下划线转驼峰的方法 */
export default function convertKeysToCamelCase(
  obj: Record<string, unknown>
): Record<string, unknown> {
  const newObj: Record<string, unknown> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = toCamelCase(key)
      newObj[newKey] = obj[key]
    }
  }
  return newObj
}
