// 上课记录表格配置
export const courseColums = () => {
  return [
    {
      title: '上课时间',
      dataIndex: 'course_time',
      key: 'course_time'
    },
    {
      title: '上课门店',
      dataIndex: 'shop_name',
      key: 'shop_name'
    },
    {
      title: '课程类型',
      dataIndex: 'course_type',
      key: 'course_type',
      scopedSlots: { customRender: 'course_type' }
    },
    {
      title: '课程名称',
      dataIndex: 'course_name',
      key: 'course_name',
      scopedSlots: { customRender: 'course_name' }
    },
    {
      title: '课程状态',
      dataIndex: 'schedule_status',
      key: 'schedule_status',
      scopedSlots: { customRender: 'schedule_status' }
    },
    {
      title: '预约人数',
      dataIndex: 'reserved_num',
      key: 'reserved_num'
    },
    {
      title: '签到人数',
      dataIndex: 'checkin_num',
      key: 'checkin_num'
    },
    {
      title: '操作',
      scopedSlots: { customRender: 'action' }
    }
  ]
}

// 跟进记录表格配置
export const followColumns = () => {
  return [
    {
      title: '跟进时间',
      dataIndex: 'follow_date',
      key: 'follow_date'
    },
    {
      title: '门店',
      dataIndex: 'shop_name',
      key: 'shop_name'
    },
    {
      title: '跟进用户',
      dataIndex: 'member_name',
      // key: 'member_name',
      scopedSlots: { customRender: 'member_name' }
    },
    {
      title: '跟进方式',
      dataIndex: 'follow_way',
      key: 'follow_way'
    },
    {
      title: '跟进结果',
      dataIndex: 'follow_status',
      key: 'follow_status'
    },
    {
      title: '跟进说明',
      dataIndex: 'follow_content',
      key: 'follow_content'
    }
  ]
}

// 售卖订单表格配置
export const soldColums = () => {
  return [
    {
      title: '订单编号',
      dataIndex: 'id',
      // key: 'id',
      scopedSlots: { customRender: 'id' }
    },
    {
      title: '销售门店',
      dataIndex: 'shop_name',
      key: 'shop_name'
    },
    {
      title: '商品名称',
      dataIndex: 'product_name',
      key: 'product_name',
      scopedSlots: { customRender: 'product_name' }
    },
    {
      title: '商品类型',
      dataIndex: 'product_type_name',
      key: 'product_type_name',
      scopedSlots: { customRender: 'product_type_name' }
    },
    {
      title: '订单状态',
      dataIndex: 'order_status_name',
      key: 'order_status_name'
    },
    {
      title: '支付状态',
      dataIndex: 'pay_status_name',
      key: 'pay_status_name'
    },
    {
      title: '用户姓名',
      dataIndex: 'member_name',
      key: 'member_name'
    },
    {
      title: '手机号',
      dataIndex: 'member_mobile',
      key: 'member_mobile'
    },
    {
      title: '下单时间',
      dataIndex: 'created_time',
      key: 'created_time'
    },
    {
      title: '完成时间',
      dataIndex: 'pay_last_time',
      key: 'pay_last_time'
    }
  ]
}

// 服务课程表格配置
export const memberColums = () => {
  return [
    {
      title: '服务门店',
      dataIndex: 'shop_name',
      key: 'shop_name'
    },
    {
      title: '课程名称',
      dataIndex: 'course_name',
      key: 'course_name',
      scopedSlots: { customRender: 'course_name' }
    },
    {
      title: '课程分类',
      dataIndex: 'course_category',
      key: 'course_category'
    },
    {
      title: '会员姓名',
      dataIndex: 'member_name',
      key: 'member_name',
      scopedSlots: { customRender: 'member_name' }
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile'
    },
    {
      title: '课程状态',
      dataIndex: 'course_status',
      key: 'course_status',
      scopedSlots: { customRender: 'course_status' }
    },
    {
      title: '购买课时',
      dataIndex: 'init_course_num',
      key: 'init_course_num'
    },
    {
      title: '剩余课时',
      dataIndex: 'remain_course_num',
      key: 'remain_course_num'
    },
    {
      title: '购买日期',
      dataIndex: 'buy_time',
      key: 'buy_time'
    },
    {
      title: '到期日期',
      dataIndex: 'end_time',
      key: 'end_time'
    }
  ]
}
