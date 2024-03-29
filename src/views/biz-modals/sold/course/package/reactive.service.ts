import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { CourseApi, ReactiveCourseInput } from '@/api/v1/sold/course'
import { tap } from 'rxjs/operators'

@Injectable()
export class ReactiveService {
  packageInfo$ = new State({})
  loading$ = new State({})
  constructor(private courseApi: CourseApi) {}
  @Effect()
  getPackageInfo(id: string) {
    return this.courseApi.getReactiveInfo(id).pipe(
      tap((res: any) => {
        this.packageInfo$.commit(() => res.info)
      })
    )
  }
  @Effect()
  setReactive(params: ReactiveCourseInput) {
    return this.courseApi.setReactive(params)
  }
}
