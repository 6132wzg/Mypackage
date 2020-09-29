import { Injectable } from 'vue-service-app'
import { MarketingApi } from '@/api/v1/marketing/marketing'
import { tap } from 'rxjs/operators'
import { State, computed } from 'rx-state'
import { forkJoin } from 'rxjs'

@Injectable()
export class CenterService {
  operation$ = new State([])
  pluginList$ = new State([])
  constructor(private marketingApi: MarketingApi) {}
  getList() {
    return this.marketingApi.getMarketCenterList().pipe(
      tap(res => {
        this.pluginList$.commit(() => res.list)
      })
    )
  }
  getMarktingOperationInfo() {
    return this.marketingApi.getMarktingOperationInfo().pipe(
      tap(res => {
        this.operation$.commit(() => res.info.operation)
      })
    )
  }
  init() {
    return forkJoin(this.getMarktingOperationInfo(), this.getList())
  }
  beforeRouteEnter() {
    return this.init()
  }
}
