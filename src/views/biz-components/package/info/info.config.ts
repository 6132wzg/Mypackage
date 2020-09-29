let countItems = [
  {
    title: '预约课程扣除次数',
    width: 200,
    scopedSlots: {
      customRender: 'reduce_times'
    },
    dataIndex: 'reduce_times'
  }
]

const teamBaseColumns = [
  {
    title: '课程名称',
    width: 180,
    dataIndex: 'course_name'
  },
  {
    title: '上课门店',
    dataIndex: 'shop_name'
  }
]
const personalBaseColumns = [
  {
    title: '课程名称',
    width: 180,
    dataIndex: 'course_name'
  },
  {
    title: '上课门店',
    dataIndex: 'shop_name'
  },
  {
    title: '上课教练等级',
    width: 200,
    scopedSlots: {
      customRender: 'coachList'
    },
    dataIndex: 'coachList'
  }
]
export const teamColumns = vm => {
  const rangeItem = vm.isLimit === 1 && vm.packageType === 2 ? countItems : []
  return vm.packageType === 2
    ? [...teamBaseColumns, ...rangeItem]
    : vm.packageType === 3
    ? [
        ...teamBaseColumns,
        {
          title: '课程次数',
          width: 200,
          scopedSlots: {
            customRender: 'course_times'
          },
          dataIndex: 'course_times'
        }
      ]
    : teamBaseColumns
}
export const personalColumns = vm => {
  const rangeItem = vm.isLimit === 1 && vm.packageType === 2 ? countItems : []
  return vm.packageType === 2
    ? [...personalBaseColumns, ...rangeItem]
    : vm.packageType === 3
    ? [
        ...personalBaseColumns,
        {
          title: '课程次数',
          width: 200,
          scopedSlots: {
            customRender: 'course_times'
          },
          dataIndex: 'course_times'
        }
      ]
    : personalBaseColumns
}
