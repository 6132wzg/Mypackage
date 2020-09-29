export const columns = (vm: any) => {
  const $t = vm.$t
  return [
    {
      title: '门店',
      dataIndex: 'shop_name'
    },
    {
      title: '员工名称',
      dataIndex: 'staff_name'
    },
    {
      title: '员工职能',
      dataIndex: 'identity',
      scopedSlots: { customRender: 'identity' }
    },
    {
      title: '扫码记录',
      dataIndex: 'scan_code_num',
      scopedSlots: { customRender: 'scan_code_num' }
    },
    {
      title: '新增会员',
      dataIndex: 'follow_num',
      scopedSlots: { customRender: 'follow_num' }
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]
}
