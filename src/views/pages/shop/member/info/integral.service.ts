import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { MemberApi } from '@/api/v1/member'
import { UserService } from '@/services/user.service'

@Injectable()
export class IntegralService {
  loading$ = new State({})
  list$ = new State([])
  page$ = new State({})
  total$ = new State({})
  pluginStatus$ = this.userService.pluginStatus$

  constructor(private cardsApi: MemberApi, private userService: UserService) {}

  @Effect()
  getMemberIntegralInfo(id, query: any) {
    return this.cardsApi.getMemberIntegralInfo(id, query).pipe(
      tap(res => {
        this.total$.commit(() => res.info)
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }

  beforeEach(to: ServiceRoute) {
    const { id } = to.meta.query
    return this.getMemberIntegralInfo(id, to.meta.query)
  }
}
