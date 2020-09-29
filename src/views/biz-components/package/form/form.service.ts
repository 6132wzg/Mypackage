import { UserService } from '@/services/user.service'
import { State } from 'rx-state'
import { Injectable } from 'vue-service-app'
import { map, tap } from 'rxjs/operators'
import { CommonPackageApi } from '@/api/v1/package/common'
@Injectable()
export class FormService {
  cardBgList$ = this.userService.getOptions$('package_course.package_bg_list')
  // 课程包类型
  packageTypeOptions$ = this.userService.getOptions$('package_course.is_limit')
  // 课程包属性
  packageAttrOptions$ = this.userService
    .getOptions$('package_course.package_type')
    .pipe(
      map(res => {
        let tooltips = ['RYKCB001', 'FWKCB001', 'GDKCB001']
        res = res.map((item: any, index) => {
          item.tooltip = tooltips[index]
          return item
        })
        return res
      })
    )
  // 时间单位 年月日
  freezeUnitOptions$ = this.userService.getOptions$(
    'package_course.valid_time_unit'
  )
  // 时间单位 年月日
  reserveLimitDayOptions$ = this.userService
    .getOptions$('package_course.reserve_limit_day')
    .pipe(
      map(res => {
        return res.map(item => {
          item.label = item.label.includes('每')
            ? item.label
            : `每${item.label}最多约`
          return item
        })
      })
    )
  coachList$ = new State([])
  isShop$ = this.userService.isShop$
  shop$ = this.userService.shop$

  // 售卖方式
  sellTypeOptions$ = this.userService.getOptions$('package_course.sale_mode')
  transferUnitOptions$ = this.userService.getOptions$(
    'package_course.transfer_unit'
  )
  constructor(
    private userService: UserService,
    private commonApi: CommonPackageApi
  ) {}
  getCoachList() {
    return this.commonApi.getCoachList().pipe(
      tap((res: any) => {
        this.coachList$.commit(() =>
          res.list.map(item => {
            return {
              label: item.setting_name,
              value: item.id
            }
          })
        )
      })
    )
  }
}
