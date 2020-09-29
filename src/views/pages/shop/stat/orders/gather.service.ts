import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { OrderApi, OrderDataParams } from '@/api/v1/stat/shop/order.ts'

import { UserService } from '@/services/user.service'
import { AuthService } from '@/services/auth.service'
import { anyAll } from '@/operators'
@Injectable()
export class GatherService {
  loading$ = new State({})
  list$ = new State([])
  rowSpanMap$ = new State({})
  total$ = new State({})

  transferType$ = this.userService.getEnumValue$('report.report_transfer_type')
  auth$ = this.authService.authMap$({
    export: 'shop:stat:order|collect_export'
  })
  constructor(
    private orderApi: OrderApi,
    private userService: UserService,
    private authService: AuthService
  ) {}
  SET_ROWSPAN_MAP(list: any = []) {
    let rowSpanMap: any = {}
    list.map((item, index) => {
      if (rowSpanMap[item.transfer_type]) {
        rowSpanMap[item.transfer_type].length += 1
      } else {
        rowSpanMap[item.transfer_type] = { length: 1, firstKey: index }
      }
    })
    this.rowSpanMap$.commit(() => rowSpanMap)
  }
  // 列表
  @Effect()
  getList(query: OrderDataParams) {
    return this.orderApi.getData(query).pipe(
      tap(res => {
        let list: any = []
        res.list.map(item => (list = [...list, ...item.list]))
        this.SET_ROWSPAN_MAP(list)
        this.list$.commit(() => list)
      })
    )
  }
  getDataTotal(query: OrderDataParams) {
    return this.orderApi.getDataTotal(query).pipe(
      tap(res => {
        this.total$.commit(() => res.info)
      })
    )
  }

  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return anyAll(this.getList(to.meta.query), this.getDataTotal(to.meta.query))
  }
}
