import { Injectable } from 'vue-service-app'
import { State, Effect, Action } from 'rx-state'
import {
  TransactionApi,
  TransactionListInput,
  MemberCouponParams,
  TransactionPriceInput
} from '@/api/v1/sold/transaction'
import { tap, switchMap, catchError, debounceTime } from 'rxjs/operators'
import { ContractApi } from '@/api/v1/setting/contract'
import { forkJoin, EMPTY, Observable } from 'rxjs'
import { UserService } from '@/services/user.service'
@Injectable()
export class SaleCourseService {
  finished$ = new State({})
  loading$ = new State({})
  page$ = new State({})
  info$ = new State({})
  courseList$ = new State([])
  saleList$ = new State({})
  couponList$ = new State([])
  currentPriceAction$: Action<any>
  currentPrice$ = new State('0')
  effectiveWayOptions$ = this.userService.getOptions$(
    'package_course.effective_way'
  )
  constructor(
    private contractApi: ContractApi,
    private transactionApi: TransactionApi,
    private userService: UserService
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
    this.courseList$.commit(() => list)
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
  /**
   * @description 获取课程包列表
   * @param {GetPackageListInput} query
   * @returns
   * @memberof SaleCourseService
   */
  @Effect()
  getCourseList(query: TransactionListInput) {
    return this.transactionApi.getTransactionList(query).pipe(
      tap((res: any) => {
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
  getInfo(id: string) {
    return this.transactionApi.getTransactionInfo(id, 'package/course').pipe(
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
    return this.transactionApi.getTransactionCouponList(params, 'package').pipe(
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
    return this.transactionApi.setTransaction(params, 'package')
  }
  @Effect()
  setTransactionPay(params: any) {
    return this.transactionApi.setTransaction(params, 'package')
  }
  @Effect()
  getPrice(params: TransactionPriceInput) {
    return this.transactionApi.getTransactionPrice(params)
  }
}
