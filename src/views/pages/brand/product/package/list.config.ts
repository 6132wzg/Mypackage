export const columns = () => {
  return [
    {
      title: '课程包名称',
      width: 175,
      dataIndex: 'course_name'
    },
    {
      title: '类型',
      dataIndex: 'is_limit',
      scopedSlots: {
        customRender: 'is_limit'
      }
    },
    {
      title: '属性',
      dataIndex: 'package_type',
      scopedSlots: {
        customRender: 'package_type'
      }
    },
    {
      title: '次数',
      dataIndex: 'quota_times',
      scopedSlots: {
        customRender: 'quota_times'
      }
    },
    {
      title: '有效期',
      dataIndex: 'valid_time',
      scopedSlots: {
        customRender: 'valid_time'
      }
    },
    {
      title: '支持人数',
      dataIndex: 'support_num'
    },
    {
      title: '售卖价格(元)',
      dataIndex: 'price',
      scopedSlots: {
        customRender: 'price'
      }
    },
    {
      title: '已上架/可售门店',
      dataIndex: 'sale_shop_num',
      width: 175,
      scopedSlots: {
        customRender: 'sale_shop_num'
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
      title: '发布渠道',
      dataIndex: 'channelName',
      scopedSlots: {
        customRender: 'channelName'
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 140,
      scopedSlots: {
        customRender: 'action'
      }
    }
  ]
}
export const ruleOptions = (vm: any) => {
  return {
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
