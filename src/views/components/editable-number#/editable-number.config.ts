export const ruleOptions = (vm: any) => {
  return {
    [`${vm.key}`]: {
      rules: [
        {
          validator: () => {
            if (vm.isEdit) {
              return '请点击确定'
            }
          }
        }
      ]
    }
  }
}
