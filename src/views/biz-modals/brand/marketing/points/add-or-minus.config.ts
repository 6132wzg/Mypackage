export const ruleOptions = type => (vm: any) => {
  const pattern = vm.pattern
  const typeName = ['add-by-batch', 'minus-by-batch'].includes(type)
    ? '扣减积分'
    : '添加积分'
  return {
    points: {
      rules: [
        {
          validator: (filed: any, value: any, values: any) => {
            if (!value) {
              return `请填写${typeName}`
            }
            if (value > 99999) {
              return `${typeName}最大99999`
            }
          }
        }
      ]
    },
    remark: {}
  }
}
