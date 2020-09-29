export const ruleOptions = (vm: any) => {
  return {
    transfer_num: {
      rules: [
        {
          validator: (filed, value) => {
            if (vm.info.transfer.is_transferable && !value.toString().length) {
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
            if (vm.info.transfer.is_transferable && !+value) {
              return '请选择转让手续费单位'
            }
          }
        }
      ]
    }
  }
}
