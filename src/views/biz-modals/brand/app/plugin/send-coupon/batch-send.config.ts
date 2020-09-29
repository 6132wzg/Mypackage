export const ruleOptions = (vm: any) => {
  const pattern = vm.pattern
  return {
    type: {
      initialValue: 1,
      rules: [
        {
          required: true,
          message: '请选择接收对象'
        }
      ]
    },
    send_value: {}
  }
}
