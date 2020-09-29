import { CourseApi } from '@/api/v1/sold/course'
import { Injectable } from 'vue-service-app'
import { State, Effect, Action } from 'rx-state'
import {
  TransactionApi,
  MemberCouponParams,
  TransactionPriceInput
} from '@/api/v1/sold/transaction'
import { tap, switchMap, catchError, debounceTime } from 'rxjs/operators'
import { ContractApi } from '@/api/v1/setting/contract'
import { UserService } from '@/services/user.service'
import { anyAll } from '@/operators'
import { MessageService } from '@/services/message.service'
@Injectable()
export class UpgradeService {
  loading$ = new State({})
  info$ = new State({})
  saleList$ = new State([])
  advanceList$ = new State([])
  couponList$ = new State([])
  newPackageInfo$ = new State({})
  packageOptions$ = new State([])
  currentPrice$ = new State('0')
  effectiveWayOptions$ = this.userService.getOptions$(
    'package_course.effective_way'
  )
  constructor(
    private contractApi: ContractApi,
    private api: CourseApi,
    private transactionApi: TransactionApi,
    private userService: UserService,
    private msg: MessageService
  ) {}
  SET_INFO(info: any) {
    info.pay_price = `${info.pay_price}元`
    this.info$.commit(() => info)
  }
  SET_UPGRADE_PACKAGE_LIST(list: any) {
    this.packageOptions$.commit(() =>
      list.map(item => {
        return {
          product_name: item.course_name,
          id: item.id
        }
      })
    )
  }
  SET_NEW_PACKAGE_INFO(info) {
    info.courseInfo = info.is_limit
      ? info.is_total
        ? `团体课&私教课${info.total_times}次`
        : info.is_team && !info.is_personal
        ? `团体课${info.team_times}次`
        : info.is_team && !info.is_personal
        ? `私教课${info.personal_times}次`
        : info.is_team && info.is_personal
        ? `团体课${info.team_times}次/私教课${info.personal_times}次`
        : ''
      : '不限制'
    info.shopList = info.shop_list.join(',')
    this.newPackageInfo$.commit(() => info)
  }
  REST_COUPONLIST() {
    this.couponList$.commit(() => [])
  }
  SET_SALE_LIST(list) {
    list = list.map(item => {
      const { id, staff_name } = item
      return {
        value: id,
        label: staff_name
      }
    })
    this.saleList$.commit(() => list)
  }
  @Effect()
  getInfo(id: string | number) {
    return this.api.getPackageUpgradeInfo(id).pipe(
      tap((res: any) => {
        this.SET_INFO(res.info)
      })
    )
  }
  @Effect()
  getUpgradePackageList(query: any) {
    return this.api.getUpgradePackageList(query).pipe(
      tap(res => {
        this.SET_UPGRADE_PACKAGE_LIST(res.list)
      })
    )
  }
  getNewUpgradePackageInfo(id: number | string) {
    return this.api.getNewUpgradePackageInfo(id).pipe(
      tap(res => {
        this.SET_NEW_PACKAGE_INFO(res.info)
      })
    )
  }
  getSaleList() {
    return this.transactionApi.getTransactionSaleList().pipe(
      tap((res: any) => {
        this.SET_SALE_LIST(res.list)
      })
    )
  }
  // 优惠券列表
  @Effect()
  getCouponList(query: MemberCouponParams) {
    return this.transactionApi.getTransactionCouponList(query, 'member')
  }
  resetCouponList() {
    this.couponList$.commit(() => [])
  }
  // 定金
  @Effect()
  getAdvanceList(id: string | number) {
    return this.transactionApi.getTransactionAdvanceList(id).pipe(
      tap((res: any) => {
        this.advanceList$.commit(() => res.list)
      })
    )
  }
  resetAdvanceList() {
    this.advanceList$.commit(() => [])
  }
  upgrade(params: any) {
    return this.api.upgradePackage(params).pipe(
      tap(res => {
        this.msg.success({ content: '课程包升级成功' })
      })
    )
  }
  @Effect()
  getPrice(params: TransactionPriceInput) {
    return this.transactionApi.getTransactionPrice(params).pipe(
      tap(res => {
        this.currentPrice$.commit(() => res.info.price)
      })
    )
  }
  init(id: string | number) {
    return anyAll(this.getInfo(id), this.getSaleList())
  }
}
