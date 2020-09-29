import { UserService } from '@/services/user.service'
import { Injectable, ServiceRoute } from 'vue-service-app'
import { SeckillApi } from '@/api/v1/app/plugin/seckill'
import { Effect, State } from 'rx-state'
import { then } from '@/operators'

@Injectable()
export class SeckillTableSelectService {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  activityStatus$ = this.userService.getOptions$(
    'limited_time_discount.activity_status',
    { addAll: '全部活动状态' }
  )
  constructor(private api: SeckillApi, private userService: UserService) {}
  RESET_LIST() {
    this.list$.commit(() => [])
  }

  @Effect()
  getSeckillList(query: any) {
    return this.api.getLimitSeckillList(query).pipe(
      then((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
