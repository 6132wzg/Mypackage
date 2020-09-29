import { Injectable, ServiceRoute, Controller } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { ShopStaffApi } from '@/api/v1/staff/staff'
import { AuthService } from '@/services/auth.service'
import { StaffApi } from '@/api/v1/staff'
import { MessageService } from '@/services/message.service'

@Injectable()
export class InfoService implements Controller {
  info$ = new State({})
  auth$ = new State([])
  constructor(
    private shopStaffapi: ShopStaffApi,
    private authService: AuthService,
    private staffApi: StaffApi,
    private message: MessageService
  ) {}
  getInfo(id: string) {
    return this.shopStaffapi.getStaffInfoCommonHeader(id).pipe(
      tap(res => {
        this.info$.commit(() => res.common_info)
        this.auth$.commit(() => res.auth)
      })
    )
  }
  // 清空指纹信息
  deleteStaffFinger(id: string) {
    return this.staffApi.deleteStaffFinger(id).pipe(
      tap(res => {
        this.message.success({ content: '指纹信息清空成功' })
      })
    )
  }
  // 清空硬件（储物柜）密码
  deleteStaffCabinetPassword(id: string) {
    return this.staffApi.deleteStaffCabinetPassword(id).pipe(
      tap(res => {
        this.message.success({ content: '硬件密码清空成功' })
      })
    )
  }
  beforeRouteEnter(to: ServiceRoute, from: ServiceRoute) {
    let { id } = to.query as any
    return this.getInfo(id)
  }
}
