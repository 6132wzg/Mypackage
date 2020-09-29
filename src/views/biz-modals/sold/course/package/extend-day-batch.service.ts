import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { CourseApi } from '@/api/v1/sold/course'
import { tap } from 'rxjs/operators'

@Injectable()
export class ExtendDayBatchService {
  loading$ = new State({})
  list_num$ = new State(0)
  constructor(private courseApi: CourseApi) {}
  getPackageTaskNum(params: any) {
    return this.courseApi.getPackageTaskNum(params).pipe(
      tap((res: any) => {
        this.list_num$.commit(() => res.list_num)
      })
    )
  }
  @Effect()
  taskExtendDays(params: any) {
    return this.courseApi.taskExtendDaysInPackage(params)
  }
}
