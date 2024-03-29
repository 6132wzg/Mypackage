import { Injectable, Controller, ServiceRoute } from 'vue-service-app'
import { GroupBuyApi, GroupData } from '@/api/v1/marketing/group-buy'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { forkJoin } from 'rxjs'
import { UserService } from '@/services/user.service'

@Injectable()
export class DataService implements Controller {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  collect$ = new State([])
  info$ = new State({})
  groupStatusEnums$ = this.userService.getOptions$('group_buy.group_status', {
    addAll: true
  })
  constructor(
    private groupBuyApi: GroupBuyApi,
    private userService: UserService
  ) {}
  @Effect()
  getData(params: GroupData) {
    return this.groupBuyApi.getData(params).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
        this.collect$.commit(() => res.collect)
        this.loading$.commit(() => res.loading)
      })
    )
  }
  getDatatop(id: number) {
    return this.groupBuyApi.getGroupBuyDataTop(id).pipe(
      tap((res: any) => {
        this.info$.commit(() => res)
      })
    )
  }
  init(params: any) {
    return forkJoin(this.getData(params), this.getDatatop(params.id))
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return this.init(to.meta.query)
  }
}
