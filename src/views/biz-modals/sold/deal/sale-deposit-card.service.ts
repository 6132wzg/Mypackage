import { Injectable } from 'vue-service-app'
import { State, Effect, Action } from 'rx-state'
import {
  TransactionApi,
  TransactionListInput,
  TransactionPriceInput,
  MemberCouponParams
} from '@/api/v1/sold/transaction'
import { tap, switchMap, catchError, debounceTime } from 'rxjs/operators'
import { ContractApi } from '@/api/v1/setting/contract'
import { forkJoin, EMPTY } from 'rxjs'

@Injectable()
export class SaleDepositCardService {
  priceAction$: Action<any>
  priceInfo$ = new State('0')
  finished$ = new State({})
  loading$ = new State({})
  page$ = new State({})
  info$ = new State({})
  cardList$ = new State([])
  saleList$ = new State({})
  couponList$ = new State({})
  constructor(
    private contractApi: ContractApi,
    private transactionApi: TransactionApi
  ) {
    this.priceAction$ = new Action(data$ => {
      return data$.pipe(
        debounceTime(200),
        switchMap((params: TransactionPriceInput) =>
          this.getPrice(params).pipe(catchError(() => EMPTY))
        ),
        tap(res => {
          this.priceInfo$.commit(() => res.info.price)
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
  /**
   * @description 获取储值卡已上架列表
   * @param {CardShelfListInput} query
   * @returns
   * @memberof SaleDepositCardService
   */
  @Effect()
  getDepositCardList(query: TransactionListInput) {
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
  /**
   * 获取储值卡详情
   *
   * @param {string} id
   * @returns
   * @memberof SaleDepositCardService
   */
  getInfo(id: string) {
    return this.transactionApi.getTransactionInfo(id, 'deposit/card').pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
      })
    )
  }
  /**
   * @description 获取销售列表
   * @returns
   * @memberof SaleDepositCardService
   */
  getSaleList() {
    return this.transactionApi.getTransactionSaleList().pipe(
      tap((res: any) => {
        this.saleList$.commit(() => res.list)
      })
    )
  }
  getCouponList(params: MemberCouponParams) {
    return this.transactionApi.getTransactionCouponList(params, 'deposit').pipe(
      tap((res: any) => {
        this.couponList$.commit(() => res.list)
      })
    )
  }
  @Effect()
  getAdvanceList(id: string | number) {
    return this.transactionApi.getTransactionAdvanceList(id)
  }
  @Effect()
  serviceInit() {
    return forkJoin(this.getSaleList())
  }
  @Effect()
  setTransaction(params: any) {
    return this.transactionApi.setTransaction(params, 'deposit')
  }
  @Effect()
  setTransactionPay(params: any) {
    return this.transactionApi.setTransaction(params, 'deposit')
  }
  @Effect()
  getPrice(params: TransactionPriceInput) {
    return this.transactionApi.getTransactionPrice(params)
  }
}
