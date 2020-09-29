import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import {
  SoldPersonalCourseApi,
  DeductInput
} from '@/api/v1/sold/course/personal'
import { tap } from 'rxjs/operators'
import { MessageService } from '@/services/message.service'

@Injectable()
export class DeductService {
  info$ = new State({})
  infoItems$ = new State([])
  loading$ = new State({})
  constructor(
    private courseApi: SoldPersonalCourseApi,
    private messageService: MessageService
  ) {}
  SET_INFO_ITEMS(info) {
    this.infoItems$.commit(() => {
      return [
        {
          key: 'course_name',
          label: '课程名称',
          value: info.course_name
        },
        {
          key: 'member_name',
          label: '会员姓名',
          value: info.member_name
        },
        {
          key: 'personal_course_remain',
          label: '剩余课时',
          value: info.personal_course_remain
        },
        {
          key: 'phone',
          label: '手机号码',
          value: info.phone
        },
        {
          key: 'buy_course_num',
          label: '购买课时',
          value: info.buy_course_num
        },
        {
          key: 'buy_time',
          label: '生效日期',
          value: info.buy_time
        },
        {
          key: 'end_time',
          label: '到期日期',
          value: info.end_time
        },
        {
          key: 'order_status',
          label: '订单状态',
          value: info.order_status.value
        }
      ]
    })
  }
  @Effect()
  getInfo(id: number) {
    return this.courseApi.getDeductionInfo(id).pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
        this.SET_INFO_ITEMS(res.info)
      })
    )
  }
  @Effect()
  deduct(id: number, params: DeductInput) {
    return this.courseApi.deduct(id, params)
  }
}
