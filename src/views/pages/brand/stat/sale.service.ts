import { Injectable, ServiceRoute } from 'vue-service-app'
import { State } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { SalesApi, SaleChartParams } from '@/api/v1/stat/brand/sales.ts'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'

@Injectable()
export class SaleService {
  loading$ = new State({})
  dataLine$ = new State([])
  dataRing$ = new State([])
  featsRankList$ = new State([])
  salesRankList$ = new State([])
  chartTotal$ = new State(0)
  authTabs$ = this.authService.getAuthTabs$('brand-stat-sale')
  productType$ = this.userService.getEnumValue$(
    'report.report_product_performance'
  )

  auth$ = this.authService.authMap$({
    export: 'brand_shop:stat:revenue_reports|batch_export'
  })
  constructor(
    private salesApi: SalesApi,
    private authService: AuthService,
    private userService: UserService
  ) {}

  // 获取营收统计图信息
  getChart(query: SaleChartParams) {
    return this.salesApi.getChart(query).pipe(
      tap(res => {
        const data = res.info
        let chartRing: any = []
        let productType: any = this.productType$.snapshot() || {}
        data.product_cate.map(item => {
          chartRing.push({
            key: item.product_type,
            name: productType[item.product_type],
            value: item.value
          })
        })
        this.salesRankList$.commit(() => data.order_top)
        this.featsRankList$.commit(() => data.amount_top)
        this.dataRing$.commit(() => chartRing)
        this.chartTotal$.commit(() => data.product_cate_total)
      })
    )
  }
}
