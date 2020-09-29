import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { CourseApi } from '@/api/v1/sold/course'
import { tap } from 'rxjs/operators'
import { MessageService } from '@/services/message.service'

@Injectable()
export class DeductionService {
  packageInfo$ = new State({})
  loading$ = new State({})
  constructor(private courseApi: CourseApi, private msg: MessageService) {}
  @Effect()
  SET_INFO(info) {
    let infoArr = [
      {
        label: '购课人',
        value: info.member_name
      },
      {
        label: `${info.is_children ? '家长手机号' : '手机号'}`,
        value: info.phone
      },
      {
        label: '剩余课时',
        value: info.remain_course_num
      }
    ]
    this.packageInfo$.commit(() => {
      return { ...info, infoArr }
    })
  }
  getDeduction(id: number | string) {
    return this.courseApi.getDeduction(id).pipe(
      tap((res: any) => {
        this.SET_INFO(res.info)
      })
    )
  }
  setDeduction(params: any) {
    return this.courseApi.setDeduction(params).pipe(
      tap(res => {
        this.msg.success({ content: '课程包扣次成功' })
      })
    )
  }
}
