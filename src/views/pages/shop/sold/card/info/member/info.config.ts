export const btnOptions = (vm: any) => {
  return [
    {
      text: '查看合同',
      click: vm.toContract,
      if: vm.auth['shop:sold:sold_member_card|export_contract']
    },
    {
      text: '冻结',
      click: vm.onFreeze,
      if: vm.auth['shop:sold:sold_member_card|frozen']
    },
    {
      text: '续卡',
      click: vm.onRenewal,
      if: vm.auth['shop:sold:sold_member_card|renew']
    },
    {
      text: '升级',
      click: vm.onUpgrade,
      if: vm.auth['shop:sold:sold_member_card|upgrade']
    },
    {
      text: '转让',
      click: vm.onTransfer,
      if: vm.auth['shop:sold:sold_member_card|transfer']
    },
    {
      text: '退款',
      click: vm.onRefund,
      if: vm.auth['brand_shop:order:order|refund']
    },
    {
      text: '取消冻结',
      click: vm.onUnfreeze,
      if: vm.auth['shop:sold:sold_member_card|unfrozen']
    },
    {
      text: '修改有效时间',
      click: vm.onSetTime,
      if: vm.auth['shop:sold:sold_member_card|vaild_time']
    },
    {
      text: '修改入场vip区域',
      click: vm.onArea,
      if: vm.auth['shop:sold:sold_member_card|vip_region']
    },
    {
      text: '变更成员',
      click: vm.onChangeMember,
      if: vm.auth['shop:sold:sold_member_card|edit']
    },
    {
      text: '修改合同备注',
      click: vm.onEditContractDescription,
      if: vm.auth['shop:sold:sold_member_card|edit_contract_remark']
    },
    {
      text: '重新激活',
      click: vm.onReactive,
      if: vm.auth['shop:sold:sold_member_card|reactivate']
    },
    {
      text: '对内备注',
      click: vm.onInternalNote,
      if: vm.auth['shop:sold:sold_member_card|internal_description']
    },
    {
      text: '修改权益',
      click: () => {
        return vm.soldMemberCardActions.onUpdateRights(vm.infoService.id)
      },
      if: vm.auth['shop:sold:sold_member_card|rights_edit']
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
