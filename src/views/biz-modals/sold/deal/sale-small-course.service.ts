import { Injectable } from 'vue-service-app'
import { State, Effect, Action } from 'rx-state'
import {
  TransactionApi,
  MemberCouponParams,
  TransactionPriceInput,
  TransactionListInput
} from '@/api/v1/sold/transaction'
import { ContractApi } from '@/api/v1/setting/contract'
import { forkJoin, EMPTY, Observable } from 'rxjs'
import { tap, switchMap, catchError, debounceTime } from 'rxjs/operators'

@Injectable()
export class SaleSmallCourseService {
  finished$ = new State({})
  loading$ = new State({})
  page$ = new State({})
  info$ = new State({})
  priceAction$: Action<any>
  priceInfo$ = new State('0')
  orderAmountPriceAction$: Action<any>
  orderAmountPrice$ = new State('0')
  memberList$ = new State({})
  courseList$ = new State([])
  saleList$ = new State({})
  couponList$ = new State([])
  coachList$ = new State({})
  personalPrice$ = new State({})

  constructor(
    private contractApi: ContractApi,
    private transactionApi: TransactionApi
  ) {
    this.priceAction$ = new Action(data$ => {
      return data$.pipe(
        this.debounceMap(),
        tap(res => {
          this.priceInfo$.commit(() => res.info.price)
        })
      )
    })
    this.orderAmountPriceAction$ = new Action(data$ => {
      return data$.pipe(
        this.debounceMap(),
        tap(res => {
          this.orderAmountPrice$.commit(() => res.info.price)
        })
      )
    })
  }
  /**
   * @description 重置优惠券列表
   * @memberof SaleSmallCourseService
   */
  REST_COUPONLIST() {
    this.couponList$.commit(() => [])
  }
  SET_LIST(list) {
    console.log('list', list)
    this.courseList$.commit(() => list)
  }
  /**
   * @description 获取当前价格的防抖
   * @returns
   * @memberof SaleSmallCourseService
   */
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
   * @description 获取小班课列表
   * @param {*} query
   * @returns
   * @memberof SaleSmallCourseService
   */
  @Effect()
  getSmallCourseList(query: TransactionListInput) {
    return this.transactionApi.getTransactionList(query).pipe(
      tap((res: any) => {
        this.page$.commit(() => res.page)
        this.finished$.commit(() => {
          return res.page.current_page >= res.page.total_pages
        })
        this.courseList$.commit((preList: any) => {
          if (res.page.current_page === 1 || !res.page.current_page) {
            preList = []
          }
          return preList.concat(res.list)
        })
      })
    )
  }
  /**
   * @description 获取小班课详情
   * @param {string} id
   * @returns
   * @memberof SaleSmallCourseService
   */
  getInfo(id: string) {
    return this.transactionApi
      .getTransactionInfo(id, 'small_course/detail')
      .pipe(
        tap((res: any) => {
          this.info$.commit(() => res.info)
        })
      )
  }
  @Effect()
  getAdvanceList(id: string | number) {
    return this.transactionApi.getTransactionAdvanceList(id)
  }
  getSaleList() {
    return this.transactionApi.getTransactionSaleList().pipe(
      tap((res: any) => {
        this.saleList$.commit(() => res.list)
      })
    )
  }
  getCouponList(params: MemberCouponParams) {
    return this.transactionApi
      .getTransactionCouponList(params, 'small_course')
      .pipe(
        tap((res: any) => {
          this.couponList$.commit(() => res.list)
        })
      )
  }
  @Effect()
  serviceInit() {
    return forkJoin(this.getSaleList())
  }
  @Effect()
  setTransactionOrder(params: any) {
    return this.transactionApi.setTransaction(params, 'small_course')
  }
  @Effect()
  setTransactionPay(params: any) {
    return this.transactionApi.setTransaction(params, 'small_course')
  }
  @Effect()
  getPrice(params: TransactionPriceInput) {
    return this.transactionApi.getTransactionPrice(params)
  }
}
