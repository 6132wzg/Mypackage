import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { CourseApi, CourseDataParams } from '@/api/v1/stat/shop/course'
import { AuthService } from '@/services/auth.service'
import { anyAll } from '@/operators'
import { CommonApi, CourseListParams } from '@/api/v1/stat/common/common'

@Injectable()
export class StockService {
  list$ = new State([])
  page$ = new State({})
  childListMap$ = new State({})
  expendKeys$ = new State([])
  total$ = new State({})
  courseList$ = new State([])
  courseListPage$ = new State({})
  categoryList$ = new State([])
  loading$ = new State({})
  updateTime$ = new State(Date.now())
  auth$ = this.authService.authMap$({
    export: 'shop:stat:class_reports|personal_course_export'
  })
  constructor(
    private api: CourseApi,
    private commonApi: CommonApi,
    private authService: AuthService
  ) {}
  SET_CHILDLISTMAP(childListMap) {
    console.log('子列表map', childListMap)
    this.childListMap$.commit(() => childListMap)
  }
  RESET_CHILDITEM(course_id) {
    let childListMap: any = this.childListMap$.getValue()
    childListMap[course_id].list = []
    childListMap[course_id].page = {
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
      const course_id = item.course_id.toString()
      childListMap[course_id] = item.children
      // 除第一条外，其他item.children.list全部默认为空（后端查询问题，展开子表时才会请求子表数据，关闭后会重置）
      if (index < 1) expendKeys = [...expendKeys, course_id]
      // 如果children.list无数据，则清除对应的展开记录 (第一条数据除外)
      if (index >= 1 && (!item.children.list || !item.children.list.length)) {
        this.DEL_EXPENDKEY(course_id)
        expendKeys.indexOf(course_id) >= 0 &&
          expendKeys.splice(expendKeys.indexOf(course_id), 1)
      }
      return {
        ...item,
        course_id
      }
    })
    this.SET_CHILDLISTMAP(childListMap)
    this.SET_EXPENDKEYS(expendKeys)
    this.list$.commit(() => list)
  }
  // 列表
  @Effect()
  getList(query: CourseDataParams) {
    return this.api.getStockList(query).pipe(
      tap(res => {
        // this.list$.commit(() => res.list)
        this.SET_LIST(res.list)
        this.page$.commit(() => res.page)
        res.last_update_time &&
          this.updateTime$.commit(() => res.last_update_time)
      })
    )
  }
  @Effect()
  getDetailList(query: CourseDataParams) {
    return this.api.getStockChildList(query).pipe(
      tap(res => {
        const childListMap: any = this.childListMap$.getValue()
        const course_id: any = query.course_id
        childListMap[course_id] = res
        this.SET_CHILDLISTMAP(childListMap)
      })
    )
  }
  getTotal(query: CourseDataParams) {
    return this.api.getStockTotal(query).pipe(
      tap(res => {
        this.total$.commit(() => res.info)
        res.last_update_time &&
          this.updateTime$.commit(() => res.last_update_time)
      })
    )
  }
  getDataRefresh() {
    return this.commonApi.getPersonalCousreCStockRefresh().pipe(
      tap(res => {
        res.last_update_time &&
          this.updateTime$.commit(() => res.last_update_time)
      })
    )
  }
  getCourseList(query: CourseListParams, isreload: any = false) {
    return this.commonApi.getPersonalCourseList(query).pipe(
      tap(res => {
        let courseList: any = this.courseList$.getValue() || []
        const list = res.list || []
        const current_page: any = query.current_page
        if (current_page === 1 || isreload) {
          courseList = list
        } else if (current_page <= res.page.total_pages) {
          courseList = [...courseList, ...list]
        }
        this.courseListPage$.commit(() => res.page)
        this.courseList$.commit(() => courseList)
      })
    )
  }
  getCategoryList() {
    return this.commonApi.getCourseCategoryList({}).pipe(
      tap(res => {
        const list = res.list || []
        this.categoryList$.commit(() =>
          list.map((item: any) => {
            const { id, setting_name } = item
            return {
              value: id,
              label: setting_name
            }
          })
        )
      })
    )
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return anyAll(this.getList(to.meta.query), this.getTotal(to.meta.query))
  }
}
