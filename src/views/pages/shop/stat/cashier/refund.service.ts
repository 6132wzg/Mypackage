import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { CashierApi, CashierDataParams } from '@/api/v1/stat/shop/cashier'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'
import { anyAll } from '@/operators'

@Injectable()
export class RefundService {
  loading$ = new State({})
  dataToday$ = new State({})
  list$ = new State([])
  page$ = new State({})
  total$ = new State({})
  productType$ = this.userService.getOptions$('report.revenue_product_type')
  auth$ = this.authService.authMap$({
    export: 'shop:stat:cashier|refund_export'
  })

  constructor(
    private cashierApi: CashierApi,
    private authService: AuthService,
    private userService: UserService
  ) {}
  // 列表
  @Effect()
  getList(query: CashierDataParams) {
    return this.cashierApi.getRefundData(query).pipe(
      tap(res => {
        this.list$.commit(() =>
          res.list.map((item, index) => {
            item.idx || (item.idx = index)
            return item
          })
        )
        this.page$.commit(() => res.page)
      })
    )
  }
  getDataTotal(query: CashierDataParams) {
    return this.cashierApi.getRefundDataTotal(query).pipe(
      tap(res => {
        this.total$.commit(() => res.info)
      })
    )
  }
  // 获取今日实时数据
  getDataToday(query: CashierDataParams) {
    return this.cashierApi.getRefundDataToady(query).pipe(
      tap(res => {
        this.dataToday$.commit(() => res.info)
      })
    )
  }

  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return anyAll(this.getList(to.meta.query), this.getDataTotal(to.meta.query))
  }
}
