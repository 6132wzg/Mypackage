export const ruleOptions = (vm: any) => {
  const pattern = vm.pattern
  return {
    effective_way: {
      initialValue: 1
    },
    team_times: {
      initialValue: vm.newPackageInfo$.team_times
    },
    personal_times: {
      initialValue: vm.newPackageInfo$.personal_times
    },
    total_times: {
      initialValue: vm.newPackageInfo$.total_times
    },
    deduction_amount: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (value === undefined || value === '') {
              return '请填写升级抵扣'
            }
            if (+value > vm.newPackageInfo$.sell_price) {
              return '输入的升级抵扣不能大于售卖价格'
            }
          }
        }
      ]
    },
    sale_id: {
      rules: [{ required: true, message: '请选择销售人员' }]
    },
    valid_days: {
      initialValue: vm.newPackageInfo$.valid_time
    },
    productId: {
      initialValue: undefined,
      rules: [{ required: true, message: '请选择课程包' }]
    }
  }
}
