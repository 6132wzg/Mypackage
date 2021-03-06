import { Controller, ServiceRoute, Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap, map } from 'rxjs/operators'
import { forkJoin } from 'rxjs'
import { CourseGroupApi } from '@/api/v1/course/small-course'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'

@Injectable()
export class ListService implements Controller {
  loading$ = new State({})
  list$ = new State([])
  page$ = new State({})
  status$ = this.userService.getOptions$('small_course.class_status', {
    addAll: true
  })
  auth$ = this.authService.authMap$({
    add: 'shop:product:small_class_course|add'
  })
  constructor(
    private courseGroupApi: CourseGroupApi,
    private authService: AuthService,
    private userService: UserService
  ) {}
  @Effect()
  getList(params: any) {
    return this.courseGroupApi.getList(params).pipe(
      tap(res => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  deleteGroup(params: any) {
    return this.courseGroupApi.deleteGroup(params)
  }
  beGroup(params: any) {
    return this.courseGroupApi.beGroup(params)
  }
  publish(params: any) {
    return this.courseGroupApi.publish(params)
  }
  init(params: any) {
    return forkJoin(this.getList(params))
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return this.init(to.meta.query)
  }
}
