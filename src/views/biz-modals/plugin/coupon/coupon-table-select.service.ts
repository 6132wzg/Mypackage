import { UserService } from '@/services/user.service'
import { Injectable, ServiceRoute } from 'vue-service-app'
import { SettingMinaApi } from '@/api/v1/setting/mina'
import { Effect, State } from 'rx-state'
import { then } from '@/operators'

@Injectable()
export class CouponTableSelectService {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  coupon_type$ = this.userService.getOptions$('coupon.coupon_status')
  constructor(private api: SettingMinaApi, private userService: UserService) {}
  RESET_LIST() {
    this.list$.commit(() => [])
  }

  @Effect()
  getCouponList(query: any) {
    return this.api.getCouponList(query).pipe(
      then((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
