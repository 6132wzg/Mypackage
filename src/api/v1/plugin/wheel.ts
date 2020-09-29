import { Api } from '@/api/api'

export class PluginWheelApi extends Api {
  getWheelList(query: any) {
    return this.http.get(`/v1/plugin/wheel`, {
      query
    })
  }
}
