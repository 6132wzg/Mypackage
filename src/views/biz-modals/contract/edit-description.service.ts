import {
  ContractApi,
  UpdateDescriptionInput
} from '@/api/v1/order/transaction/contract'
import { Injectable } from 'vue-service-app'
import { Effect, State } from 'rx-state'

@Injectable()
export class EditDescriptionService {
  loading$ = new State({})
  constructor(private contractApi: ContractApi) {}
  @Effect()
  updateContractDescription(orderId: number, params: UpdateDescriptionInput) {
    return this.contractApi.updateDescription(orderId, params)
  }
}
