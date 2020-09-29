import { Injectable, ServiceRoute, Controller } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { CourseApi, GetCourseListInput } from '@/api/v1/sold/course'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'
import { anyAll } from '@/operators'
import { cloneDeep } from 'lodash'

@Injectable()
export class PackageService implements Controller {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  total$ = new State({})
  auth$ = this.authService.authMap$({
    export: 'shop:sold:sold_package_course|export',
    course_range: 'shop:sold:sold_package_course|batch_change_course_range',
    extendDay: 'shop:sold:sold_package_course|batch_extension',
    reactive: 'shop:sold:sold_package_course|batch_reactivate',
    gift: 'shop:sold:sold_package_course|gift_batch'
  })
  courseStatus$ = this.userService.getOptions$(
    'sold_common.new_course_status',
    {
      addAll: true
    }
  )
  // 课程包类型
  packageIsLimitOptions$ = this.userService.getOptions$(
    'package_course.is_limit',
    {
      addAll: true
    }
  )
  packageTypes$ = this.userService.getOptions$('package_course.package_type', {
    addAll: true
  })
  effectiveWay$ = this.userService.getOptions$('package_course.effective_way', {
    addAll: true
  })
  constructor(
    private courseApi: CourseApi,
    private authService: AuthService,
    private userService: UserService
  ) {}
  @Effect()
  getList(params: GetCourseListInput) {
    return this.courseApi.getCourseList(params, 'package').pipe(
      tap((res: any) => {
        this.list$.commit(() => {
          let list = cloneDeep(res.list)
          list = list.map(item => {
            item.product_quota_remain_desc_list =
              item.product_quota_remain_desc_list.join('/') || '--'
            item.product_quota_desc_list =
              item.product_quota_desc_list.join('/') || '--'
            return item
          })
          return list
        })
        this.page$.commit(() => res.page)
      })
    )
  }
  getTotal(params: GetCourseListInput) {
    return this.courseApi.getTotal(params, 'package').pipe(
      tap((res: any) => {
        this.total$.commit(() => res.total)
      })
    )
  }
  unFreeze(id: string) {
    return this.courseApi.unFreezeCourse(id, 'package')
  }
  init(query: any) {
    return anyAll(this.getList(query), this.getTotal(query))
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return this.init(to.meta.query)
  }
}
