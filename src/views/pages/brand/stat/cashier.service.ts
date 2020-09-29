import { Injectable, ServiceRoute } from 'vue-service-app'
import { State } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { CashierApi, CashierChartParams } from '@/api/v1/stat/brand/cashier'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'

@Injectable()
export class CashierService {
  dataLine$ = new State([])
  dataRing$ = new State([])
  currentRouteTag$ = new State({})
  dataRingTotal$ = new State(0)
  authTabs$ = this.authService.getAuthTabs$('brand-stat-cashier')
  auth$ = this.authService.authMap$({
    export: 'brand_shop:stat:revenue_reports|batch_export'
  })
  productType$ = this.userService.getEnumValue$('report.revenue_product_type')
  payChannel$ = this.userService.getEnumValue$('finance.pay_channel')

  constructor(
    private cashierApi: CashierApi,
    private authService: AuthService,
    private userService: UserService
  ) {}
  // 获取营收统计图信息
  getChart(query: CashierChartParams, currentRouteTag: any) {
    return this.cashierApi.getChart(query, currentRouteTag).pipe(
      tap(res => {
        const {
          trend,
          percent: { list = [], total_price = 0 }
        } = res
        let chartRing: any = []
        let dataLine: any = []
        let payChannel: any = this.payChannel$.snapshot()
        payChannel = {
          ...(payChannel || {}),
          '-1': currentRouteTag === 'income' ? '收银总额' : '退款总额'
        }
        // 按照顺序拼接数组
        trend.map(itemList => {
          const pay_channel = itemList.pay_channel
          itemList.list &&
            itemList.list.map(item => {
              dataLine.push({
                key: item.pay_channel || pay_channel,
                name: payChannel[item.pay_channel || pay_channel] || '',
                value: item.total_price,
                date: item.date
              })
            })
        })
        list.map(item => {
          chartRing.push({
            key: item.pay_channel,
            name: payChannel[item.pay_channel],
            value: item.total_price,
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
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    // this.getChart(to.meta.query, to.path)
    return this.currentRouteTag$.commit(() =>
      to.path === '/brand/stat/cashier/income' ? 'income' : 'refund'
    )
  }
}
