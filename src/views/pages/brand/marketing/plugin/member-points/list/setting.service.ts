import { UserService } from '@/services/user.service'
import { State, Effect } from 'rx-state'
import { Controller, ServiceRoute, Injectable } from 'vue-service-app'
import { tap } from 'rxjs/operators'
import { PointsApi } from '@/api/v1/marketing/points'
import { AuthService } from '@/services/auth.service'
import { anyAll } from '@/operators'
@Injectable()
export class SettingService implements Controller {
  loading$ = new State({})
  setting$: State<object> = new State({})
  auth$ = this.authService.authMap$({
    open: 'brand:activity:points|open'
  })
  sourceTypeOptions$ = this.userService.getOptions$(
    'plugin_points.source_type',
    { addAll: '全部积分' }
  )
  validateUnitTypeOptions$ = this.userService.getOptions$(
    'plugin_points.validate_unit_type'
  )
  validateUnitType$ = this.userService.getEnumValue$(
    'plugin_points.validate_unit_type'
  )
  defalutOptions$ = this.userService.getEnumValue$('plugin_points.default')
  payPointsOptions$ = this.userService.getEnumValue$('plugin_points.pay_points')
  actionPointsOptions$ = this.userService.getEnumValue$(
    'plugin_points.action_points'
  )

  linkPoints$ = this.userService.getOptions$('plugin_points.link_points')

  constructor(
    private pointsApi: PointsApi,
    private userService: UserService,
    private authService: AuthService
  ) {}
  getPointsSetting() {
    return this.pointsApi.getPointsInfo().pipe(
      tap(res => {
        this.setting$.commit(() => res.info)
      })
    )
  }
  @Effect()
  setPoiontsSetting(query: any) {
    return this.pointsApi.editPoints(query)
  }
  refreshUserInfo() {
    return this.userService.fetchStaffInfo()
  }
  beforeEach(to: ServiceRoute, form: ServiceRoute) {
    return anyAll(this.getPointsSetting())
  }
}
