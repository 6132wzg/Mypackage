import { UserService } from '@/services/user.service'
import { Injectable } from 'vue-service-app'
import { State, Effect, Action } from 'rx-state'
import { CommonApi, GetMemberListInput } from '@/api/v1/stat/common/common'
import { tap, debounceTime, switchMap, catchError } from 'rxjs/operators'
import { EMPTY } from 'rxjs'

@Injectable()
export class IndexService {
  loading$ = new State({})
  memberListAction$: Action<any>
  list$ = new State([])
  page$ = new State([])
  isEnd$ = new State(true)
  parent_types$ = this.userService.getEnumValue$('small_course.parent_type')
  constructor(private userService: UserService, private commonApi: CommonApi) {
    this.memberListAction$ = new Action(data$ => {
      return data$.pipe(
        debounceTime(200),
        // data = [query, type]
        switchMap((data: any = []) => {
          const query = data[0] || {}
          const type = data[1] || ''
          return this.getMemberList(query, type).pipe(catchError(() => EMPTY))
        }),
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
    })
  }
  @Effect()
  getMemberList(query: GetMemberListInput, type: string) {
    return this.commonApi.getMemberList(query, type).pipe(
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
