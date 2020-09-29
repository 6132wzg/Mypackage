import { Injectable } from 'vue-service-app'
import { Effect, State } from 'rx-state'
import { CourseApi } from '@/api/v1/setting/course'
import { PackageApi, GetCourseInput } from '@/api/v1/course/package'
import { tap } from 'rxjs/operators'

@Injectable()
export class SelectCourseService {
  courseTypeOptions$ = new State([])
  page$ = new State([])
  courseList$ = new State([])
  loading$ = new State({})
  constructor(private courseApi: CourseApi, private packageApi: PackageApi) {}
  @Effect()
  getCourseList(params: GetCourseInput) {
    return this.packageApi.getCourseList(params).pipe(
      tap(res => {
        this.courseList$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  getCourseTypeList() {
    return this.courseApi.getCourseCategoryList({}).pipe(
      tap(res => {
        this.courseTypeOptions$.commit(() => [
          { label: '全部课程类型', value: -1 },
          ...res.list.map((item: any) => {
            return {
              label: item.setting_name,
              value: item.id
            }
          })
        ])
      })
    )
  }
}
