import { UserService } from '@/services/user.service'
import { Injectable, ServiceRoute } from 'vue-service-app'
import { PluginGroupBuyApi } from '@/api/v1/plugin/group_buy'
import { PluginSignUpApi } from '@/api/v1/plugin/sign_up'
import { PluginWheelApi } from '@/api/v1/plugin/wheel'
import { SettingMinaApi } from '@/api/v1/setting/mina'
import { DiscountApi } from '@/api/v1/app/plugin/discount'
import { SeckillApi } from '@/api/v1/app/plugin/seckill'
import { Effect, State } from 'rx-state'
import { then } from '@/operators'

@Injectable()
export class ProductTableSelectService {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  activityStatus$ = this.userService.getOptions$(
    'limited_time_discount.activity_status',
    { addAll: '全部活动状态' }
  )
  cocach_type$ = this.userService.getOptions$('mina_setting.coach_identity')
  card_type$ = this.userService.getOptions$('mina_setting.card_type')
  package_type$ = this.userService.getOptions$('package_course.package_type')
  coupon_type$ = this.userService.getOptions$('coupon.coupon_status')
  constructor(
    private settingMinaApi: SettingMinaApi,
    private pluginSignUpApi: PluginSignUpApi,
    private pluginWheelApi: PluginWheelApi,
    private pluginGroupBuyApi: PluginGroupBuyApi,
    private discountApi: DiscountApi,
    private seckillApi: SeckillApi,
    private userService: UserService
  ) {}
  RESET_LIST() {
    this.list$.commit(() => [])
  }
  getList(query) {
    let { module_type, course_type, ...req } = query
    let ModuleTypeMapFn = {
      3: this.getCoachList(req),
      4: this.getCardList(req),
      6: this.getPackageList(req),
      12: this.getCouponList(req),
      14: this.getWheelList(req),
      15: this.getSignUpList(req),
      16: this.getGroupBuyList(req)
    }
    let fn
    if (module_type === 5) {
      let fns = {
        1: this.getTeamCourseList(req),
        2: this.getPersonalCourseList(req),
        3: this.getSmallCourseList(req)
      }
      fn = fns[course_type]
      console.log('fn', fn)
    } else {
      fn = ModuleTypeMapFn[module_type]
    }
    return fn
  }
  @Effect()
  getCardList(params: any) {
    return this.settingMinaApi.getCardList(params).pipe(
      then((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  @Effect()
  getPersonalCourseList(params: any) {
    return this.settingMinaApi.getPersonalCourseList(params).pipe(
      then((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  @Effect()
  getSmallCourseList(params: any) {
    return this.settingMinaApi.getSmallCourseList(params).pipe(
      then((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  @Effect()
  getTeamCourseList(params: any) {
    return this.settingMinaApi.getTeamCourseList(params).pipe(
      then((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  @Effect()
  getPackageList(params: any) {
    return this.settingMinaApi.getPackageList(params).pipe(
      then((res: any) => {
        let isPermanentSale: any = this.userService
          .getEnumValue$('package_course.sale_time_is_forever')
          .snapshot()
        this.list$.commit(() =>
          res.list.map(item => {
            item.sale_time =
              item.is_permanent_sale === 1
                ? isPermanentSale[item.is_permanent_sale]
                : item.sale_time
            return item
          })
        )
        this.page$.commit(() => res.page)
      })
    )
  }
  @Effect()
  getCoachList(params: any) {
    return this.settingMinaApi.getCoachList(params).pipe(
      then((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  @Effect()
  getGroupBuyList(params: any) {
    return this.pluginGroupBuyApi
      .getGroupBuyList({ activity_status: 99, ...params }) // 99过滤“已结束”“草稿”“已取消”
      .pipe(
        then((res: any) => {
          this.list$.commit(() => res.list)
          this.page$.commit(() => res.page)
        })
      )
  }
  @Effect()
  getCouponList(params: any) {
    return this.settingMinaApi.getCouponList(params).pipe(
      then((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  @Effect()
  getWheelList(params: any) {
    return this.pluginWheelApi
      .getWheelList({ activity_status: 99, ...params }) // 99过滤“已结束”“草稿”“已取消”
      .pipe(
        then((res: any) => {
          this.list$.commit(() => res.list)
          this.page$.commit(() => res.page)
        })
      )
  }
  @Effect()
  getSignUpList(params: any) {
    return this.pluginSignUpApi
      .getSignUpList({ activity_status: 99, ...params }) // 99过滤“已结束”“草稿”“已取消”
      .pipe(
        then((res: any) => {
          this.list$.commit(() => res.list)
          this.page$.commit(() => res.page)
        })
      )
  }
  // 限时打折
  @Effect()
  getDiscountList(params: any) {
    return this.discountApi
      .getLimitDiscountList({ activity_status: 99, ...params })
      .pipe(
        then((res: any) => {
          this.list$.commit(() => res.list)
          this.page$.commit(() => res.page)
        })
      )
  }
  // 限时打折
  @Effect()
  getSeckillList(params: any) {
    return this.seckillApi
      .getLimitSeckillList({ activity_status: 99, ...params })
      .pipe(
        then((res: any) => {
          this.list$.commit(() => res.list)
          this.page$.commit(() => res.page)
        })
      )
  }
}
