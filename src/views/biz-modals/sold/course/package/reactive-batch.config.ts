export const ruleOptions = (vm: any) => {
  return {
    extend_days: {
      rules: [
        { required: true, message: '请输入延长天数' },
        {
          validator: (rule: any, value: any, values: any) => {
            if (value > 999) {
              return '延期不能超过999天'
            }
          }
        }
      ]
    },
    content: {}
  }
}
