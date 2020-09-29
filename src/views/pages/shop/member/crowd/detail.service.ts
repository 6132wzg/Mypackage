import { Injectable, ServiceRoute } from 'vue-service-app'
import { CrowdAPI, CrowdDetailQuery } from '@/api/v1/crowd'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'

@Injectable()
export class DetailService {
  loading$ = new State({})
  list$ = new State({})
  page$ = new State({})
  constructor(private crowdAPI: CrowdAPI) {}
  // 获取列表
  @Effect()
  getList(query: CrowdDetailQuery) {
    return this.crowdAPI.crowdShopmember(query).pipe(
      tap(res => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }

  init(query: CrowdDetailQuery) {
    return this.getList(query)
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return this.init(to.meta.query)
  }
}
