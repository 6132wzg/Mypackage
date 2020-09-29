import moment from 'moment'
export const ruleOptions = (vm: any) => {
  return {
    end_time: {
      rules: [{ required: true, message: '请选择到期日期' }],
      initialValue: moment()
    },
    description: {}
  }
}
