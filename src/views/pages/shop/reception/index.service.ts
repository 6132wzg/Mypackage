import { UserService } from '@/services/user.service'
import { Injectable, Controller } from 'vue-service-app'
import { State, Effect, Action } from 'rx-state'
import { FrontApi, GetMemberListInput } from '@/api/v1/front'
import { tap, debounceTime, switchMap, catchError } from 'rxjs/operators'
import { EMPTY } from 'rxjs'
import { AuthService } from '@/services/auth.service'
import { MemberOnlineService } from './components#/member-online.service'

@Injectable()
export class IndexService implements Controller {
  loading$ = new State({})
  memberListAction$: Action<any>
  memberList$ = new State([])
  hasNext$ = new State({})
  page$ = new State([])
  current_page$ = new State([])
  summaryInfo$ = new State({})
  sellerList$ = new State([])
  coachList$ = new State([])
  entranceOptionList$ = new State([])
  cabinetList$ = new State([])
  parent_types$ = this.userService.getOptions$('small_course.parent_type')
  auth$ = this.authService.authMap$({
    checkinPage: 'shop:front_end:module|check_in_page'
  })
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private memberOnlineService: MemberOnlineService,
    private frontApi: FrontApi
  ) {
    this.memberListAction$ = new Action(data$ => {
      return data$.pipe(
        debounceTime(200),
        switchMap((query: GetMemberListInput) =>
          this.getMemberList(query).pipe(catchError(() => EMPTY))
        ),
        tap(res => {
          this.page$.commit(() => res.page)
          this.hasNext$.commit(() => {
            return res.page.current_page < res.page.total_pages
          })
          this.memberList$.commit((preList: any) => {
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
  getMemberList(query: GetMemberListInput) {
    return this.frontApi.getMemberList(query)
  }
  setMemberList(list: any) {
    this.memberList$.commit(() => list)
  }
  @Effect()
  getMemberOnlineList() {
    return this.memberOnlineService.getList({
      current_page: 1,
      size: 20
    })
  }
  beforeEach() {}
}
