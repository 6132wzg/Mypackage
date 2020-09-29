import { Api } from '@/api/api'

export class PluginSignUpApi extends Api {
  getSignUpList(query: any) {
    return this.http.get(`/v1/plugin/sign_up`, {
      query
    })
  }
}
