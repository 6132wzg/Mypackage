import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import {
  FinanceAdvanceFeeApi,
  UpdateRenewalInput
} from '@/api/v1/finance/advance_fee'
import { tap } from 'rxjs/operators'
@Injectable()
export class RenewalService {
  info$ = new State({})
  loading$ = new State({})
  constructor(private financeAdvanceApi: FinanceAdvanceFeeApi) {}
  // 获取定金订单详情
  @Effect()
  getInfo(id: number) {
    return this.financeAdvanceApi.getRenewalInfo(id).pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
      })
    )
  }
  @Effect()
  updateRenewal(id, params: UpdateRenewalInput) {
    return this.financeAdvanceApi.updateRenewal(id, params)
  }
}
