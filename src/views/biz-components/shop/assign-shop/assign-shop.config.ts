export const ruleOptions = (vm: any) => {
  return {
    [vm.formItemKey]: {
      initialValue: vm.shopIds || [],
      rules: [
        {
          validator: (filed, value) => {
            if (
              !vm.disabled &&
              vm.currentType === vm.MULTI_SHOP &&
              !value.length
            ) {
              return `请选择${vm.label}`
            }
          }
        }
      ]
    }
  }
}
