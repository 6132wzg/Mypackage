import { Injectable } from 'vue-service-app'
import { Effect } from 'rx-state'
import { CabinetApi, DelInput } from '@/api/v1/setting/cabinet'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'
@Injectable()
export class ListService {
  auth$ = this.authService.authMap$({
    edit: 'shop:cabinet:cabinet|edit',
    batchAdd: 'shop:cabinet:cabinet|batch_add',
    batchPrice: 'shop:cabinet:cabinet|price',
    batchDel: 'shop:cabinet:cabinet|batch_del'
  })
  cabinetBusinessOption$ = this.userService.getOptions$(
    'cabinet.cabinet_business_type',
    {
      addAll: '全部状态'
    }
  )
  cabinetTypeOption$ = this.userService.getOptions$('cabinet.cabinet_type', {
    addAll: '全部储物柜'
  })
  actionTypeOption$ = this.userService.getOptions$('cabinet.action_type', {
    addAll: '全部操作类型'
  })
  constructor(
    private cabinetApi: CabinetApi,
    private authService: AuthService,
    private userService: UserService
  ) {}
  @Effect()
  del(params: DelInput) {
    return this.cabinetApi.deleteCabinet(params)
  }
  @Effect()
  clearCabinet(params: any) {
    return this.cabinetApi.clearCabinet(params)
  }
}
