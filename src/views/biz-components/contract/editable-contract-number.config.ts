export const ruleOptions = (vm: any) => {
  return {
    contract_number: {
      rules: [
        {
          validator: (filed: any, value: any) => {
            if (!value) {
              return '请输入合同编号'
            }
            if (value.length < 6 || value.length > 24) {
              return '请输入6-24位合同编号'
            }
          }
        }
      ]
    }
  }
}
