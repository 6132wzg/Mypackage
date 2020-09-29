import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { CourseApi, CourseDataParams } from '@/api/v1/stat/brand/course'
import { CommonApi, CourseListParams } from '@/api/v1/stat/common/common'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'
import { anyAll } from '@/operators'

@Injectable()
export class CourseService {
  list$ = new State([])
  page$ = new State({})
  total$ = new State({})
  loading$ = new State({})
  courseList$ = new State([])
  courseListPage$ = new State({})
  categoryList$ = new State([])
  auth$ = this.authService.authMap$({
    export: 'brand:stat:course|team_member_export'
  })
  productType$ = this.userService.getOptions$('report.revenue_product_type')

  constructor(
    private api: CourseApi,
    private commonApi: CommonApi,
    private authService: AuthService,
    private userService: UserService
  ) {}
  // 列表
  @Effect()
  getList(query: CourseDataParams) {
    return this.api.getTeamCourseList(query).pipe(
      tap(res => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  getTotal(query: CourseDataParams) {
    return this.api.getTeamCourseTotal(query).pipe(
      tap(res => {
        this.total$.commit(() => res.info)
      })
    )
  }
  getCourseList(query: CourseListParams, isreload: any = false) {
    return this.commonApi.getCourseList(query).pipe(
      tap(res => {
        let courseList: any = this.courseList$.getValue() || []
        const list = res.list || []
        const current_page: any = query.current_page
        if (current_page === 1 || isreload) {
          courseList = list
        } else if (current_page <= res.page.total_pages) {
          courseList = [...courseList, ...list]
        }
        this.courseListPage$.commit(() => res.page)
        this.courseList$.commit(() => courseList)
      })
    )
  }
  getCategoryList() {
    return this.commonApi.getCourseCategoryList({}).pipe(
      tap(res => {
        const list = res.list || []
        this.categoryList$.commit(() =>
          list.map((item: any) => {
            const { id, setting_name } = item
            return {
              value: id,
              label: setting_name
            }
          })
        )
      })
    )
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return anyAll(this.getList(to.meta.query), this.getTotal(to.meta.query))
  }
}
