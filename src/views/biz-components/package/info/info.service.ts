import { forEach } from 'lodash-es'
import { UserService } from '@/services/user.service'
import { CommonPackageApi } from '@/api/v1/package/common'
import { Injectable } from 'vue-service-app'
import { tap } from 'rxjs/operators'
import { State } from 'rx-state/src'
@Injectable()
export class InfoService {
  coachList$ = new State({})
  reserveIsLimit$ = this.userService.getEnumValue$(
    'package_course.reserve_is_limit'
  )
  saleTimeIsForever$ = this.userService.getEnumValue$(
    'package_course.sale_time_is_forever'
  )
  packageType$ = this.userService.getEnumValue$('package_course.package_type')
  reserveLimitDay$ = this.userService.getEnumValue$(
    'package_course.reserve_limit_day'
  )
  getCoachList() {
    return this.commonApi.getCoachList().pipe(
      tap((res: any) => {
        let map = {}
        res.list.forEach(item => {
          map[item.id] = item.setting_name
        })
        this.coachList$.commit(() => map)
      })
    )
  }
  constructor(
    private userService: UserService,
    private commonApi: CommonPackageApi
  ) {}
}
