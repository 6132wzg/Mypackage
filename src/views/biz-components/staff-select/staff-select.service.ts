import { StaffApi, Params } from '@/api/v1/staff'
import { Injectable } from 'vue-service-app'
import { State, Effect, Action } from 'rx-state'
import { tap } from 'rxjs/operators'

@Injectable()
export class IndexService {
  loading$ = new State({})
  list$ = new State([])
  page$ = new State([])
  isEnd$ = new State(true)
  constructor(private staffApi: StaffApi) {}
  @Effect()
  getMemberList(query: Params) {
    return this.staffApi.getStaffBrandList(query).pipe(
      tap(res => {
        this.page$.commit(() => res.page)
        this.isEnd$.commit(() => {
          return res.page.current_page >= res.page.total_pages
        })
        this.list$.commit((preList: any) => {
          if (res.page.current_page === 1) {
            preList = []
          }
          return preList.concat(res.list)
        })
      })
    )
  }
  setMemberList(list: any) {
    this.list$.commit(() => list)
  }
}
