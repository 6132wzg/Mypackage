import { ConstApi } from '@/api/const'

export const ruleOptions = (vm: any) => {
  return {
    start_time: {
      rules: [{ required: true, message: '时间不能为空' }],
      initialValue: vm.time
    },
    course_id: {
      rules: [
        {
          required: true,
          message: '请选择课程'
        }
      ]
    },
    coach_id: {
      rules: [
        {
          required: true,
          message: `请选择${vm.$c('coach')}`
        }
      ]
    },
    court_id: {},
    limit_num: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请填写人数'
            }
            if (value > 999) {
              return '上课人数不能超过999个'
            }
          }
        }
      ]
    },
    course_fee: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (vm.is_support_reserve_once && !value) {
              return '请填写课时费'
            }
          }
        }
      ]
    },
    reserve_limit_type: {
      initialValue: 0
    },
    reserve_limit_date: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (
              values.reserve_limit_type === vm.RESERVE_LIMIT_TYPE.DATE &&
              !value
            ) {
              return '请选择定时开放预约时间'
            }
          }
        }
      ]
    },
    reserve_limit_time: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (
              values.reserve_limit_type === vm.RESERVE_LIMIT_TYPE.TIME &&
              !value
            ) {
              return '请输入小时'
            }
          }
        }
      ]
    },
    is_show_description: {},
    description: {}
  }
}
