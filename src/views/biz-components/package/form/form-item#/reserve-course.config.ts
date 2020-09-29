const c = [
  {
    title: '课程名称',
    width: 180,
    dataIndex: 'course_name'
  },
  {
    title: '课程种类',
    width: 120,
    dataIndex: 'course_category'
  },
  {
    title: '上课门店',
    dataIndex: 'shop_name',
    width: 320,
    scopedSlots: {
      customRender: 'shop_name'
    }
  }
]
const fixColumns = courseType => {
  let personal =
    courseType === 'personal'
      ? [
          {
            title: '上课教练等级',
            width: 200,
            scopedSlots: {
              customRender: 'coach_level_ids'
            },
            dataIndex: 'coach_level_ids'
          }
        ]
      : []
  return [
    ...c,
    ...personal,
    {
      title: '课程次数',
      width: 120,
      dataIndex: 'course_times',
      scopedSlots: {
        customRender: 'course_times'
      }
    },
    {
      title: '参考价格/元',
      dataIndex: 'course_unit_price',
      width: 200,
      scopedSlots: {
        customRender: 'course_unit_price'
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 90,
      scopedSlots: {
        customRender: 'action'
      }
    }
  ]
}
const rangeColumns = (courseType, unLimited) => {
  // 私教课会出多上课等级选项
  let personal =
    courseType === 'personal'
      ? [
          {
            title: '上课教练等级',
            width: 200,
            scopedSlots: {
              customRender: 'coach_level_ids'
            },
            dataIndex: 'coach_level_ids'
          }
        ]
      : []
  //不限次则不扣次
  let limit = unLimited
    ? []
    : [
        {
          title: '预约课程扣除次数',
          dataIndex: 'reduce_times',
          width: 280,
          scopedSlots: {
            customRender: 'reduce_times'
          }
        }
      ]
  return [
    ...c,
    ...personal,
    ...limit,
    {
      title: '操作',
      dataIndex: 'action',
      width: 60,
      scopedSlots: {
        customRender: 'action'
      }
    }
  ]
}
export const columns = vm => {
  return vm.packageAttr === 3
    ? fixColumns(vm.courseType)
    : vm.packageAttr === 2
    ? rangeColumns(vm.courseType, vm.form.unLimited)
    : c
}
