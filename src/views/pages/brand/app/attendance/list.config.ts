export const attendanceInfo = () => [
  {
    title: '上班打卡',
    dataIndex: 'in_count'
  },
  {
    title: '忘记上班打卡',
    dataIndex: 'in_over'
  },
  {
    title: '下班打卡',
    dataIndex: 'out_count'
  },
  {
    title: '忘记下班打卡',
    dataIndex: 'out_over'
  },
  {
    title: '上下班全勤打卡',
    dataIndex: 'full_count'
  }
]
export const columns = () => [
  {
    title: '日期',
    width: 100,
    dataIndex: 'date'
  },
  {
    title: '员工姓名',
    width: 100,
    dataIndex: 'name'
  },
  {
    title: '手机号',
    width: 100,
    dataIndex: 'mobile'
  },
  {
    title: '所属门店',
    width: 180,
    scopedSlots: { customRender: 'is_shop_range' },
    dataIndex: 'is_shop_range'
  },
  {
    title: '所属部门',
    width: 100,
    scopedSlots: { customRender: 'department' },
    dataIndex: 'department'
  },
  {
    title: '上班打卡时间',
    align: 'center',
    scopedSlots: { customRender: 'in_time' },
    dataIndex: 'in_time'
  },
  {
    title: '上班打卡门店',
    dataIndex: 'in_shop_name'
  },
  {
    title: '下班打卡时间',
    align: 'center',
    scopedSlots: { customRender: 'out_time' },
    dataIndex: 'out_time'
  },
  {
    title: '下班打卡门店',
    dataIndex: 'out_shop_name'
  },
  {
    title: '工作时长(小时)',
    width: 100,
    dataIndex: 'duration'
  },
  {
    title: '备注',
    width: 150,
    scopedSlots: { customRender: 'remark' },
    dataIndex: 'remark'
  },
  {
    title: '操作',
    width: 80,
    fixed: 'right',
    scopedSlots: { customRender: 'action' },
    dataIndex: 'action'
  }
]
export const shopList = () => {
  return [
    {
      title: '省',
      dataIndex: 'province_name',
      width: '22%'
    },
    {
      title: '市',
      width: '22%',
      dataIndex: 'city_name'
    },
    {
      title: '区',
      width: '22%',
      dataIndex: 'district_name'
    },
    {
      title: '门店名称',
      width: '34%',
      dataIndex: 'shop_name'
    }
  ]
}
