export const ruleOptions = (vm: any) => {
  return {
    support_num: {
      initialValue: 0,
      rules: [
        {
          validator: (filed, value) => {
            if (vm.switches.supportNum) {
              if (value === undefined || !value.toString().length) {
                return '请输入支持入场人数'
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
    },
    reserve_limit_day: {
      initialValue: 1
    },
    reserve_limit_times: {
      rules: [
        {
          validator: (filed, value) => {
            if (
              vm.switches.reserveSetting &&
              vm.info.reserve.reserve_is_limit
            ) {
              if (value === undefined || !value.toString().length) {
                return '请填写约课限制节数'
              }
            }
          }
        }
      ]
    }
  }
}
