import { UserService } from '@/services/user.service'
import { Injectable, ServiceRoute } from 'vue-service-app'
import { PluginGroupBuyApi } from '@/api/v1/plugin/group_buy'
import { Effect, State } from 'rx-state'
import { then } from '@/operators'

@Injectable()
export class GroupTableSelectService {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  constructor(
    private api: PluginGroupBuyApi,
    private userService: UserService
  ) {}
  RESET_LIST() {
    this.list$.commit(() => [])
  }

  @Effect()
  getGroupBuyList(query: any) {
    return this.api.getGroupBuyList(query).pipe(
      then((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
