import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { CourseApi, ReactiveCourseInput } from '@/api/v1/sold/course'
import { tap } from 'rxjs/operators'
import { MessageService } from '@/services/message.service'

@Injectable()
export class UpdateExpirationDateService {
  packageInfo$ = new State({})
  loading$ = new State({})
  constructor(private courseApi: CourseApi, private msg: MessageService) {}
  @Effect()
  getPackageInfo(id: string) {
    return this.courseApi.getValidTime(id).pipe(
      tap((res: any) => {
        this.packageInfo$.commit(() => res.info)
      })
    )
  }
  @Effect()
  setValidTime(params: any) {
    return this.courseApi.setValidTime(params).pipe(
      tap(res => {
        this.msg.success({ content: '修改日期成功' })
      })
    )
  }
}
