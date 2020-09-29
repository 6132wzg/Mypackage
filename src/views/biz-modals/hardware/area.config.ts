export const ruleOptions = (vm: any) => {
  return {
    area_id: {},
    people_type: {
      rules: [
        {
          required: true,
          message: '请选择人员范围'
        }
      ]
    },

    course_time: {
      rules: [
        {
          required: true,
          message: '请输入时间'
        }
      ]
    },
    leave_limit: {
      // initialValue: vm.leave_limit
    },
    checkin: {},
    white_list: {
      // initialValue: vm.white_list,
      rules: [
        {
          required: true,
          message: '请选择指定员工'
        }
      ]
    },
    /**
     * 次卡扣费规则
     */
    charge_type: {},
    /**
     * 次卡扣费规则-时间间隔
     */
    charge_value: {},
    /**
     *  是否仅允许在此区域约课的用户入场
     */
    is_course: {}
  }
}

export const formItemSwitches = (vm: any) => {
  const { NORMAL, VIP, GATE, VENUES } = vm.ENTRY
  const { area_type } = vm.info
  if (!area_type) {
    return {}
  }
  return {
    /**
     * 进入人员范围
     */
    entrancePeopleType: [NORMAL, VIP, GATE, VENUES].includes(area_type.id),
    /**
     * 离场限制
     * 普通区域、VIP区域、大门
     */
    exitanceRestriction: [NORMAL, VIP, GATE].includes(area_type.id),
    /**
     * 约课入场限制
     * 普通区域、VIP区域、大门
     */
    courseEntranceRestriction: [NORMAL, VIP].includes(area_type.id),
    /**
     * 入场签课
     * 普通区域、VIP区域
     */
    entranceCheckIn: [NORMAL, VIP].includes(area_type.id),
    /**
     * 次卡扣费规则
     * 普通区域、VIP区域
     */
    timesCardRule: [NORMAL, VIP, GATE].includes(area_type.id),
    /**
     * 进入区域限制
     * 普通区域、VIP区域
     */
    entranceRestriction: [NORMAL, VIP].includes(area_type.id),
    /**
     * 预约限制
     * 大门
     */
    gateOrderRestriction: [GATE].includes(area_type.id),
    /**
     * 场地预约限制
     * 场地预约
     */
    venueOrderRestriction: [VENUES].includes(area_type.id)
  }
}

export const alertMsg = (vm: any) => {
  const { NORMAL, VIP, GATE, VENUES } = vm.ENTRY
  const { area_type } = vm.info
  if (!area_type) {
    return ''
  }
  return {
    [NORMAL]: `1.支持进入此区域的凭证范围：预约团体课、预约小班课、期限卡、次卡 （仅指用户）
    2.无法在会员卡入场范围进行勾选限定`,
    [VIP]: `1.支持进入此区域的凭证范围：预约团体课、预约小班课、期限卡、次卡 （仅指用户）
    2.可在【售卡管理】或【上架会员卡】时，进行允许入场VIP区域选择`,
    [GATE]: `支持进入此区域的凭证范围:预约到访、预约私教课、预约团体课、预约私教小团课、预约小班课、场地预约、期限卡、次卡 （仅指用户）`,
    [VENUES]: `此区域类型来源于【应用】-【场地预约】`
  }[area_type.id]
}

export const timesCardRules = (vm: any) => {
  const cardRules = vm.info.entrance_enum
  const ret = <any>[]
  Object.keys(cardRules).forEach(key => {
    ret.push({
      label: cardRules[key],
      value: +key
    })
  })
  return ret
}
