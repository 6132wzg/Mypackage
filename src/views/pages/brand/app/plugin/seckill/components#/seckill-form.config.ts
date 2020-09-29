import moment from 'moment'
export const ruleOptions = (vm: any) => {
  return {
    activity_name: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请输入活动名称'
            }
          }
        }
      ]
    },
    dateRange: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            console.log('活动时间校验')
            if (!vm.formValue.start_time || !vm.formValue.end_time) {
              return '请设置活动时间'
            }
            if (
              moment(vm.formValue.end_time).valueOf() -
                moment(vm.formValue.start_time).valueOf() >
              180 * 24 * 60 * 60 * 1000
            ) {
              return '活动时长不能超过180天'
            }
          }
        }
      ]
    },
    stock_num: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            console.log('库存校验')
            if (vm.formValue.is_limit_stock === 1 && !value) {
              return '限定库存不能小于1'
            }
          }
        }
      ]
    },
    buy_num: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            console.log('购买校验')
            if (vm.formValue.is_limit_buy === 1 && !value) {
              return '请设置单人购买笔数'
            }
          }
        }
      ]
    },
    spike_time: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            console.log('秒杀时间校验')
            if (
              vm.formValue.is_virtual_spike === 1 &&
              (!vm.formValue.virtual_spike_time ||
                moment(vm.formValue.virtual_spike_time).valueOf() <=
                  moment(vm.formValue.start_time).valueOf() ||
                moment(vm.formValue.virtual_spike_time).valueOf() >=
                  moment(vm.formValue.end_time).valueOf())
            ) {
              return '秒杀时间必须在活动时间范围内'
            }
          }
        }
      ]
    }
  }
}
