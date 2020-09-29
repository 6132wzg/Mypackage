import { Injectable } from 'vue-service-app'
import { State } from 'rx-state/src'
import { UserService } from '@/services/user.service'
import { SettingMinaApi, GetPreviewInput } from '@/api/v1/setting/mina'

@Injectable()
export class H5FormSeckillComponentService {
  loading$ = new State({})
  constructor(
    private userService: UserService,
    private settingMinaApi: SettingMinaApi
  ) {}
  directionOptions$ = this.userService.getOptions$(
    'mina_setting.show_direction'
  )
  recommendRuleOptions$ = this.userService.getOptions$(
    'mina_setting.mina_spike'
  )
  getPreview(query: GetPreviewInput) {
    return this.settingMinaApi.getPreview(query)
  }
}
