import { Injectable } from 'vue-service-app'
import { UserService } from '@/services/user.service'
import { LotteryApi } from '@/api/v1/marketing/lottery'

@Injectable()
export class AddPrizeService {
  shops$ = this.userService.getOptions$('plugin.shop_setting')
  prizeType$ = this.userService.getOptions$('plugin.prize_type_setting')
  imgType$ = this.userService.getOptions$('plugin.img_type')
  prize$ = this.userService.getOptions$('plugin_wheel.prize')
  pluginStatus$ = this.userService.pluginStatus$

  constructor(
    private userService: UserService,
    private lotteryApi: LotteryApi
  ) {}
  getCouponList(id: string) {
    return this.lotteryApi.getCouponList(id)
  }
}
