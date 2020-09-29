import { Api } from '@/api/api'

/**
 * 团体课排期爽约惩罚
 */
export class TeamSchedulePunishApi extends Api {
  getList(query: GetListQuery) {
    return this.http.get('/v1/schedule/team/shop/punish/list', {
      query
    })
  }
  delPunishment(id: number) {
    return this.http.delete(`/v1/schedule/team/shop/punish/del/${id}`)
  }
}
export interface GetListQuery {
  page: number
  size: number
}
