export const memberCard = () => {
  return [
    {
      title: '购买日期',
      dataIndex: 'buy_time'
    },
    {
      title: '合同编号',
      dataIndex: 'contract_number',
      scopedSlots: { customRender: 'contract_number' }
    },
    {
      title: '会员卡名称',
      dataIndex: 'card_name'
    },
    {
      title: '卡类型',
      dataIndex: 'card_type',
      key: 'card_type'
    },
    {
      title: '支持入场门店',
      dataIndex: 'use_range',
      key: 'use_range',
      scopedSlots: { customRender: 'use_range' }
    },
    {
      title: '购买额度',
      dataIndex: 'initAmount'
    },
    {
      title: '剩余额度',
      dataIndex: 'remainAmount'
    },
    {
      title: '状态',
      dataIndex: 'card_status',
      key: 'card_status',
      scopedSlots: { customRender: 'card_status' }
    },
    ,
    {
      title: '开卡状态',
      dataIndex: 'open_status',
      key: 'open_status',
      scopedSlots: { customRender: 'open_status' }
    },
    {
      title: '开卡日期',
      dataIndex: 'open_time'
    },
    {
      title: '到期日期',
      dataIndex: 'end_time',
      key: 'end_time'
    },
    {
      title: '使用人',
      dataIndex: 'memberList',
      key: 'memberList',
      scopedSlots: { customRender: 'memberList' }
    }
  ]
}

export const depositCard = (vm: any) => {
  return [
    {
      title: '购买日期',
      dataIndex: 'buy_time'
    },
    {
      title: '合同编号',
      dataIndex: 'contract_number',
      scopedSlots: { customRender: 'contract_number' }
    },
    {
      title: '储值卡名称',
      dataIndex: 'card_name'
    },
    {
      title: '支持消费门店',
      dataIndex: 'use_range',
      key: 'use_range',
      scopedSlots: { customRender: 'use_range' }
    },
    {
      title: '购买额度',
      dataIndex: 'initAmount'
    },
    {
      title: '剩余额度',
      dataIndex: 'remainAmount'
    },
    {
      title: '状态',
      dataIndex: 'card_status',
      key: 'card_status',
      scopedSlots: { customRender: 'card_status' }
    },
    {
      title: '到期日期',
      dataIndex: 'end_time',
      key: 'end_time'
    }
  ]
}
export const personalCourse = () => {
  return [
    {
      title: '购买日期',
      dataIndex: 'buy_time'
    },
    {
      title: '合同编号',
      dataIndex: 'contract_number',
      scopedSlots: { customRender: 'contract_number' }
    },

    {
      title: '类型',
      dataIndex: 'course_type',
      key: 'course_type'
    },
    {
      title: '课程名称',
      dataIndex: 'course_name'
    },
    {
      title: '上课教练',
      dataIndex: 'coach_name',
      key: 'coach_name',
      scopedSlots: { customRender: 'coach_name' }
    },
    {
      title: '剩余课时',
      dataIndex: 'remain_course_num',
      scopedSlots: { customRender: 'remain_course_num' }
    },
    {
      title: '购买课时',
      dataIndex: 'init_course_num',
      scopedSlots: { customRender: 'init_course_num' }
    },
    {
      title: '状态',
      dataIndex: 'course_status',
      key: 'course_status',
      scopedSlots: { customRender: 'course_status' }
    }
  ]
}

export const packageColumns = (vm: any) => {
  return [
    {
      title: '购买日期',
      dataIndex: 'buy_time'
    },
    {
      title: '合同编号',
      dataIndex: 'contract_number',
      scopedSlots: { customRender: 'contract_number' }
    },
    {
      title: '类型',
      dataIndex: 'course_type'
    },
    {
      title: '课程包名称',
      dataIndex: 'course_name',
      key: 'course_name'
    },
    {
      title: '剩余团课/私教课',
      dataIndex: 'remain',
      key: 'remain'
    },
    {
      title: '购买团课/私教课',
      dataIndex: 'init',
      scopedSlots: { customRender: 'init' }
    },

    {
      title: '状态',
      dataIndex: 'course_status',
      key: 'course_status',
      scopedSlots: { customRender: 'course_status' }
    },
    {
      title: '是否生效',
      dataIndex: 'is_reactive',
      scopedSlots: { customRender: 'is_reactive' }
    },
    {
      title: '使用门店',
      dataIndex: 'use_range',
      key: 'use_range',
      scopedSlots: { customRender: 'use_range' }
    },
    {
      title: '使用人',
      dataIndex: 'memberList',
      key: 'memberList',
      scopedSlots: { customRender: 'memberList' }
    }
  ]
}
export const smallCourse = () => {
  return [
    {
      title: '购买日期',
      dataIndex: 'buy_time'
    },
    {
      title: '合同编号',
      dataIndex: 'contract_number',
      scopedSlots: { customRender: 'contract_number' }
    },

    {
      title: '类型',
      dataIndex: 'course_type',
      key: 'course_type'
    },
    {
      title: '班名称',
      dataIndex: 'course_name'
    },
    {
      title: '剩余课时',
      dataIndex: 'remain_course_num',
      scopedSlots: { customRender: 'remain_course_num' }
    },
    {
      title: '购买课时',
      dataIndex: 'init_course_num',
      scopedSlots: { customRender: 'init_course_num' }
    },
    {
      title: '状态',
      dataIndex: 'course_status',
      key: 'course_status',
      scopedSlots: { customRender: 'course_status' }
    }
  ]
}
