import moment from 'moment'
export const ruleOptions = (vm: any) => {
  return {
    sale_date: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请填写售卖时间'
            }
            if (moment(value[1]) < moment()) {
              return '支持售卖时间已过，请重新编辑时间'
            }
          }
        }
      ],
      initialValue: [vm.info$.sale_start_time, vm.info$.sale_end_time]
    }
  }
}
