import { Injectable, ServiceRoute, Controller } from 'vue-service-app'
import { State } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { OrderApi, OrderChartParams } from '@/api/v1/stat/brand/order.ts'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'

@Injectable()
export class OrdersService {
  chartData$ = new State<object[]>([])
  fields$ = new State([])
  fieldsMap$ = new State({})
  page$ = new State({})
  total$ = new State({})
  loading$ = new State({})

  productType$ = this.userService.getEnumValue$('report.revenue_product_type')
  authTabs$ = this.authService.getAuthTabs$('brand-stat-orders')
  auth$ = this.authService.authMap$({
    export: 'brand:stat:order_reports|batch_export'
  })
  constructor(
    private orderApi: OrderApi,
    private authService: AuthService,
    private userService: UserService
  ) {}
  // 获取营收统计图信息
  getChart(query: OrderChartParams) {
    const small_course = this.userService.c('small_course')
    return this.orderApi.getChart(query).pipe(
      tap(res => {
        const fieldsMap = res.title_list || []
        let list: any = res.list || []
        let productType: any = this.productType$.snapshot() || {}
        let fields: any = []
        // let fieldsMap: any = {}
        fields = Object.keys(fieldsMap)
        // fields.push('per_order_price')
        // fieldsMap['per_order_price'] = '客单价'
        list = list.map(item => ({
          ...item,
          per_order_price: 0,
          type: productType[item.product_type],
          key2: 'per_order_price',
          name2: '客单价',
          value2: item.per_order_price
        }))
        this.fields$.commit(() => fields)
        this.fieldsMap$.commit(() => fieldsMap)
        this.chartData$.commit(() => list)
      })
    )
  }
}
