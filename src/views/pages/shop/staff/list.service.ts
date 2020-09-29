import { Injectable, ServiceRoute, Controller } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { ShopStaffApi, GetListQuery } from '@/api/v1/staff/staff'
import { RoleApi } from '@/api/v1/staff/role'
import { UserService } from '@/services/user.service'
import { AuthService } from '@/services/auth.service'
import { forkJoin } from 'rxjs'
import { StaffApi } from '@/api/v1/staff'
import { MessageService } from '@/services/message.service'

@Injectable()
export class ListService implements Controller {
  staffList$ = new State([])
  page$ = new State({})
  roleOptions$ = new State([])
  department$ = new State({})
  identityList$ = this.userService.getOptions$('staff.identity', {
    addAll: '全部员工职能'
  })
  workStatusList$ = this.userService.getOptions$('staff.work_status', {
    addAll: '全部在职状态'
  })
  loading$ = new State({})
  auth$ = this.authService.authMap$({
    join: 'shop:staff:staff|join',
    add: 'shop:staff:staff|add',
    import: 'shop:staff:staff|import',
    export: 'shop:staff:staff|export' // 现在没有权限
  })
  constructor(
    private shopStaffApi: ShopStaffApi,
    private roleApi: RoleApi,
    private userService: UserService,
    private authService: AuthService,
    private staffApi: StaffApi,
    private message: MessageService
  ) {}
  @Effect()
  getStaffList(query: GetListQuery) {
    return this.shopStaffApi.getList(query).pipe(
      tap((res: any) => {
        this.staffList$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }

  getStaffDepartment() {
    return this.shopStaffApi.getStaffDepartmentList().pipe(
      tap(res => {
        this.department$.commit(() => [
          { id: -1, name: '全部部门' },
          ...res.department
        ])
      })
    )
  }

  getRoleList() {
    return this.roleApi.getRoleOptions('shop').pipe(
      tap(res => {
        this.roleOptions$.commit(() => [
          { id: -1, name: '全部角色' },
          ...res.roles
        ])
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
    return forkJoin(this.getStaffDepartment(), this.getRoleList())
  }

  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    const { page = 1, size = 20 } = to.meta.query
    return forkJoin(this.getStaffList({ page, size, ...to.query }))
  }
}
