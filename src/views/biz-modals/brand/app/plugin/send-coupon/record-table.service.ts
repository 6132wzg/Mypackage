import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { DirectionalIssuanceApi } from '@/api/v1/plugin/directional_issuance'
import { tap } from 'rxjs/operators'
@Injectable()
export class RecordTableService {
  loading$ = new State({})
  list$ = new State([])
  page$ = new State({
    current_page: 1,
    size: 20,
    total_counts: 1,
    total_pages: 1
  })
  constructor(private directionalIssuanceApi: DirectionalIssuanceApi) {}
  @Effect()
  getSendList(query: any) {
    return this.directionalIssuanceApi.getSendList(query).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
