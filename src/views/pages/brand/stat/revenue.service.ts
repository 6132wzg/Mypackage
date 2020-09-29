import { Injectable, ServiceRoute } from 'vue-service-app'
import { State } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { RevenueApi, RevenueChartParams } from '@/api/v1/stat/brand/revenue'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'

@Injectable()
export class RevenueService {
  dataLine$ = new State([])
  dataRing$ = new State([])
  dataRingTotal$ = new State(0)
  authTabs$ = this.authService.getAuthTabs$('brand-stat-revenue')
  auth$ = this.authService.authMap$({
    export: 'brand_shop:stat:revenue_reports|batch_export'
  })
  productType$ = this.userService.getEnumValue$('report.revenue_product_type')

  constructor(
    private revenueApi: RevenueApi,
    private authService: AuthService,
    private userService: UserService
  ) {}
  // 获取营收统计图信息
  getChart(query: RevenueChartParams) {
    return this.revenueApi.getChart(query).pipe(
      tap(res => {
        const {
          trend,
          trend_sort = [],
          percent: { list = [], total_price = 0 }
        } = res.course_summer
        const chartData: any = []
        let productType: any = this.productType$.snapshot() || {}
        let chartRing: any = []
        let dataLine: any = []
        // 按照顺序拼接数组
        trend_sort &&
          trend_sort.map(key => {
            trend[key] &&
              trend[key].map(item => {
                dataLine.push({
                  key: item.product_type,
                  name: productType[item.product_type],
                  value: item.total_amount,
                  date: item.stat_date
                })
              })
          })
        list.map(item => {
          chartRing.push({
            key: item.product_type,
            name: productType[item.product_type],
            value: item.total_amount,
            percent: item.percent
          })
        })
        console.log(chartRing, total_price)
        this.dataRing$.commit(() => chartRing)
        this.dataRingTotal$.commit(() => Number(total_price))
        this.dataLine$.commit(() => dataLine)
      })
    )
  }
}
