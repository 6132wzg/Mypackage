import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { CourseApi, CourseDataParams } from '@/api/v1/stat/shop/course'
import { AuthService } from '@/services/auth.service'
import { anyAll } from '@/operators'
import { UserService } from '@/services/user.service'

@Injectable()
export class MemberService {
  list$ = new State([])
  page$ = new State({})
  total$ = new State({})
  loading$ = new State({})
  auth$ = this.authService.authMap$({
    export: 'shop:stat:class_reports|personal_member_export'
  })
  consumeType$ = this.userService.getOptions$('stat.consume_type', {
    addAll: '全部消费方式'
  })
  constructor(
    private api: CourseApi,
    private authService: AuthService,
    private userService: UserService
  ) {}
  // 列表
  @Effect()
  getList(query: CourseDataParams) {
    return this.api.getMemberList(query).pipe(
      tap(res => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  getTotal(query: CourseDataParams) {
    return this.api.getMemberTotal(query).pipe(
      tap(res => {
        this.total$.commit(() => res.info)
      })
    )
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return anyAll(this.getList(to.meta.query), this.getTotal(to.meta.query))
  }
}
