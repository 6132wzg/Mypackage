import { Api } from '@/api/api'

export class ContractApi extends Api {
  getInfo(query: ID) {
    return this.http.get(`/v1/order/transaction/contract/${query.id}`)
  }
  updateDescription(orderId, params) {
    return this.http.put(
      `/v1/order/transaction/contract/description/${orderId}`,
      {
        params
      }
    )
  }
}

export interface ID {
  id: number
}
export interface UpdateDescriptionInput {
  content: string
}
