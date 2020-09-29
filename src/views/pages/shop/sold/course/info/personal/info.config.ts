export const btnOptions = (vm: any) => {
  return [
    {
      if: vm.auth['shop:sold:sold_personal_course|export_contract'],
      text: '查看合同',
      click: vm.toContract
    },
    {
      if: vm.auth['shop:sold:sold_personal_course|reduce_times'],
      text: '扣次',
      click: () => {
        return vm.soldPersonalCourseActions.onDeduct(vm.infoService.id)
      }
    },
    {
      if: vm.auth['shop:sold:sold_personal_course|reactive'],
      text: '重新激活',
      click: vm.onActivated
    },
    {
      if: vm.auth['shop:sold:sold_personal_course|expire'],
      text: '延长有效期',
      click: vm.onLease
    },
    {
      if: vm.auth['shop:sold:sold_personal_course|frozen'],
      text: '冻结',
      click: vm.onFreeze
    },
    {
      if: vm.auth['shop:sold:sold_personal_course|unfrozen'],
      text: '取消冻结',
      click: vm.onUnfreeze
    },
    {
      if: vm.auth['shop:sold:sold_personal_course|change_coach'],
      text: `修改${vm.$c('coach')}`,
      click: vm.onEditCoach
    },
    {
      if: vm.auth['shop:sold:sold_personal_course|course_num'],
      text: '修改剩余课时',
      click: vm.onTransfer
    },
    {
      if: vm.auth['shop:sold:sold_personal_course|transfer'],
      text: '转让',
      click: vm.onTransfer
    },
    {
      if: vm.auth['brand_shop:order:order|refund'],
      text: '退款',
      click: vm.onRefund
    },
    {
      text: '修改合同备注',
      click: vm.onEditContractDescription,
      if: vm.auth['shop:sold:sold_personal_course|edit_contract_remark']
    },
    {
      text: '对内备注',
      click: vm.onInternalNote,
      if: vm.auth['shop:sold:sold_personal_course|internal_description']
    },
    {
      if: vm.auth['shop:sold:sold_personal_course|rights_edit'],
      text: '修改权益',
      click: () => {
        return vm.soldPersonalCourseActions.onUpdateRights(vm.infoService.id)
      }
    },
    {
      text: '打印小票',
      click: () => {
        return vm.printService.printSmallTicket(vm.personalInfo.order_id)
      },
      if: vm.auth['shop:order:order|print']
    }
  ]
}
