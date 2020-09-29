import {
  ApplicationApi,
  PutAttendanceSettingInterface
} from '@/api/v1/applications'
import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { anyAll } from '@/operators'
import { AuthService } from '@/services/auth.service'
@Injectable()
export class SettingService {
  auth$ = this.authService.authMap$({
    authSetting: 'brand:application:staff_attendance|setting'
  })
  loading$ = new State({})
  list$ = new State([])
  timeMap$ = new State({})
  constructor(
    private applicationApi: ApplicationApi,
    private authService: AuthService
  ) {}
  @Effect()
  getAttendanceSettingHandle() {
    return this.applicationApi.getAttendanceSetting().pipe(
      tap((res: any) => {
        this.list$.commit(() => {
          const list = res
          list.rules.types_way = []
          list.rules.types_way[0] =
            list.rules.types && list.rules.types.length > 0
              ? +list.rules.types.includes(1)
              : 0
          list.rules.types_way[1] =
            list.rules.types && list.rules.types.length > 0
              ? +list.rules.types.includes(2)
              : 0
          return list
        })
      })
    )
  }
  @Effect()
  getAttendanceSettingTimeHandle() {
    return this.applicationApi.getAttendanceSettingTime().pipe(
      tap((res: any) => {
        this.timeMap$.commit(() => {
          return res
        })
      })
    )
  }
  @Effect()
  putAttendanceSettingHandle(params: PutAttendanceSettingInterface) {
    return this.applicationApi.putAttendanceSetting(params).pipe(
      tap((res: any) => {
        console.log(res)
      })
    )
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return anyAll(
      this.getAttendanceSettingHandle(),
      this.getAttendanceSettingTimeHandle()
    )
  }
}
