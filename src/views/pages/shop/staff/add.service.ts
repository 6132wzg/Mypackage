import { RoleApi } from '@/api/v1/staff/role'
import { Injectable, ServiceRoute, Controller } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { ShopStaffApi } from '@/api/v1/staff/staff'
import { StaffApi, AddStaffBasicInfoParams } from '@/api/v1/staff'
import { forkJoin } from 'rxjs'
import { MessageService } from '@/services/message.service'

@Injectable()
export class AddService implements Controller {
  codeList$ = new State({})
  roleList$ = new State({})
  department$ = new State({})
  loading$ = new State({})
  constructor(
    protected message: MessageService,
    protected shopStaffApi: ShopStaffApi,
    protected staffApi: StaffApi,
    private roleApi: RoleApi
  ) {}
  @Effect()
  // 获取手机号区域
  getCountryCodes() {
    return this.staffApi.getCountryCodes().pipe(
      tap(res => {
        this.codeList$.commit(() => {
          let code_list = res.code_list
          if (code_list.length) return code_list
          code_list.push({
            phone_code: res.default_code,
            code_id: res.default_code_id
          })
          return code_list
        })
      })
    )
  }
  getNormalList() {
    return this.roleApi.getNormalList().pipe(
      tap(res => {
        this.roleList$.commit(() => res.roles)
      })
    )
  }
  getStaffDepartment() {
    return this.shopStaffApi.getStaffDepartmentList().pipe(
      tap(res => {
        this.department$.commit(() => res.department)
      })
    )
  }
  @Effect()
  addStaff(params: AddStaffBasicInfoParams) {
    return this.shopStaffApi.addStaffBasicInfo(params).pipe(
      tap(res => {
        this.message.success({
          content: '提交成功'
        })
      })
    )
  }
  init() {
    return forkJoin(
      this.getNormalList(),
      this.getCountryCodes(),
      this.getStaffDepartment()
    )
  }
  beforeRouteEnter(to: ServiceRoute, from: ServiceRoute) {
    return this.init()
  }
}
