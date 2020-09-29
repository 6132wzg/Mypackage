import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { CourseApi, ReactiveCourseInput } from '@/api/v1/sold/course'
import { tap } from 'rxjs/operators'
import { MessageService } from '@/services/message.service'

@Injectable()
export class MemberChangeService {
  packageInfo$ = new State({})
  loading$ = new State({})
  constructor(private courseApi: CourseApi, private msg: MessageService) {}
  @Effect()
  getMemberInfo(id: string) {
    return this.courseApi.getMemberInfo(id).pipe(
      tap((res: any) => {
        this.packageInfo$.commit(() => res.info || res.list)
      })
    )
  }
  @Effect()
  setMember(params: any) {
    return this.courseApi.setMember(params).pipe(
      tap(res => {
        this.msg.success({ content: '修改成员成功' })
      })
    )
  }
}
