export const btnOptions = (vm: any) => {
  return [
    {
      if: vm.auth['shop:sold:sold_small_class_course|export_contract'],
      text: '查看合同',
      click: vm.toContract
    },
    {
      if: vm.auth['shop:sold:sold_small_class_course|transfer'],
      text: '转让',
      click: vm.onTransfer
    },
    {
      if: vm.auth['shop:sold:sold_small_class_course|exchange'],
      text: '换班',
      click: vm.onChangeSmallCourse
    },
    {
      if: vm.auth['shop:product:small_class_course|refund'],
      text: '退款',
      click: vm.onRefund
    },
    {
      text: '修改合同备注',
      click: vm.onEditContractDescription,
      if: vm.auth['shop:sold:sold_small_class_course|edit_contract_remark']
    },
    {
      text: '对内备注',
      click: vm.onInternalNote,
      if: vm.auth['shop:sold:sold_small_class_course|internal_description']
    },
    {
      text: '打印小票',
      click: () => {
        return vm.printService.printSmallTicket(vm.info.order_id)
      },
      if: vm.auth['shop:order:order|print']
    }
  ]
}
