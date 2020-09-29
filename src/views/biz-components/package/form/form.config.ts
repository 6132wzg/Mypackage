import moment from 'moment'
export const ruleOptions = (vm: any) => {
  return {
    course_name: {
      rules: [
        {
          required: true,
          message: '请填写课程包名称'
        }
      ],
      initialValue: vm.initInfo.course_name
    },
    is_limit: {
      initialValue: vm.initInfo.is_limit === 0 ? 0 : 1
    },
    course_range: {
      initialValue: vm.initInfo.course_range || 1
    },
    reserve_is_limit: {
      initialValue: vm.initInfo.reserve_is_limit
        ? [vm.initInfo.reserve_is_limit]
        : []
    },
    is_permanent_sale: {
      initialValue: vm.initInfo.is_permanent_sale === 0 ? 0 : 1
    },
    sale_time: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value[0]) {
              return '请填写开始售卖时间'
            }
            if (!value[1]) {
              return '请填写结束售卖时间'
            }
            if (value.filter(Boolean).length === 0) {
              return '请填写售卖时间'
            }
          }
        }
      ],
      initialValue:
        vm.initInfo.start_time && vm.initInfo.is_permanent_sale === 0
          ? [moment(vm.initInfo.start_time), moment(vm.initInfo.end_time)]
          : [null, null]
    },
    reserve_limit_day: {
      initialValue: vm.initInfo.reserve_limit_day || 1
    },
    reserve_limit_times: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!values.reserve_is_limit.length) return
            if (value === undefined || value === '') {
              return '请填写约课限制节数'
            }
          }
        }
      ],
      initialValue: vm.initInfo.reserve_limit_times
    },
    team_total_price: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请填写团课总售价'
            }
          }
        }
      ],

      initialValue: vm.initInfo.team_total_price
    },
    personal_total_price: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请填写私教课总售价'
            }
          }
        }
      ],
      initialValue: vm.initInfo.personal_total_price
    },
    support_num: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (value === undefined || value === '') {
              return '请输入支持使用人数'
            }
            if (value > 20) {
              return '支持使用人数不能超过20人'
            }
          }
        }
      ],
      initialValue: vm.initInfo.support_num
    },
    price: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (value === undefined || value === '') {
              return '请填写售卖价格'
            }
            if (value && !vm.pattern.NUM_FLOAT(1).test(value)) {
              return '输入的售卖价格错误，请重新输入'
            }
          }
        }
      ],
      initialValue: vm.initInfo.price || 0
    },
    valid_time: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请填写有效时间'
            }
          }
        }
      ],
      initialValue: vm.initInfo.valid_time
    },
    valid_time_unit: {
      initialValue: vm.initInfo.valid_time_unit || 1
    },
    is_allow_frozen: {
      initialValue: vm.initInfo.is_allow_frozen
        ? [vm.initInfo.is_allow_frozen]
        : []
    },
    frozen_days: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!values.is_allow_frozen.length) return
            if (!value) {
              return '请填写允许冻结天数'
            }
          }
        }
      ],
      initialValue: vm.initInfo.frozen_days
    },
    is_allow_transfer: {
      initialValue: vm.initInfo.is_allow_transfer
        ? [vm.initInfo.is_allow_transfer]
        : []
    },
    transfer_rate: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!values.is_allow_transfer.length) return
            if (!value) {
              return '请输入转让设置'
            }
          }
        }
      ],
      initialValue: vm.initInfo.transfer_rate
    },
    transfer_unit: {
      initialValue: vm.initInfo.transfer_unit || 1
    },
    image: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              vm.validateImage = '请上传图片'
              return '请上传图片'
            } else {
              vm.validateImage = ''
            }
          }
        }
      ],
      initialValue: vm.initInfo.image || {}
    },
    intro: {
      initialValue: vm.initInfo.intro
    },
    remarks: {
      initialValue: vm.initInfo.remarks
    },
    sale_mode: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value.length) {
              return '请选择售卖方式'
            }
          }
        }
      ],
      initialValue: vm.initInfo.sale_mode || [2]
    },
    sale_range: {
      initialValue: vm.initInfo.sale_range || 3
    },
    use_range: {
      initialValue: vm.initInfo.use_range || 3
    }
  }
}
