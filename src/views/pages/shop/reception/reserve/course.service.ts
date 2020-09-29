import { ReserveApi, GetReserveCourse } from '@/api/v1/front/reserve'
import { Controller, ServiceRoute, Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { forkJoin } from 'rxjs'
import { MessageService } from '@/services/message.service'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'

@Injectable()
export class CourseService implements Controller {
  loading$ = new State({})
  page$ = new State({})
  list$ = new State([])
  auth$ = this.authService.authMap$({
    export: 'shop:front_end:module|reserve_export'
  })
  courseTypeOptions$ = this.userService.getOptions$('reserve.course_type', {
    addAll: '全部课程类型'
  })
  reserveStatusOptions$ = this.userService.getOptions$(
    'reserve.reserve_status',
    {
      addAll: '全部预约状态'
    }
  )
  checkinOptions$ = this.userService.getOptions$('reserve.is_checkin', {
    addAll: '全部签到状态'
  })

  constructor(
    private api: ReserveApi,
    private msg: MessageService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Effect()
  getList(params: GetReserveCourse) {
    return this.api.getCourseReserve(params).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  confirmVisitReserve(params: any) {
    return this.api.confirmCourseReserve(params).pipe(
      tap(res => {
        this.msg.success({ content: '签到成功' })
      })
    )
  }
  cancelVisitReserve(params: any) {
    return this.api.cancelCourseReserve(params).pipe(
      tap(res => {
        this.msg.success({ content: '取消预约成功' })
      })
    )
  }
  init(query: GetReserveCourse) {
    return forkJoin([this.getList(query)])
  }

  beforeEach(to: ServiceRoute) {
    return this.init(to.meta.query)
  }
}
