import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { TransactionApi } from '@/api/v1/sold/transaction'
import { tap } from 'rxjs/operators'

@Injectable()
export class PaymentService {
  payments$ = new State([])
  constructor(private transactionApi: TransactionApi) {}
  @Effect()
  getPaymentMethodList(order_id: number) {
    return this.transactionApi.getPaymentMethodList(order_id).pipe(
      tap((res: any) => {
        let PosList = res.list.filter(payment => payment.payment_type > 32)
        let NoPosList = res.list.filter(payment => payment.payment_type <= 32)
        let list = PosList.concat(NoPosList)
        console.log('PosList', PosList)
        console.log('NoPosList', NoPosList)
        console.log('list', list)
        this.payments$.commit(() => list)
      })
    )
  }
}
