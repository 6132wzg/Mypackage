/**
 * js 类型判断，可判断13种类型，
 * (number, string, boolean, undefined, function, null, object, array, date, error, regexp, json, math)
 * 注意：NaN 输出类型 为 number
 * @param {any} val
 */

export const typeOf = val => {
  return Object.prototype.toString
    .call(val)
    .slice(8, -1)
    .toLocaleLowerCase()
}
