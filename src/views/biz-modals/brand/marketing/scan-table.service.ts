import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import {
  ActivityQrcodeApi,
  GetScanListQuery
} from '@/api/v1/marketing/activity-qrcode'
import { tap } from 'rxjs/operators'
@Injectable()
export class ScanTableService {
  loading$ = new State({})
  list$ = new State([])
  page$ = new State({
    current_page: 1,
    size: 20,
    total_counts: 1,
    total_pages: 1
  })
  constructor(private activityQrcodeApi: ActivityQrcodeApi) {}
  @Effect()
  getScanList(query: GetScanListQuery) {
    return this.activityQrcodeApi.getScanList(query).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
