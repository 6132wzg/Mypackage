import { Injectable, ServiceRoute, Controller } from 'vue-service-app'
import {
  SettingMinaApi,
  H5Query,
  SaveForm,
  StaffID,
  Menus,
  ReserveTabs
} from '@/api/v1/setting/mina'
import { tap } from 'rxjs/operators'
import { State, Effect } from 'rx-state/src'
import { isArray } from 'lodash-es'
import { forkJoin } from 'rxjs'
import { ShopApi } from '@/api/v1/shop'

@Injectable()
export class H5WrapperService {
  actionInfo$ = new State([]) // 功能菜单
  checkedInfo$ = new State([]) // 勾选菜单
  coach$ = new State([]) // 教练风采
  coachInfo$ = new State([]) // 教练风采详情
  courseInfo$ = new State([]) // 推荐课程
  sliderInfo$ = new State([]) // 首页图片
  eventInfo$ = new State([]) // 营销活动
  menuInfo$ = new State([]) // 导航菜单
  reserveInfo$ = new State([]) // 课程预约
  reserveCheckInfo$ = new State([]) //课程预约勾选
  loading$ = new State({})
  constructor(private settingMinaApi: SettingMinaApi) {}
  SET_H5INFO(data: any, index: number) {
    index === 1 && this.sliderInfo$.commit(() => data)
    index === 2 && this.actionInfo$.commit(() => data)
    index === 3 && this.eventInfo$.commit(() => data)
    index === 7 && this.coachInfo$.commit(() => data)
    index === 5 && this.courseInfo$.commit(() => data)
    index === 9 && this.menuInfo$.commit(() => data)
    index === 4 && this.coach$.commit(() => data)
    index === 8 && this.checkedInfo$.commit(() => data)
    index === 6 && this.reserveInfo$.commit(() => data)
    index === 10 && this.reserveCheckInfo$.commit(() => data)
  }
  getH5Info(params: H5Query) {
    return this.settingMinaApi.getH5Info(params).pipe(
      tap(res => {
        this.SET_H5INFO(res.content, params.category)
      })
    )
  }
  getCoachInfo(params: StaffID) {
    return this.settingMinaApi.getCoachInfo(params).pipe(
      tap(res => {
        res = isArray(res) ? res : []
        this.SET_H5INFO(res, 7)
      })
    )
  }
  getMenu() {
    return this.settingMinaApi.getMenu().pipe(
      tap(res => {
        this.SET_H5INFO(res, 9)
      })
    )
  }
  saveMenu(params: Menus) {
    return this.settingMinaApi.saveMenu(params)
  }
  saveReserve(params: ReserveTabs) {
    return this.settingMinaApi.saveReserve(params)
  }
  @Effect()
  save(params: SaveForm) {
    return this.settingMinaApi.save(params)
  }
  @Effect()
  saveAll(p1: Menus, p2: SaveForm, p3: ReserveTabs) {
    return forkJoin(this.saveMenu(p1), this.save(p2), this.saveReserve(p3))
  }
}
