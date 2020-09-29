import { Api } from '@/api/api'

export class PluginGroupBuyApi extends Api {
  getGroupBuyList(query: any) {
    return this.http.get(`/v1/plugin/group_buy`, {
      query
    })
  }
}
