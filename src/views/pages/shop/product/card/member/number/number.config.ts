import { MEMBER_CARD_SPECIAL_NOTE } from '@/views/biz-components/h5/pages/member-card.config'

export const ruleOptions = (vm: any) => {
  return {
    card_name: {
      rules: [
        {
          required: true,
          message: '请填写次卡名称'
        }
      ]
    },
    special_note: {
      initialValue: MEMBER_CARD_SPECIAL_NOTE.NUMBER_CARD
    },
    support_member_num: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请选择支持入场人数'
            }
          }
        }
      ]
    },
    start_time: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请选择开始售卖时间'
            }
          }
        }
      ]
    },
    end_time: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请选择结束售卖时间'
            }
          }
        }
      ]
    },
    transferNum: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (vm.is_transfer && !value) {
              return '请输入转让费用'
            }
          }
        }
      ]
    }
  }
}
