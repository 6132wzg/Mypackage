import { Injectable, ServiceRoute, Controller } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { MemberApi } from '@/api/v1/member'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'
import { MessageService } from '@/services/message.service'
import { forkJoin } from 'rxjs'

@Injectable()
export class StudioService implements Controller {
  loading$ = new State({})
  list$ = new State({})
  page$ = new State({})
  memberLevel$ = new State({})
  buyPersonalCourse$ = this.userService.getOptions$(
    'member.buy_personal_course',
    {
      addAll: true
    }
  )
  saleList$ = new State({})
  coachList$ = new State({})
  labelLsit$ = new State({})
  auth$ = this.authService.authMap$({
    add: 'shop:member:member|add',
    import: 'shop:member:member|import',
    tag: 'shop:member:member|tag',
    bindCoach: 'shop:member:member|bind_coach',
    bindSalesman: 'shop:member:member|bind_salesman',
    export: 'shop:member:member|export'
  })
  constructor(
    private memberApi: MemberApi,
    private authService: AuthService,
    private userService: UserService,
    private message: MessageService
  ) {}
  @Effect()
  getListInfo(paramsObj: any) {
    return this.memberApi.getMember(paramsObj).pipe(
      tap(res => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  removeWechatBind(id: number) {
    return this.memberApi.removeWechatBind(id)
  }
  getMemberSourceRegisters() {
    return this.memberApi.getMemberSourceRegisters()
  }
  // 清空指纹信息
  deleteMemberFinger(id: string) {
    return this.memberApi.deleteMemberFinger(id).pipe(
      tap(res => {
        this.message.success({ content: '指纹信息清空成功' })
      })
    )
  }
  // 清空硬件（储物柜）密码
  deleteMemberCabinetPassword(id: string) {
    return this.memberApi.deleteMemberCabinetPassword(id).pipe(
      tap(res => {
        this.message.success({ content: '硬件密码清空成功' })
      })
    )
  }
  getMemberLevel() {
    return this.memberApi.getMemberLevel().pipe(
      tap(res => {
        this.memberLevel$.commit(() => res.list)
      })
    )
  }
  getSaleList(query: any) {
    return this.memberApi.getSaleList(query).pipe(
      tap(res => {
        this.saleList$.commit(() => {
          return [{ id: -1, sale_name: '全部' }, ...res.list]
        })
      })
    )
  }
  getCoachList(query: any) {
    return this.memberApi.getCoachList(query).pipe(
      tap(res => {
        this.coachList$.commit(() => {
          return [{ id: -1, coach_name: '全部' }, ...res.list]
        })
      })
    )
  }
  getLabelList() {
    return this.memberApi.getMemberLableList().pipe(
      tap(res => {
        this.labelLsit$.commit(() => {
          return [{ id: -1, tag_name: '全部' }, ...res.list]
        })
      })
    )
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return this.getListInfo(to.meta.query)
  }
  beforeRouteEnter(to: ServiceRoute) {
    return forkJoin(
      this.getMemberLevel(),
      this.getCoachList({}),
      this.getSaleList({}),
      this.getLabelList()
    )
  }
}
