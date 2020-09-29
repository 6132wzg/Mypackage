import { UserService } from '@/services/user.service'
import { Injectable, ServiceRoute } from 'vue-service-app'
import { DiscountApi } from '@/api/v1/app/plugin/discount'
import { Effect, State } from 'rx-state'
import { then } from '@/operators'

@Injectable()
export class DiscountTableSelectService {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  activityStatus$ = this.userService.getOptions$(
    'limited_time_discount.activity_status',
    { addAll: '全部活动状态' }
  )
  constructor(private api: DiscountApi, private userService: UserService) {}
  RESET_LIST() {
    this.list$.commit(() => [])
  }

  @Effect()
  getDiscountList(query: any) {
    return this.api.getLimitDiscountList(query).pipe(
      then((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
