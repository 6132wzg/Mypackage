import { UserService } from '@/services/user.service'
import { Injectable } from 'vue-service-app'
@Injectable()
export class PackageCommit {
  publicChannel$ = this.userService.getOptions$(
    'package_course.publish_channel',
    {
      addAll: true
    }
  )
  constructor(private userService: UserService) {}
  SET_PACKAGE_LIST(list: any) {
    let publishChannel = this.publicChannel$.snapshot()
    let channel = {}
    publishChannel.forEach((item: any) => {
      channel[item.value] = item.label
    })
    let isPermanentSale: any = this.userService
      .getEnumValue$('package_course.sale_time_is_forever')
      .snapshot()
    return list.map(item => {
      item.channelName = channel[item.publish_channel]
      item.sale_time =
        item.is_permanent_sale === 1
          ? isPermanentSale[item.is_permanent_sale]
          : item.sale_time
      item.totalTimesText =
        item.total_times > 0
          ? `共${item.total_times}次`
          : typeof item.total_times === 'string'
          ? item.total_times
          : `团课${item.team_times}次/私教课${item.personal_times}次`
      return item
    })
  }
}
