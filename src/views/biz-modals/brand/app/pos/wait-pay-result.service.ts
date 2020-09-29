import { PluginBodyApi } from '@/api/v1/plugin/body'
import { State, Effect } from 'rx-state'
import { Injectable } from 'vue-service-app'
import { TransactionApi } from '@/api/v1/sold/transaction'
import { tap } from 'rxjs/operators'
export interface OrderPaymentParams {
  order_id: number
  price: string
  deposit_id: number
  pay_channel: number
  description: string
}
@Injectable()
export class WaitPayResultService {
  loading$ = new State({})
  info$ = new State({})
  constructor(
    private pluginBodyApi: PluginBodyApi,
    private transactionApi: TransactionApi
  ) {}
  @Effect()
  addPos(img_name: string) {
    return this.pluginBodyApi.addBodyAlbumTemplate(img_name)
  }
  @Effect()
  payTransaction(params: OrderPaymentParams) {
    return this.transactionApi.payTransaction(params).pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
      })
    )
  }
  editBaseInfo() {}
  editBankCard() {}
}
