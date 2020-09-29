export const ruleOptions = (vm: any) => {
  return {
    venues_reserve_start: {},
    venues_reserve_end: {},
    venues_cancel_limit: {},
    venues_is_miss_punish: {
      valuePropName: 'checked'
    },
    miss_punish_day: {
      rules: [
        {
          validator: (fileds: any, value: any, values: any) => {
            if (values.venues_is_miss_punish && !value) {
              return '请输入天数'
            }
          }
        }
      ]
    },
    miss_punish_number: {
      rules: [
        {
          validator: (fileds: any, value: any, values: any) => {
            if (values.venues_is_miss_punish && !value) {
              return '请输入次数'
            }
          }
        }
      ]
    },
    miss_punish_limit: {
      rules: [
        {
          validator: (fileds: any, value: any, values: any) => {
            if (values.venues_is_miss_punish && !value) {
              return '请输入天数'
            }
          }
        }
      ]
    }
  }
}
