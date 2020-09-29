export const columns = () => {
  return [
    {
      title: '结算月份',
      fixed: 'left',
      width: 80,
      dataIndex: 'settle_month'
    },
    {
      title: '员工姓名',
      fixed: 'left',
      width: 90,
      dataIndex: 'staff_name'
    },
    {
      title: '工号',
      width: 90,
      dataIndex: 'staff_num',
      scopedSlots: { customRender: 'staff_num' }
    },
    {
      title: '员工身份',
      dataIndex: 'staff_identity'
    },
    {
      title: '所属部门',
      dataIndex: 'department_name'
    },
    {
      title: '所在门店',
      width: 175,
      dataIndex: 'shop',
      scopedSlots: { customRender: 'shop' }
    },
    {
      title: '底薪(元)',
      dataIndex: 'salary_basic'
    },
    {
      title: '销售提成(元)',
      dataIndex: 'sales_commission',
      scopedSlots: { customRender: 'sales_commission' },
      sorter: true
    },
    {
      title: '上课提成(元)',
      dataIndex: 'course_commission',
      scopedSlots: { customRender: 'course_commission' },
      sorter: true
    },
    {
      title: '结算薪资(元)',
      dataIndex: 'settle_salary',
      sorter: true
    }
  ]
}
