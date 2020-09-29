import { Controller, Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { TemporaryCabinetApi } from '@/api/v1/setting/cabinet/temporary'
import { LongTermCabinetApi } from '@/api/v1/setting/cabinet/long-term'
import { CabinetApi } from '@/api/v1/setting/cabinet'
@Injectable()
export class CabinetService implements Controller {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  constructor(
    private temporaryCabinetApi: TemporaryCabinetApi,
    private longTermCabinetApi: LongTermCabinetApi,
    private cabinetApi: CabinetApi
  ) {}
  @Effect()
  getList(query: any) {
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
  @Effect()
  getCabinetUseRecord(query: any) {
    let params = {
      cabinet_area_id: query.id || 0,
      cabinet_type: query.cabinet_type,
      action_type: query.action_type,
      date_start: query.date_start,
      date_end: query.date_end,
      keywords: query.keywords,
      current_page: query.current_page,
      size: query.size
    }
    return this.cabinetApi.getCabinetUseRecord(params).pipe(
      tap(res => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  beforeRouteUpdate(to: ServiceRoute) {
    const query = to.meta.query
    const type = query.type
    if (type === 'record') {
      return this.getCabinetUseRecord(query)
    } else {
      console.log('query', query)
      return this.getList(query)
    }
  }
}
