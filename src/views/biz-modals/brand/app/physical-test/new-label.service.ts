import { Injectable } from 'vue-service-app'
import { PluginBodyApi } from '@/api/v1/plugin/body'
import { State, Effect } from 'rx-state'
@Injectable()
export class NewLableService {
  loading$ = new State({})
  constructor(private pluginBodyApi: PluginBodyApi) {}
  @Effect()
  addBodyLabel(img_name: string) {
    return this.pluginBodyApi.addBodyAlbumTemplate(img_name)
  }
}
