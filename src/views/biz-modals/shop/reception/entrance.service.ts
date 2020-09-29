import { UserService } from '@/services/user.service'
import { Injectable, Controller } from 'vue-service-app'
import { State, Effect, Action } from 'rx-state'
import {
  FrontApi,
  SetEntranceInput,
  EditEntranceCabinetInput,
  EditSellerInput,
  EditCoachInput,
  GetCabinetInput
} from '@/api/v1/front'
import { OrderApi, OrderDescription } from '@/api/v1/finance/order'
import { MemberApi, EditFaceParams } from '@/api/v1/member'
import { tap } from 'rxjs/operators'
import { forkJoin } from 'rxjs'
import { AuthService } from '@/services/auth.service'

@Injectable()
export class EntranceService implements Controller {
  loading$ = new State({})
  page$ = new State([])
  sellerList$ = new State([])
  coachList$ = new State([])
  entranceList$ = new State([])
  cardList$ = new State([])
  courseList$ = new State([])
  cabinetList$ = new State([])
  parent_types$ = this.userService.getOptions$('small_course.parent_type')
  auth$ = this.authService.authMap$({
    checkin: 'shop:front_end:check_in_out|checkin', // 入场
    checkout: 'shop:front_end:check_in_out|checkout', // 离场
    bindCoach: 'shop:member:member|bind_coach', // 编辑教练
    bindSalesman: 'shop:member:member|bind_salesman', // 编辑销售
    editMember: 'shop:member:member|edit', // 编辑会员信息
    editFace: 'brand_shop:iot:face|edit',
    delFace: 'shop:member:member|del_face',
    editTag: 'shop:member:member|tag', // 编辑标签
    editCardNum: 'shop:member:member|bind_card', // 编辑标签
    entranceCheckin: 'shop:front_end:check_in_out|entrance_checkin' // 凭课入场直接签到
  })
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private frontApi: FrontApi,
    private memberApi: MemberApi,
    private orderApi: OrderApi
  ) {}
  /**
   * 获取销售列表
   *
   * @returns
   * @memberof IndexService
   */
  @Effect()
  getSellerList() {
    return this.frontApi.getSellerList().pipe(
      tap((res: any) => {
        this.sellerList$.commit(() => res.list)
      })
    )
  }
  /**
   * 获取教练列表
   *
   * @returns
   * @memberof IndexService
   */
  @Effect()
  getCoachList() {
    return this.frontApi.getCoachList().pipe(
      tap((res: any) => {
        this.coachList$.commit(() => res.list)
      })
    )
  }
  // 获取会员详情
  @Effect()
  getMemberInfo(id: string) {
    return this.frontApi.getMemberInfo(id)
  }
  // 会员入场
  @Effect()
  setEntrance(params: SetEntranceInput) {
    return this.frontApi.setEntrance(params)
  }
  // 获取入场凭证列表
  @Effect()
  getEntranceOptionList(id: string) {
    return this.frontApi.getEntranceOptionList(id).pipe(
      tap((res: any) => {
        this.cardList$.commit(() => res.card_list)
        this.courseList$.commit(() => res.course_list)
      })
    )
  }
  // 重置入场凭证列表
  resetEntranceOptionList() {
    this.cardList$.commit(() => [])
    this.courseList$.commit(() => [])
  }
  // 获取储物柜列表
  @Effect()
  getCabinetList(id: string, params: GetCabinetInput) {
    return this.frontApi.getCabinetList(id, params).pipe(
      tap((res: any) => {
        this.cabinetList$.commit(() => {
          return [...res.list]
        })
      })
    )
  }
  setCabinetList(list) {
    this.cabinetList$.commit(() => list)
  }
  // 重置储物柜列表
  resetCabinetList() {
    this.cabinetList$.commit(() => [])
  }
  // 修改入场会员储物柜
  editEntranceCabinet(params: EditEntranceCabinetInput) {
    return this.frontApi.editEntranceCabinet(params)
  }
  // 修改实体卡号
  getMemberPhysicalBind(id: any, data: any) {
    return this.memberApi.getMemberPhysicalBind(id, data)
  }
  // 编辑会员信息
  updateMemberEdit(id: string, params: any) {
    return this.memberApi.setBasicInfo(id, params)
  }
  // 离场之前获取柜子信息进行判断是否是智能柜
  @Effect()
  getCabinetInfo(id: string) {
    return this.frontApi.getCabinetInfo(id)
  }
  // 离场
  @Effect()
  setEntranceLeave(id: string) {
    return this.frontApi.setEntranceLeave(id)
  }
  // 修改跟进销售
  @Effect()
  editSeller(params: EditSellerInput) {
    return this.frontApi.editSeller(params)
  }
  // 修改跟进教练
  @Effect()
  editCoach(params: EditCoachInput) {
    return this.frontApi.editCoach(params)
  }
  // 修改人脸图片
  @Effect()
  editFace(id: number, params: EditFaceParams) {
    return this.memberApi.updateUserFace(id, params)
  }
  @Effect()
  addDescription(params: OrderDescription) {
    return this.orderApi.addOrderDescription(params)
  }
  // 修改会员标签
  getMemberLabelDelete(obj: any) {
    return this.memberApi.getMemberLabelDelete(obj)
  }
  init() {
    return forkJoin(this.getSellerList(), this.getCoachList())
  }
  beforeEach() {
    return this.init()
  }
}
