import { Injectable } from 'vue-service-app'
import { State, Effect, Action } from 'rx-state'
import {
  TransactionApi,
  MemberCouponParams,
  TransactionListInput,
  TransactionPriceInput
} from '@/api/v1/sold/transaction'
import { tap, switchMap, catchError, debounceTime } from 'rxjs/operators'
import { ContractApi } from '@/api/v1/setting/contract'
import { forkJoin, EMPTY, Observable } from 'rxjs'

@Injectable()
export class SaleMemberCardService {
  loading$ = new State({})
  finished$ = new State({})
  page$ = new State({})
  cardList$ = new State([])
  saleList$ = new State({})
  couponList$ = new State([])
  info$ = new State({})
  currentPriceAction$: Action<any>
  currentPrice$ = new State('0')
  constructor(
    private contractApi: ContractApi,
    private transactionApi: TransactionApi
  ) {
    this.currentPriceAction$ = new Action(data$ => {
      return data$.pipe(
        this.debounceMap(),
        tap(res => {
          this.currentPrice$.commit(() => res.info.price)
        })
      )
    })
  }
  REST_COUPONLIST() {
    this.couponList$.commit(() => [])
  }
  SET_LIST(list) {
    this.cardList$.commit(() => list)
  }
  REST_INFO() {
    this.info$.commit(() => [])
  }
  /**
   * 获取会员卡已上架列表
   *
   * @param {CardShelfListInput} query
   * @returns
   * @memberof SaleMemberCardService
   */
  @Effect()
  getMemberCardList(query: TransactionListInput) {
    return this.transactionApi.getTransactionList(query).pipe(
      tap((res: any) => {
        this.page$.commit(() => res.page)
        this.finished$.commit(() => {
          return res.page.current_page >= res.page.total_pages
        })
        this.cardList$.commit((preList: any) => {
          if (res.page.current_page === 1) {
            preList = []
          }
          return preList.concat(res.list)
        })
      })
    )
  }
  // 获取实时价格防抖函数
  debounceMap() {
    return (stream$: Observable<any>) =>
      stream$.pipe(
        debounceTime(200),
        switchMap((params: TransactionPriceInput) =>
          this.getPrice(params).pipe(catchError(() => EMPTY))
        )
      )
  }
  /**
   * 获取会员卡信息
   *
   * @param {string} id
   * @returns
   * @memberof SaleMemberCardService
   */
  getInfo(id: string) {
    return this.transactionApi.getTransactionInfo(id, 'member/card').pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
      })
    )
  }
  /**
   * 获取定金列表
   *
   * @param {(string | number)} id
   * @returns
   * @memberof SaleMemberCardService
   */
  @Effect()
  getAdvanceList(id: string | number) {
    return this.transactionApi.getTransactionAdvanceList(id)
  }
  /**
   * 获取销售列表
   *
   * @returns
   * @memberof SaleMemberCardService
   */
  getSaleList() {
    return this.transactionApi.getTransactionSaleList().pipe(
      tap((res: any) => {
        this.saleList$.commit(() => res.list)
      })
    )
  }
  /**
   * 获取优惠券列表
   *
   * @param {MemberCouponParams} params
   * @returns
   * @memberof SaleMemberCardService
   */
  getCouponList(params: MemberCouponParams) {
    return this.transactionApi.getTransactionCouponList(params, 'member').pipe(
      tap((res: any) => {
        this.couponList$.commit(() => res.list)
      })
    )
  }
  // 弹窗初始化
  @Effect()
  serviceInit() {
    return forkJoin(this.getSaleList())
  }
  // 签单-支付
  @Effect()
  setTransactionPay(params: any) {
    return this.transactionApi.setTransaction(params, 'member')
  }
  // 签单-创建订单
  @Effect()
  setTransactionOrder(params: any) {
    return this.transactionApi.setTransaction(params, 'member')
  }
  // 签单-获取实时价格
  @Effect()
  getPrice(params: TransactionPriceInput) {
    return this.transactionApi.getTransactionPrice(params)
  }
}
