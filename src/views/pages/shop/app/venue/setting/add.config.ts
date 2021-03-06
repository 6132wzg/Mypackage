export const ruleOptions = (vm: any) => {
  return {
    time_limit_start: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请选择开始时间'
            }
          }
        }
      ]
    },
    time_limit_end: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请选择结束时间'
            }
          }
        }
      ]
    },
    time_limit_type: {
      initialValue: 1
    },
    cyclic_type: {
      initialValue: 1
    },
    week_day: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请选择自定义时间'
            }
          }
        }
      ]
    },
    open_time_start: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请选择开始时间'
            }
          }
        }
      ]
    },
    open_time_end: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请选择结束时间'
            }
          }
        }
      ]
    },
    can_reserve: {
      initialValue: 1
    },
    weight: {
      initialValue: 1
    },
    price: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请填写价格'
            }
          }
        }
      ]
    }
  }
}
