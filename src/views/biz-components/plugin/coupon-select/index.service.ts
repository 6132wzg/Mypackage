import { UserService } from '@/services/user.service'
import { Injectable } from 'vue-service-app'
import { State, Effect, Action } from 'rx-state'
import { DirectionalIssuanceApi } from '@/api/v1/plugin/directional_issuance'
import { tap, debounceTime, switchMap, catchError } from 'rxjs/operators'
import { EMPTY } from 'rxjs'

@Injectable()
export class IndexService {
  loading$ = new State({})
  couponListAction$: Action<any>
  list$ = new State([])
  page$ = new State([])
  isEnd$ = new State(true)
  parent_types$ = this.userService.getEnumValue$('small_course.parent_type')
  constructor(
    private userService: UserService,
    private directionalIssuanceApi: DirectionalIssuanceApi
  ) {
    this.couponListAction$ = new Action(data$ => {
      return data$.pipe(
        debounceTime(200),
        // data = [query, type]
        switchMap((data: any = []) => {
          const query = data[0] || {}
          return this.getCouponList(query).pipe(catchError(() => EMPTY))
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
  getCouponList(query: any) {
    return this.directionalIssuanceApi.getCouponList(query).pipe(
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
