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
