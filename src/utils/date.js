import moment from 'moment'

export const momentPlus = {
  _defaultOpts: {
    baseDate: new Date(),
    limit: {
      num: 5,
      unit: 'years'
    }
  },
  _calc(num, unit, opts, action = 'add') {
    opts = Object.assign(this._defaultOpts, opts)
    num = +num || 0
    const { baseDate, limit } = opts
    const mathAction = action === 'add' ? 'min' : 'max'
    let date = moment(baseDate)[action](num, unit)
    /**
     * 处理异常日期 NaN
     */
    if (!+date) {
      date = moment()
    }
    return moment(
      Math[mathAction](date, moment(baseDate)[action](limit.num, limit.unit))
    )
  },
  /**
   * 计算日期边界值
   * 包含容错处理（invalid date）
   * 参考 moment.add
   * @param baseDate 基础日期
   * @param num 操作数量
   * @param unit 操作数量对应的单位
   */
  add(num, unit, opts) {
    return this._calc(num, unit, opts, 'add')
  },
  /**
   * 计算日期边界值
   * 包含容错处理（invalid date）
   * 参考 moment.subtract
   * @param baseDate 基础日期
   * @param num 操作数量
   * @param unit 操作数量对应的单位
   */
  subtract(num, unit, opts) {
    return this._calc(num, unit, opts, 'subtract')
  }
}
