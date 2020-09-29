import { DepartmentService as DepService } from './department.service#/department.service'
import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import {
  StaffApi,
  Params,
  UpdateDepartmentInput,
  DelDepartmentInput,
  AddDepartmentInput
} from '@/api/v1/staff'
import { ShopStaffApi } from '@/api/v1/staff/staff'
import { RoleApi } from '@/api/v1/staff/role'
import { AuthService } from '@/services/auth.service'
import { forkJoin } from 'rxjs'
import { MessageService } from '@/services/message.service'

@Injectable()
export class DepartmentService {
  loading$ = new State({})
  staffList$ = new State([])
  roleOptions$ = new State([])
  page$ = new State({})
  auth$ = this.authService.authMap$({
    join: 'brand:staff:staff|join',
    add: 'brand:staff:staff|add',
    import: 'brand:staff:staff|import',
    departmentAdd: 'brand:auth:department|add',
    departmentDel: 'brand:auth:department|del',
    departmentEdit: 'brand:auth:department|edit'
  })
  departmentList$ = new State([])
  departmentSearchList$ = new State([])
  constructor(
    private staffApi: StaffApi,
    private roleApi: RoleApi,
    private msg: MessageService,
    private shopStaffApi: ShopStaffApi,
    private depService: DepService,
    private authService: AuthService
  ) {}
  @Effect()
  getStaffList(data: Params) {
    return this.staffApi.getStaffBrandList(data).pipe(
      tap(res => {
        this.staffList$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  getDepartmentList() {
    return this.depService.getDepartmentList().pipe(
      tap(res => {
        this.departmentList$.commit(() => res.department)
      })
    )
  }
  addDepartment(params: AddDepartmentInput) {
    return this.staffApi.addDepartment(params).pipe(
      tap(res => {
        this.msg.success({
          content: '新增成功！！！'
        })
      })
    )
  }
  updateDepartment(params: UpdateDepartmentInput) {
    return this.staffApi.updateDepartment(params).pipe(
      tap(res => {
        this.msg.success({
          content: '修改成功！！！'
        })
      })
    )
  }
  delDepartment(params: DelDepartmentInput) {
    return this.staffApi.delDepartment(params).pipe(
      tap(res => {
        this.msg.success({
          content: '部门已删除'
        })
      })
    )
  }
  searchDepartment(keyword: string) {
    return this.shopStaffApi
      .searchDepartment({
        keyword: keyword
      })
      .pipe(
        tap(res => {
          this.departmentSearchList$.commit(() => [
            { id: '-1', name: '全部部门' },
            ...res.department
          ])
        })
      )
  }
  getRoleList() {
    return this.roleApi.getRoleOptions('brand').pipe(
      tap(res => {
        this.roleOptions$.commit(() => [
          { id: -1, name: '全部角色' },
          ...res.roles
        ])
      })
    )
  }
  // 清空硬件指纹信息
  deleteStaffFinger(id: string) {
    return this.staffApi.deleteStaffFinger(id).pipe(
      tap(res => {
        this.msg.success({ content: '指纹信息清空成功' })
      })
    )
  }
  // 清空硬件（储物柜）密码
  deleteStaffCabinetPassword(id: string) {
    return this.staffApi.deleteStaffCabinetPassword(id).pipe(
      tap(res => {
        this.msg.success({ content: '硬件密码清空成功' })
      })
    )
  }
  init(query: any) {
    return forkJoin(
      this.searchDepartment(''),
      this.getDepartmentList(),
      this.getStaffList(query),
      this.getRoleList()
    )
  }
  // beforeRouteEnter(to: ServiceRoute, from: ServiceRoute) {
  //   return this.getDepartmentList()
  // }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return this.init(to.query)
  }
}
