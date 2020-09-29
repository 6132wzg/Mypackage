export const ruleOptions = (vm: any) => {
  const obj =
    vm.giftType === 'times'
      ? {
          gift_team_times: {},
          gift_personal_times: {},
          gift_total_times: {}
        }
      : { gift_time_quota: {} }
  return {
    ...obj,
    description: {}
  }
}
