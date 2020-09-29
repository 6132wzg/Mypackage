import moment from 'moment'
export const ruleOptions = (vm: any) => {
  return {
    personal_num: {
      rules: [
        {
          validator: (rule: any, value: any) => {
            const remain = vm.info.personal_course_remain
            if (!value.toString().length) {
              return '请输入私教课扣次'
            }
            if (value > remain) {
              return `不能超过${remain}次`
            }
          }
        }
      ]
    },
    deduction_time: {
      rules: [{ required: true, message: '请输入扣次时间' }],
      initialValue: moment()
    },
    content: {}
  }
}
