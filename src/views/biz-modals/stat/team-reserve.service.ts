import { Injectable } from 'vue-service-app'
import { Effect, State } from 'rx-state'
import { tap } from 'rxjs/operators'
import { AuthService } from '@/services/auth.service'
// import { StatApi } from '@/api/v1/stat/shop'
import { CourseApi, CourseDataParams } from '@/api/v1/stat/common/course'

@Injectable()
export class TeamlService {
  list$ = new State([])
  page$ = new State({})
  childListMap$ = new State({})
  expendKeys$ = new State([])
  loading$ = new State({})
  auth$ = this.authService.authMap$({
    'brand-team-coach': 'brand:stat:course|team_coach_export',
    'shop-team-coach': 'shop:stat:class_reports|team_coach',
    'brand-team-course': 'brand:stat:course|team_member_export',
    'shop-team-course': 'shop:stat:class_reports|team_member'
  })
  constructor(private courseApi: CourseApi, private authService: AuthService) {}
  SET_CHILDLISTMAP(childListMap) {
    console.log('子列表map', childListMap)
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
      const id = item.id.toString()
      if (index <= 0) expendKeys = [...expendKeys, id]
      childListMap[id] = item.children
      return {
        ...item,
        id
      }
    })
    console.log(childListMap)
    console.log(list)
    this.SET_CHILDLISTMAP(childListMap)
    this.SET_EXPENDKEYS(expendKeys)
    this.list$.commit(() => list)
  }
  @Effect()
  getReserveList(query: CourseDataParams, type: string) {
    this.list$.commit(() => [])
    return this.courseApi.getReserveList(query, type).pipe(
      tap((res: any) => {
        this.SET_LIST(res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
