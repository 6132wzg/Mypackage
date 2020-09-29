import { CONSUMPTION_RANGE, SUPPORT_SALES } from '@/constants/card/deposit'
import { MEMBER_CARD_SPECIAL_NOTE } from '@/views/biz-components/h5/pages/member-card.config'
export const ruleOptions = (vm: any) => {
  return {
    'cardData.card_name': {
      rules: [
        {
          required: true,
          message: '请填写储值卡名称'
        }
      ]
    },
    'cardData.special_note': {
      initialValue: MEMBER_CARD_SPECIAL_NOTE.DEPOSIT_CARD
    },
    'cardData.card_price': {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (value === undefined || value === '') {
              return '请填写储值金额'
            }
            if (value && !vm.pattern.NUM_FLOAT(1).test(value)) {
              return '输入的储值金额格式错误，请重新输入'
            }
          }
        }
      ]
    },
    'cardData.sell_price': {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (value === undefined || value === '') {
              return '请填写售卖价格'
            }
            if (value && !vm.pattern.NUM_FLOAT(1).test(value)) {
              return '输入的售卖价格格式错误，请重新输入'
            }
          }
        }
      ]
    },
    'cardData.num': {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (value === undefined || value === '') {
              return '请填写期限'
            }
            if (value && !vm.pattern.NUM_FLOAT(1).test(value)) {
              return '输入的期限格式错误，请重新输入'
            }
          }
        }
      ]
    },
    'cardData.card_consumer_id': {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (value === undefined || value === '' || value.length === 0) {
              return '请选择支持消费类目'
            }
          }
        }
      ]
    },
    'cardData.consumption_range': {
      initialValue: CONSUMPTION_RANGE.ONLY_STORE,
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (
              value === CONSUMPTION_RANGE.GENERAL_STORE &&
              !vm.cardData.consumer_shop_list.length
            ) {
              return '请新增支持入场门店'
            }
          }
        }
      ]
    },
    'cardData.support_sales': {
      initialValue: SUPPORT_SALES.ALL_STORE,
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (
              value === SUPPORT_SALES.SPECIFIED_STORE &&
              !vm.cardData.sell_shop_list.length
            ) {
              return '请新增支持售卖门店'
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
    'cardData.transfer_num': {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (vm.cardData._is_transfer && !value) {
              return '请输入转让费用'
            }
          }
        }
      ]
    }
  }
}
