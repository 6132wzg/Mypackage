export const ruleOptions = (vm: any) => {
  return {
    templateName: {
      rules: [{ required: true, message: '请输入课程名' }]
    },
    maxNumber: {
      rules: [{ required: false }]
    },
    dateTime: {
      rules: [{ required: true, message: '请选择起止时间' }]
    },
    reserve_limit_type: {
      initialValue: 0
    },
    reserve_limit_date: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (
              values.reserve_limit_type === vm.RESERVE_LIMIT_TYPE.DATE &&
              !value
            ) {
              return '请选择定时开放预约时间'
            }
          }
        }
      ]
    },
    reserve_limit_time: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (
              values.reserve_limit_type === vm.RESERVE_LIMIT_TYPE.TIME &&
              !value
            ) {
              return '请输入小时'
            }
          }
        }
      ]
    }
  }
}
