export const btnOptions = (vm: any) => {
  return [
    {
      if: vm.auth['shop:sold:sold_package_course|export_contract'],
      text: '查看合同',
      click: vm.toContract
    },
    {
      if: vm.auth['shop:sold:sold_package_course|frozen'],
      text: '冻结',
      click: vm.onFreeze
    },
    {
      if: vm.auth['shop:sold:sold_package_course|upgrade'],
      text: '升级',
      click: vm.onUpgrade
    },
    {
      if: vm.auth['shop:sold:sold_package_course|transfer'],
      text: '转让',
      click: vm.onTransfer
    },
    {
      if: vm.auth['shop:sold:sold_package_course|valid'],
      text: '立即生效',
      click: vm.onValid
    },
    {
      if: vm.auth['shop:sold:sold_package_course|member_change'],
      text: '成员变更',
      click: vm.onMemberChange
    },
    {
      if: vm.auth['shop:sold:sold_package_course|edit_date'],
      text: '有效期修改',
      click: vm.onEditDate
    },
    {
      if: vm.auth['shop:sold:sold_package_course|reduce_times'],
      text: '扣次',
      click: vm.onReduceTimes
    },
    {
      if: vm.auth['brand_shop:order:order|refund'],
      text: '退款',
      click: vm.onRefund
    },
    {
      if: vm.auth['shop:sold:sold_package_course|unfrozen'],
      text: '取消冻结',
      click: vm.onUnfreeze
    },
    {
      if: vm.auth['shop:sold:sold_package_course|course_num'],
      text: '修改剩余课时',
      click: vm.onSurplus
    },
    {
      text: '修改合同备注',
      click: vm.onEditContractDescription,
      if: vm.auth['shop:sold:sold_package_course|edit_contract_remark']
    },
    {
      text: '对内备注',
      click: vm.onInternalNote,
      if: vm.auth['shop:sold:sold_package_course|internal_description']
    },
    {
      text: '打印小票',
      click: () => {
        return vm.printService.printSmallTicket(vm.packageInfo.order_id)
      },
      if: vm.auth['shop:order:order|print']
    },
    {
      text: '修改售出权益',
      click: vm.updateRight,
      if: vm.auth['shop:sold:sold_package_course|rights_edit']
    }
  ]
}
