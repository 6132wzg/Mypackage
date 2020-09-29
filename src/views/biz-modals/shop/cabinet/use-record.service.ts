import { Injectable } from 'vue-service-app'
import { Effect, State } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { CabinetApi } from '@/api/v1/setting/cabinet'

@Injectable()
export class UseRecordService {
  loading$ = new State({})
  page$ = new State({})
  list$ = new State([])
  constructor(private cabinetApi: CabinetApi) {}
  @Effect()
  getCabinetUseRecord(query: any) {
    return this.cabinetApi.getCabinetUseRecord(query).pipe(
      tap(res => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
