import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { UserService } from '@/services/user.service'
import {
  HareWareApi,
  GetWhiteListQuery,
  PutAreaSettingParams,
  GetAreaInfoQuery
} from '@/api/v1/setting/hardware'
import { tap } from 'rxjs/operators'
import { forkJoin } from 'rxjs'

@Injectable()
export class AreaService {
  loading$ = new State({})
  rule$ = this.userService.getOptions$('entrance.entry_limit')
  timeCardRange$ = this.userService.getOptions$('setting.time_card_range')
  info$ = new State({})
  whiteList$ = new State([])
  constructor(
    private HareWareApi: HareWareApi,
    private userService: UserService
  ) {}
  @Effect()
  getWhiteList(query: GetWhiteListQuery) {
    return this.HareWareApi.getWhiteList(query).pipe(
      tap(res => {
        this.whiteList$.commit(() => res.list)
      })
    )
  }
  putAreaSetting(params: PutAreaSettingParams) {
    return this.HareWareApi.putAreaSettingParams(params)
  }
  @Effect()
  getAreaInfo(query: GetAreaInfoQuery) {
    return this.HareWareApi.getAreaInfo(query).pipe(
      tap(res => {
        this.info$.commit(() => res.info)
      })
    )
  }
}
