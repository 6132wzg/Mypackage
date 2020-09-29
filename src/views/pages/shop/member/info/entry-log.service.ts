import { Injectable, ServiceRoute, Controller } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { MemberApi } from '@/api/v1/member'

@Injectable()
export class EntryLogService implements Controller {
  entranceList$ = new State([])
  entrancePage$ = new State({})
  constructor(private memberApi: MemberApi) {}
  @Effect()
  getMemberEntrance(params: any) {
    return this.memberApi.getMemberEntrance(params).pipe(
      tap(res => {
        this.entranceList$.commit(() => res.list)
        this.entrancePage$.commit(() => res.page)
      })
    )
  }

  init(params: any) {
    return this.getMemberEntrance(params)
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return this.init(to.meta.query)
  }
}
