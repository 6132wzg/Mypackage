export const btnOptions = (vm: any) => {
  return [
    {
      text: '查看合同',
      click: vm.toContract,
      if: vm.auth['shop:sold:sold_deposit_card|export_contract']
    },
    {
      text: '退款',
      click: vm.onRefund,
      if: vm.auth['brand_shop:order:order|refund']
    },
    {
      text: '转让',
      click: vm.onTransfer,
      if: vm.auth['shop:sold:sold_deposit_card|transfer']
    },
    {
      text: '修改合同备注',
      click: vm.onEditContractDescription,
      if: vm.auth['shop:sold:sold_deposit_card|edit_contract_remark']
    },
    {
      text: '对内备注',
      click: vm.onInternalNote,
      if: vm.auth['shop:sold:sold_deposit_card|internal_description']
    },
    {
      text: '修改权益',
      click: () => {
        return vm.soldDepositCardActions.onUpdateRights(vm.infoService.id)
      },
      if: vm.auth['shop:sold:sold_deposit_card|rights_edit']
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
