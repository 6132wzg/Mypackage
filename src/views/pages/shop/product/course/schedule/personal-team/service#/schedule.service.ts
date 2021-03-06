import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import {
  PersonalTeamScheduleScheduleApi,
  AddScheduleInput,
  UpdateScheduleInput,
  CopyScheduleInput,
  GetScheduleListQuery
} from '@/api/v1/schedule/personal-team/schedule'
import { AuthService } from '@/services/auth.service'
import { MessageService } from '@/services/message.service'

@Injectable()
export class PersonalTeamScheduleScheduleService {
  courseList$ = new State([])
  scheduleTable$ = new State({})
  smallTemplateList$ = new State([])
  loading$ = new State({})
  auth$ = this.authService.authMap$({
    add: 'shop:schedule:personal_team_course_schedule|add',
    addBatch: 'shop:schedule:personal_team_course_schedule|batch_add',
    copy: 'shop:schedule:personal_team_course_schedule|copy'
  })
  constructor(
    private scheduleApi: PersonalTeamScheduleScheduleApi,
    private authService: AuthService,
    private msg: MessageService
  ) {}
  /**
   *
   * @param params
   * 获取团体课排期列表
   */
  @Effect()
  getList(query: GetScheduleListQuery) {
    return this.scheduleApi.getList(query).pipe(
      tap(res => {
        this.courseList$.commit(() => res.list)
      })
    )
  }
  /**
   *
   * @param params
   * 获取团体课排期表格
   */
  @Effect()
  getTable(query: any) {
    return this.scheduleApi.getTable({ size: 999, ...query }).pipe(
      tap(res => {
        const _table = [] as any[]
        const dateList = Array.from(
          new Set(res.list.map((item: any) => item.start_date))
        )
        dateList.forEach((ele: any) => {
          let temp: any[] = []
          let daySchedule: any = { date: ele, data: [] }
          res.list.forEach((item: any) => {
            if (item.start_date === ele) {
              temp.push(item)
            }
          })
          daySchedule.data = temp
          _table.push(daySchedule)
        })
        this.scheduleTable$.commit(() => _table)
      })
    )
  }
  /**
   *
   * @param params
   * 新增团体课排期
   */
  add(params: AddScheduleInput) {
    return this.scheduleApi.add(params).pipe(
      tap(res => {
        this.msg.success({ content: '新增成功' })
      })
    )
  }
  addScheduleInBatch(params: AddScheduleInput[]) {
    return this.scheduleApi.addScheduleInBatch(params).pipe(
      tap(res => {
        this.msg.success({ content: '批量新增成功' })
      })
    )
  }
  /**
   *
   * @param params
   * 复制团体课排期
   */
  copy(params: CopyScheduleInput) {
    return this.scheduleApi.copy(params).pipe(
      tap(res => {
        this.msg.success({ content: '复制成功' })
      })
    )
  }
  /**
   *
   * @param params
   * 编辑课程排期
   */
  update(params: UpdateScheduleInput) {
    return this.scheduleApi.update(params).pipe(
      tap(res => {
        this.msg.success({ content: '编辑成功' })
      })
    )
  }
  /**
   *
   * @param params
   * 编辑课程排期回显
   */
  getUpdateInfo(id: string) {
    return this.scheduleApi.getUpdateInfo(id)
  }
  /**
   *
   * @param params
   * 取消团体课排期
   */
  del(id: string) {
    return this.scheduleApi.del(id).pipe(
      tap(res => {
        this.msg.success({ content: '取消成功' })
      })
    )
  }
  /**
   * 获取私教小团课周课表管理列表
   */
  @Effect()
  getSmallTemplate() {
    return this.scheduleApi.getSmallTemplate().pipe(
      tap(res => {
        this.smallTemplateList$.commit(() => res.list)
      })
    )
  }
  /**
   * 删除团课
   */
  delSmallTemplate(params: any) {
    return this.scheduleApi.delSmallTemplate(params)
  }
}
