import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { CrowdAPI, CrowdDetailQuery } from '@/api/v1/crowd'
@Injectable()
export class DetailService {
  loading$ = new State({})
  crowdDetail$ = new State({})
  page$ = new State({})
  constructor(private crowdAPI: CrowdAPI) {}
  // 获取列表
  @Effect()
  getList(query: CrowdDetailQuery) {
    return this.crowdAPI.crowdBrandMember(query).pipe(
      tap(res => {
        this.crowdDetail$.commit(() => res.list)
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
