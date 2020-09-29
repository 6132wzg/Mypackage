import { Controller, Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { TemporaryCabinetApi } from '@/api/v1/setting/cabinet/temporary'
import { LongTermCabinetApi } from '@/api/v1/setting/cabinet/long-term'
@Injectable()
export class CabinetService implements Controller {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  constructor(
    private temporaryCabinetApi: TemporaryCabinetApi,
    private longTermCabinetApi: LongTermCabinetApi
  ) {}
  @Effect()
  getList(query: any) {
    console.log('query', query)
    const type = query.type
    const id = query.id || 0
    const cabinetApi =
      type === 'long-term' ? this.longTermCabinetApi : this.temporaryCabinetApi
    return cabinetApi.getList(id, query).pipe(
      tap(res => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  beforeRouteUpdate(to: ServiceRoute) {
    const query = to.meta.query
    const id = query.id
    if (id) {
      return this.getList(query)
    }
  }
}
