export const Cardcolumns = (vm: any) => {
  return [
    {
      title: '卡项',
      dataIndex: 'card_name',
      width: 100
    },
    {
      title: '类型',
      dataIndex: 'card_type',
      scopedSlots: { customRender: 'card_type' }
    },
    {
      title: '有效期(天)',
      dataIndex: 'time_gradient'
    },
    {
      title: '售价',
      dataIndex: 'price',
      scopedSlots: { customRender: 'card_price' }
    },
    {
      title: '售卖时间',
      dataIndex: 'sale_time'
    }
  ]
}
export const TeamCoursecolumns = (vm: any) => {
  return [
    {
      title: '课程',
      dataIndex: 'course_name',
      width: 100
    },
    {
      title: '课程类型',
      dataIndex: 'category_name'
    },
    {
      title: '时长(分钟)',
      dataIndex: 'duration'
    },
    {
      title: '参考课时费(元/节)',
      dataIndex: 'price'
    }
  ]
}
export const PersonalCoursecolumns = (vm: any) => {
  return [
    {
      title: '课程',
      dataIndex: 'course_name',
      width: 100
    },
    {
      title: '课程类型',
      dataIndex: 'category_name'
    },
    {
      title: '时长(分钟)',
      dataIndex: 'duration'
    },
    {
      title: '参考课时费(元/节)',
      dataIndex: 'price'
    }
  ]
}
export const SmallCoursecolumns = (vm: any) => {
  return [
    {
      title: '课程',
      dataIndex: 'course_name',
      width: 100
    },
    {
      title: '类型',
      dataIndex: 'small_course_type',
      scopedSlots: { customRender: 'small_course_type' }
    },
    {
      title: '排课情况',
      dataIndex: 'course_arrangement'
    },
    {
      title: '售价',
      dataIndex: 'sales_price'
    },
    {
      title: '报名人数',
      dataIndex: 'apply_num'
    },
    {
      title: '状态',
      dataIndex: 'class_status',
      scopedSlots: { customRender: 'class_status' }
    }
  ]
}
export const Packagecolumns = (vm: any) => {
  return [
    {
      title: '课程包名称',
      dataIndex: 'course_name',
      width: 100
    },
    {
      title: '分类',
      dataIndex: 'package_type',
      scopedSlots: { customRender: 'package_type' }
    },
    {
      title: '团课节数/私教节数',
      dataIndex: 'quota_times'
    },
    {
      title: '有效期',
      dataIndex: 'valid_time'
    },
    {
      title: '售价',
      dataIndex: 'price'
    },
    {
      title: '售卖时间',
      dataIndex: 'sale_time'
    }
  ]
}
export const GroupBuycolumns = (vm: any) => {
  return [
    {
      title: '活动名称',
      dataIndex: 'activity_name',
      width: 100
    },
    {
      title: '商品类型',
      dataIndex: 'product_type.name'
    },
    {
      title: '活动时间',
      dataIndex: 'activity_time'
    },
    {
      title: '活动状态',
      dataIndex: 'activity_state',
      scopedSlots: { customRender: 'groupbuy_activity_status' }
    },
    {
      title: '剩余活动库存',
      dataIndex: 'stock_remaining'
    }
  ]
}
export const Couponcolumns = (vm: any) => {
  return [
    {
      title: '优惠券名称',
      dataIndex: 'activity_name',
      width: 100
    },
    {
      title: '面额',
      dataIndex: 'price'
    },
    {
      title: '使用有效期',
      dataIndex: 'valid_days'
    },
    {
      title: '剩余数量',
      dataIndex: 'margin'
    },
    {
      title: '状态',
      dataIndex: 'coupon_status',
      scopedSlots: { customRender: 'coupon_status' }
    },
    {
      title: '投放状态',
      dataIndex: 'put_status',
      scopedSlots: { customRender: 'put_status' }
    }
  ]
}
export const Wheelcolumns = (vm: any) => {
  return [
    {
      title: '活动名称',
      dataIndex: 'activity_name',
      width: 100
    },
    {
      title: '活动时间',
      dataIndex: 'activity_time',
      scopedSlots: { customRender: 'activity_time' }
    },
    {
      title: '参与用户',
      dataIndex: 'crowd_name'
    },
    {
      title: '活动状态',
      dataIndex: 'activity_status_name'
    }
  ]
}
export const SignUpcolumns = (vm: any) => {
  return [
    {
      title: '活动名称',
      dataIndex: 'activity_name',
      width: 80
    },
    {
      title: '包含票种',
      dataIndex: 'ticket_type_num'
    },
    {
      title: '活动时间',
      dataIndex: 'signup_activity_time',
      scopedSlots: { customRender: 'signup_activity_time' },
      width: 206
    },
    {
      title: '活动状态',
      dataIndex: 'activity_status.name'
    },
    {
      title: '发布时间',
      dataIndex: 'publish_time',
      width: 160
    }
  ]
}
export const Coachcolumns = (vm: any) => {
  return [
    {
      title: '姓名',
      dataIndex: 'staff_name',
      width: 60
    },
    {
      title: '手机号',
      dataIndex: 'mobile'
    },
    {
      title: '工号',
      dataIndex: 'staff_num',
      width: 60
    },
    {
      title: '所属部门',
      dataIndex: 'department',
      width: 100
    },
    {
      title: '职能',
      dataIndex: 'identity',
      scopedSlots: { customRender: 'identity' },
      width: 100
    },
    {
      title: '教练等级',
      dataIndex: 'coach_level',
      width: 60
    }
  ]
}

export const Discountcolumns = (vm: any) => {
  return [
    {
      title: '活动名称',
      dataIndex: 'activity_name',
      width: 100
    },
    {
      title: '商品类型',
      scopedSlots: { customRender: 'product_type' },
      dataIndex: 'product_type'
    },
    {
      title: '活动时间',
      scopedSlots: { customRender: 'temp' },
      dataIndex: 'temp'
    },
    {
      title: '活动状态',
      scopedSlots: { customRender: 'activity_status' },
      dataIndex: 'activity_status'
    },
    {
      title: '剩余活动库存',
      dataIndex: 'stock_remain'
    }
  ]
}

export const Seckillcolumns = (vm: any) => {
  return [
    {
      title: '活动名称',
      dataIndex: 'activity_name',
      width: 100
    },
    {
      title: '商品类型',
      scopedSlots: { customRender: 'product_type' },
      dataIndex: 'product_type'
    },
    {
      title: '活动时间',
      scopedSlots: { customRender: 'temp' },
      dataIndex: 'temp'
    },
    {
      title: '活动状态',
      scopedSlots: { customRender: 'activity_status' },
      dataIndex: 'activity_status'
    },
    {
      title: '剩余活动库存',
      dataIndex: 'stock_remain'
    }
  ]
}
