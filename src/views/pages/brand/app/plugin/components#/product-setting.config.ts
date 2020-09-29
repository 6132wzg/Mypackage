import { PRODUCT_TYPE } from '@/constants/brand/app/plugin/discount'
export const memberCardColumns = vm => [
  {
    title: '期限/次数',
    width: 140,
    dataIndex: 'spec'
  },
  {
    title: '原价',
    width: 80,
    dataIndex: 'price'
  },
  {
    title: vm.discountPriceLabel,
    scopedSlots: { customRender: 'discount_price' },
    width: 160,
    dataIndex: 'discount_price'
  }
]

export const depositCardColumns = vm => [
  {
    title: '原价',
    width: 180,
    dataIndex: 'price'
  },
  {
    title: vm.discountPriceLabel,
    scopedSlots: { customRender: 'discount_price' },
    width: 200,
    dataIndex: 'discount_price'
  }
]

export const personalCourseLevelColumns = (vm: any) => [
  {
    title: '价格等级',
    width: 140,
    dataIndex: 'spec'
  },
  {
    title: '课时',
    width: 80,
    dataIndex: 'hour'
  },
  {
    title: vm.discountPriceLabel,
    scopedSlots: { customRender: 'discount_price' },
    width: 160,
    dataIndex: 'discount_price'
  }
]

export const personalCourseColumns = (vm: any) => [
  {
    title: '课时',
    width: 180,
    dataIndex: 'hour'
  },
  {
    title: vm.discountPriceLabel,
    scopedSlots: { customRender: 'discount_price' },
    width: 200,
    dataIndex: 'discount_price'
  }
]

export const productSettingRules = (vm: any) => {
  return {
    product_type: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请输入商品类型'
            }
          }
        }
      ],
      initialValue: 1
    },
    product_id: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请选择商品'
            }
          }
        }
      ]
    },
    limit_course_num: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (
              values.product_type === PRODUCT_TYPE.PERSONAL_COURSE &&
              !value
            ) {
              return '限定课时不能小于1'
            }
          }
        }
      ]
    }
  }
}
