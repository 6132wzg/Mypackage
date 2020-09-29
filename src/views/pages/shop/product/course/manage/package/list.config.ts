export const columns = () => {
  return [
    {
      title: '课程包名称',
      dataIndex: 'course_name'
    },
    {
      title: '类型',
      dataIndex: 'is_limit',
      width: 110,
      scopedSlots: {
        customRender: 'is_limit'
      }
    },
    {
      title: '属性',
      dataIndex: 'package_type',
      width: 80,
      scopedSlots: {
        customRender: 'package_type'
      }
    },
    {
      title: '次数',
      dataIndex: 'quota_times',
      width: 200,
      scopedSlots: {
        customRender: 'quota_times'
      }
    },
    {
      title: '有效期',
      dataIndex: 'valid_time',
      width: 90,
      scopedSlots: {
        customRender: 'valid_time'
      }
    },
    {
      title: '支持人数',
      dataIndex: 'support_num'
    },
    {
      title: '发布渠道',
      dataIndex: 'channelName',
      align: 'center',
      scopedSlots: {
        customRender: 'channelName'
      }
    },
    {
      title: '支持售卖时间',
      dataIndex: 'sale_time',
      scopedSlots: {
        customRender: 'sale_time'
      }
    },
    {
      title: '售卖价格(元)',
      dataIndex: 'price',
      sorter: true,
      scopedSlots: {
        customRender: 'price'
      }
    },
    {
      title: '状态',
      dataIndex: 'shelf_status',
      width: 100,
      scopedSlots: {
        customRender: 'shelf_status'
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 140,
      scopedSlots: {
        customRender: 'action'
      }
    }
  ]
}
export const ruleOptions = (vm: any) => {
  return {
    reason: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请输入下架原因'
            }
          }
        }
      ]
    },
    start_time: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请选择开始售卖时间'
            }
            if (
              value.valueOf() <
              vm
                .moment(
                  vm
                    .moment()
                    .format()
                    .replace(/\d{2}:\d{2}:\d{2}/, '00:00:00')
                )
                .valueOf()
            ) {
              return '支持售卖时间已过，请重新设置'
            }
          }
        }
      ]
    },
    end_time: {
      rules: [
        {
          validator: (field: any, value: any, values: any) => {
            if (!value) {
              return '请选择结束售卖时间'
            }
            if (
              value.valueOf() <
              vm
                .moment(
                  vm
                    .moment()
                    .format()
                    .replace(/\d{2}:\d{2}:\d{2}/, '23:59:59')
                )
                .valueOf()
            ) {
              return '支持售卖时间已过，请重新设置'
            }
          }
        }
      ]
    }
  }
}
