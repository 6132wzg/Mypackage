import { Injectable } from 'vue-service-app'
import { State, Effect, Action } from 'rx-state'
import {
  TransactionApi,
  TransactionListInput,
  MemberCouponParams,
  TransactionPriceInput
} from '@/api/v1/sold/transaction'
import { forkJoin, EMPTY, Observable } from 'rxjs'
import { tap, switchMap, catchError, debounceTime } from 'rxjs/operators'
import { UserService } from '@/services/user.service'

@Injectable()
export class SalePersonalCourseService {
  loading$ = new State({})
  finished$ = new State({})
  page$ = new State({})
  info$ = new State({})
  priceAction$: Action<any>
  priceInfo$ = new State('0')
  orderAmountPriceAction$: Action<any>
  orderAmountPrice$ = new State('0')
  courseList$ = new State([])
  saleList$ = new State({})
  couponList$ = new State([])
  coachList$ = new State({})
  personalPrice$ = new State({})
  coachTypeOptions$ = this.userService.getOptions$('personal_course.coach_type')

  constructor(
    private transactionApi: TransactionApi,
    private userService: UserService
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
  REST_COUPONLIST() {
    this.couponList$.commit(() => [])
  }
  SET_LIST(list) {
    this.courseList$.commit(() => list)
  }
  /**
   * @description 获取私教课列表
   * @param {GetPersonalBrandCourseListInput} query
   * @returns
   * @memberof SalePersonalCourseService
   */
  @Effect()
  getPresonalCourseList(query: TransactionListInput) {
    return this.transactionApi.getTransactionList(query).pipe(
      tap(res => {
        this.page$.commit(() => res.page)
        this.finished$.commit(() => {
          return res.page.current_page >= res.page.total_pages
        })
        this.courseList$.commit((preList: any) => {
          if (res.page.current_page === 1) {
            preList = []
          }
          return preList.concat(res.list)
        })
      })
    )
  }
  debounceMap() {
    return (stream$: Observable<any>) =>
      stream$.pipe(
        debounceTime(200),
        switchMap((params: TransactionPriceInput) =>
          this.getPrice(params).pipe(catchError(() => EMPTY))
        )
      )
  }
  getInfo(id: string) {
    return this.transactionApi.getTransactionInfo(id, 'personal/course').pipe(
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
      .getTransactionCouponList(params, 'personal')
      .pipe(
        tap((res: any) => {
          this.couponList$.commit(() => res.list)
        })
      )
  }
  getCoachList(level: number, id: string) {
    return this.transactionApi.getTransactionCoachList(level, id).pipe(
      tap((res: any) => {
        this.coachList$.commit(() => res.list)
      })
    )
  }
  @Effect()
  getPersonalPriceInfo(params: {
    id: number
    buy_num: number
    coach_level_id: number
  }) {
    return this.transactionApi.getPersonalCoursePrice(params).pipe(
      tap((res: any) => {
        this.personalPrice$.commit(() => res.info)
      })
    )
  }
  @Effect()
  serviceInit() {
    return forkJoin(this.getSaleList())
  }
  @Effect()
  setTransactionOrder(params: any) {
    return this.transactionApi.setTransaction(params, 'personal')
  }
  @Effect()
  setTransactionPay(params: any) {
    return this.transactionApi.setTransaction(params, 'personal')
  }
  @Effect()
  getPrice(params: TransactionPriceInput) {
    return this.transactionApi.getTransactionPrice(params)
  }
}
