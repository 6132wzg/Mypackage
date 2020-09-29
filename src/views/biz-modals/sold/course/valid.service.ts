import { Injectable } from 'vue-service-app'
import { CourseApi } from '@/api/v1/sold/course'
import { tap } from 'rxjs/operators'
import { State, Effect } from 'rx-state'
import { MessageService } from '@/services/message.service'

@Injectable()
export class ValidService {
  loading$ = new State({})
  packageInfo$ = new State({})
  constructor(private courseApi: CourseApi, private msg: MessageService) {}
  @Effect()
  setValidCourse(id: any) {
    return this.courseApi.setValidCourse(id).pipe(
      tap(() => {
        this.msg.success({ content: '课程生效成功' })
      })
    )
  }
  getValidInfo(id: any) {
    return this.courseApi.getValidInfo(id).pipe(
      tap(res => {
        this.packageInfo$.commit(() => res.info)
      })
    )
  }
}
