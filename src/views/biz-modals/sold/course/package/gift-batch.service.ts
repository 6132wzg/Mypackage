import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { CourseApi } from '@/api/v1/sold/course'
import { tap } from 'rxjs/operators'
@Injectable()
export class GiftBatchService {
  listNum$ = new State(0)
  constructor(private courseApi: CourseApi) {}
  getPackageTaskNum(params: any) {
    return this.courseApi.getPackageTaskNum(params).pipe(
      tap((res: any) => {
        this.listNum$.commit(() => res.list_num)
      })
    )
  }
  setGiftPackage(params: any) {
    return this.courseApi.setGiftPackage(params)
  }
}
