import moment from 'moment'
export const ruleOptions = (vm: any) => {
  return {
    valid_end_time: {
      rules: [
        { required: true, message: '请输入到期时间' },
        {
          validator: (rule: any, value: any, values: any) => {
            if (value > moment(vm.packageInfo$.end_time)) {
              return '修改的时间不能大于到期时间'
            }
            if (value < moment()) {
              return '修改的时间不能小于当天时间'
            }
          }
        }
      ]
    },
    content: {}
  }
}
