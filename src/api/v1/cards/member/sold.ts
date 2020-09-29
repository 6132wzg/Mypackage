import { Api } from '@/api/api'

export class SoldApi extends Api {
  getSyncInfo(id: number) {
    return this.http.get(`/v1/cards/member/sold/sync/${id}`)
  }
  sync(id: number, params) {
    return this.http.put(`/v1/cards/member/sold/sync/${id}`, {
      params
    })
  }
}
