export const ruleOptions = (vm: any) => {
  return {
    shop_ids: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (value === undefined || !value.length) {
              return '请选择下架门店'
            }
          }
        }
      ]
    },
    reason: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请填写下架原因'
            }
          }
        }
      ]
    }
  }
}
