import {
  PluginBodyApi,
  IndicatorAddQuery,
  IndicatorEditQuery
} from '@/api/v1/plugin/body'
import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { forkJoin } from 'rxjs'
import { AuthService } from '@/services/auth.service'
@Injectable()
export class ListService {
  loading$ = new State({})
  list$ = new State([])
  labelList$ = new State([])
  auth$ = this.authService.authMap$({
    add: 'brand:application:physical_test|add',
    edit: 'brand:application:physical_test|edit',
    del: 'brand:application:physical_test|del'
  })
  constructor(
    private pluginBodyApi: PluginBodyApi,
    private authService: AuthService
  ) {}
  // 获取体测指标列表
  @Effect()
  getBodyIndicatorList() {
    return this.pluginBodyApi.getBodyTemplateInfo().pipe(
      tap((res: any) => {
        this.list$.commit(() => {
          let list = res.list
          list.unshift({
            id: 0,
            isAdd: 1
          })
          return list
        })
      })
    )
  }
  moveBodyIndicators(params: any) {
    return this.pluginBodyApi.moveBodyIndicators(params)
  }
  editBodyIndicator(query: IndicatorEditQuery) {
    return this.pluginBodyApi.editBodyIndicator(query)
  }
  addBodyIndicator(query: IndicatorAddQuery) {
    return this.pluginBodyApi.addBodyIndicator(query)
  }
  deleteBodyIndicator(id: number) {
    return this.pluginBodyApi.deleteBodyIndicator(id)
  }
  // 获取体测图列表
  getBodyImgLableList() {
    return this.pluginBodyApi.getBodyAlbumTemplate().pipe(
      tap((res: any) => {
        this.labelList$.commit(() => res)
      })
    )
  }
  // 删除体测图
  removePhysicalTestBodyImgLabel(id: number) {
    return this.pluginBodyApi.deleteBodyAlbumTemplate(id)
  }
  init() {
    // ,
    return forkJoin(this.getBodyImgLableList(), this.getBodyIndicatorList())
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return this.init()
  }
}
