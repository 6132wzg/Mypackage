export const ruleOptions = (vm: any) => {
  return {
    gift_remain: {
      rules: [
        {
          validator: (filed, value) => {
            if (vm.switches.givingTime) {
              if (value === undefined || !value.toString().length) {
                return '请输入剩余可赠送额度'
              }
            }
          }
        }
      ]
    },
    frozen_time_remain: {
      initialValue: 0,
      rules: [
        {
          validator: (filed, value) => {
            console.log('validator', value)
            if (vm.switches.frozenTime) {
              if (value === undefined || !value.toString().length) {
                return '请输入剩余可冻结时长'
              }
            }
          }
        }
      ]
    },
    transfer_num: {
      rules: [
        {
          validator: (filed, value) => {
            if (
              vm.switches.transferSetting &&
              vm.info.transfer.is_transferable &&
              !value.toString().length
            ) {
              return '请输入转让手续费'
            }
          }
        }
      ]
    },
    transfer_unit: {
      initialValue: 1,
      rules: [
        {
          validator: (filed, value) => {
            if (
              vm.switches.transferSetting &&
              vm.info.transfer.is_transferable &&
              !value.toString().length
            ) {
              return '请选择转让手续费单位'
            }
          }
        }
      ]
    }
  }
}
