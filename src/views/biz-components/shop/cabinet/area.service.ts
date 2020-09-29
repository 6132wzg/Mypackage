import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import {
  CabinetAreaApi,
  AddInput,
  UpdateInput,
  SortInput
} from '@/api/v1/setting/cabinet/area'
import { AuthService } from '@/services/auth.service'
@Injectable()
export class AreaService {
  loading$ = new State({})
  list$ = new State([])
  auth$ = this.authService.authMap$({
    areaAdd: 'shop:cabinet:cabinet_area|add',
    areaEdit: 'shop:cabinet:cabinet_area|edit',
    areaDel: 'shop:cabinet:cabinet_area|del'
  })
  constructor(
    private areaApi: CabinetAreaApi,
    private authService: AuthService
  ) {}
  SET_LIST(list) {
    this.list$.commit(() => list)
  }
  @Effect()
  add(params: AddInput) {
    return this.areaApi.add(params)
  }
  del(id: number) {
    return this.areaApi.del(id)
  }
  update(params: UpdateInput) {
    return this.areaApi.update(params)
  }
  sort(params: SortInput) {
    return this.areaApi.sort(params)
  }
  @Effect()
  getList() {
    return this.areaApi.getList().pipe(
      tap(res => {
        let list = res.list.map(item => {
          item.isEdit = false
          return item
        })
        this.list$.commit(() => list)
      })
    )
  }
  beforeRouteUpdate(to: ServiceRoute) {
    console.log('area server', to.meta.query)
  }
}
