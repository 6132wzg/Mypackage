import moment from 'moment'
export const ruleOptions = (vm: any) => {
  return {
    personal_num: {
      rules: [
        {
          validator: (rule: any, value: any, values: any) => {
            if (+vm.teamCount === 0 && !value) {
              return '请输入私教课扣次'
            }
          }
        }
      ]
    },
    team_num: {
      rules: [
        {
          validator: (rule: any, value: any, values: any) => {
            if (+vm.personalCount === 0 && !value) {
              return '请输入团课扣次'
            }
          }
        }
      ]
    },
    total_num: {
      rules: [
        {
          validator: (rule: any, value: any, values: any) => {
            if (+vm.totalCount === 0 && !value) {
              return '请输入团课&私教课扣次'
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
