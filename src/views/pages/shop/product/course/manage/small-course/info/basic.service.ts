import { State, Computed } from 'rx-state'
import { Controller, ServiceRoute, Injectable } from 'vue-service-app'
import { tap, pluck } from 'rxjs/operators'
import { CourseGroupApi } from '@/api/v1/course/small-course'
@Injectable()
export class BasicService {
  groupInfo$ = new State({})
  constructor(private groupApi: CourseGroupApi) {}
  getGroupCourseInfo(courseId: string) {
    return this.groupApi.getGroupCourseInfo(courseId).pipe(
      tap(res => {
        this.groupInfo$.commit(() => res.info)
      })
    )
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return this.getGroupCourseInfo(to.meta.query.courseId)
  }
}
