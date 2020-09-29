import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { SalesApi, SaleDataParams } from '@/api/v1/stat/brand/sales.ts'
import { CommonApi, AllStaffListParams } from '@/api/v1/stat/common/common.ts'

import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'
import { anyAll } from '@/operators'
@Injectable()
export class StaffService {
  loading$ = new State({})
  list$ = new State([])
  childListMap$ = new State({})
  expendKeys$ = new State([])
  page$ = new State({})
  total$ = new State({})
  departmentList$ = new State([])
  staffList$ = new State([])
  updateTime$ = new State(Date.now())

  contractType$ = this.userService.getOptions$('report.report_contract_type')
  auth$ = this.authService.authMap$({
    export: 'brand:stat:sales:summary|export_sales'
  })
  constructor(
    private salesApi: SalesApi,
    private userService: UserService,
    private authService: AuthService,
    private commonApi: CommonApi
  ) {}
  SET_CHILDLISTMAP(childListMap) {
    console.log('子列表map', childListMap)
    this.childListMap$.commit(() => childListMap)
  }
  RESET_CHILDITEM(staff_id) {
    let childListMap: any = this.childListMap$.getValue()
    childListMap[staff_id].list = []
    childListMap[staff_id].page = {
      current_page: 1
    }
    this.childListMap$.commit(() => childListMap)
  }
  ADD_EXPENDKEY(expendKey: string) {
    let keyList: any = this.expendKeys$.getValue()
    keyList.indexOf(expendKey) < 0 &&
      this.SET_EXPENDKEYS([...keyList, expendKey])
  }
  DEL_EXPENDKEY(expendKey: string) {
    let keyList: any = this.expendKeys$.getValue()
    keyList.splice(keyList.indexOf(expendKey), 1)
    this.SET_EXPENDKEYS([...keyList])
  }
  SET_EXPENDKEYS(expendKeys: any) {
    let keyList: any = this.expendKeys$.getValue()
    keyList = new Set([...keyList, ...expendKeys])
    console.log('展开项', keyList)
    this.expendKeys$.commit(() => [...keyList])
  }
  SET_LIST(list: any) {
    const childListMap = {}
    let expendKeys: any = this.expendKeys$.getValue()
    list = list.map((item, index) => {
      const staff_id = item.staff_id.toString()
      childListMap[staff_id] = item.children
      // 除第一条外，其他item.children.list全部默认为空（后端查询问题，展开子表时才会请求子表数据，关闭后会重置）
      if (index < 1) expendKeys = [...expendKeys, staff_id]
      // 如果children.list无数据，则清除对应的展开记录 (第一条数据除外)
      if (index >= 1 && (!item.children.list || !item.children.list.length)) {
        this.DEL_EXPENDKEY(staff_id)
        expendKeys.indexOf(staff_id) >= 0 &&
          expendKeys.splice(expendKeys.indexOf(staff_id), 1)
      }
      return {
        ...item,
        staff_id
      }
    })
    this.SET_CHILDLISTMAP(childListMap)
    this.SET_EXPENDKEYS(expendKeys)
    this.list$.commit(() => list)
  }
  // 列表
  @Effect()
  getList(query: SaleDataParams) {
    return this.salesApi.getData(query).pipe(
      tap(res => {
        this.SET_LIST(res.list)
        this.page$.commit(() => res.page)
        res.last_update_time &&
          this.updateTime$.commit(() => res.last_update_time)
      })
    )
  }
  getDataTotal(query: SaleDataParams) {
    return this.salesApi.getDataTotal(query).pipe(
      tap(res => {
        this.total$.commit(() => res.info)
        res.last_update_time &&
          this.updateTime$.commit(() => res.last_update_time)
      })
    )
  }
  getDataRefresh() {
    return this.commonApi.getSalesRefresh().pipe(
      tap(res => {
        res.last_update_time &&
          this.updateTime$.commit(() => res.last_update_time)
      })
    )
  }
  @Effect()
  getDetailList(query: SaleDataParams) {
    return this.salesApi.getDetailData(query).pipe(
      tap(res => {
        const childListMap: any = this.childListMap$.getValue()
        const staff_id: any = query.staff_id
        childListMap[staff_id] = res
        this.SET_CHILDLISTMAP(childListMap)
      })
    )
  }
  getDepartmentList() {
    return this.commonApi.getDepartmentList().pipe(
      tap(res => {
        let departmentList: any = [{ label: '全部部门', value: -1 }]
        const hander = list => {
          return list.map(item => ({
            label: item.name,
            value: item.id,
            children:
              item.children && item.children.length ? hander(item.children) : []
          }))
        }
        departmentList = [...departmentList, ...hander(res.department)]
        this.departmentList$.commit(() => departmentList)
      })
    )
  }

  getStaffList(query: AllStaffListParams) {
    return this.commonApi.getStaffList(query).pipe(
      tap(res => {
        const staffList: any = []
        res.list.map(item => {
          staffList.push({
            label: item.nickname,
            value: item.id
          })
        })
        this.staffList$.commit(() => staffList)
      })
    )
  }

  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return anyAll(this.getList(to.meta.query), this.getDataTotal(to.meta.query))
  }
}
