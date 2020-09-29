import {
  ApplicationApi,
  GetAttendanceListInterface,
  GetAttendanceSummaryInterface
} from '@/api/v1/applications'
import { AuthService } from '@/services/auth.service'
import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { anyAll } from '@/operators'
import { CommonApi } from '@/api/v1/stat/common/common.ts'
import { UserService } from '@/services/user.service'
@Injectable()
export class ListService {
  auth$ = this.authService.authMap$({
    authMend: 'brand:application:staff_attendance|mend',
    authExport: 'brand:application:staff_attendance|export'
  })
  cardType$ = this.userService.getEnumValue$('staff_attendance.attendance_type')
  loading$ = new State({})
  summaryList$ = new State({})
  tableList$ = new State([])
  departmentList$ = new State([])
  page$ = new State({
    current_page: 1,
    size: 20,
    total_counts: 1,
    total_pages: 1
  })
  constructor(
    private applicationApi: ApplicationApi,
    private authService: AuthService,
    private commonApi: CommonApi,
    private userService: UserService
  ) {}
  // 获取考勤报表列表
  @Effect()
  getAttendanceListHandle(query: GetAttendanceListInterface) {
    return this.applicationApi.getAttendanceList(query).pipe(
      tap((res: any) => {
        this.tableList$.commit(() => res.list)
        this.page$.commit(() => res.currentPage)
      })
    )
  }
  getAttendanceSummaryHandle(query: GetAttendanceSummaryInterface) {
    return this.applicationApi.getAttendanceSummary(query).pipe(
      tap((res: any) => {
        this.summaryList$.commit(() => {
          return res.info
        })
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

        this.departmentList$.commit(() => {
          const loopChildren = (arr: any) => {
            const list: any = []
            arr.forEach(val => {
              if (val.children && val.children.length > 0) {
                list.push({
                  label: val.label,
                  value: val.value,
                  children: loopChildren(val.children)
                })
              } else {
                list.push({
                  label: val.label,
                  value: val.value
                })
              }
            })
            return list
          }
          const list = loopChildren(departmentList)
          return list
        })
      })
    )
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return anyAll(
      this.getAttendanceSummaryHandle(to.meta.query),
      this.getAttendanceListHandle(to.meta.query)
    )
  }
}
