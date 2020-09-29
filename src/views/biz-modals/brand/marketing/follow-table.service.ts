import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import {
  ActivityQrcodeApi,
  GetFollowListQuery
} from '@/api/v1/marketing/activity-qrcode'
import { tap } from 'rxjs/operators'
@Injectable()
export class FollowTableService {
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
  getFollowList(query: GetFollowListQuery) {
    return this.activityQrcodeApi.getFollowList(query).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
