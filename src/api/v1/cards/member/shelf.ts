import { Api } from '@/api/api'

export class ShelfApi extends Api {
  getShelfList(id: number, query: GetShelfListInput) {
    return this.http.get(`/v1/cards/member/shelf/shop/${id}`, {
      query
    })
  }
}

export interface GetShelfListInput {
  size?: number
  current_page?: number
  shelf_status?: number
}
