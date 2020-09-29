import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { OrderApi } from '@/api/v1/finance/order'
import { tap } from 'rxjs/operators'

@Injectable()
export class DetailService {
  info$ = new State({})
  loading$ = new State({})
  constructor(private orderApi: OrderApi) {}
  // 获取定金订单详情
  @Effect()
  getInfo(id: string) {
    return this.orderApi.getOrderInfo(id).pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
      })
    )
  }
}
