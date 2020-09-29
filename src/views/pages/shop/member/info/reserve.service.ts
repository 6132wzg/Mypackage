import { Injectable, ServiceRoute, Controller } from 'vue-service-app'
import { State } from 'rx-state'
import { tap } from 'rxjs/operators'
import { MemberApi, CardConsumptionQuery } from '@/api/v1/member'
import { anyAll } from '@/operators'

@Injectable()
export class ReserveService implements Controller {
  memberCardList$ = new State([])
  depositCardList$ = new State([])
  personalCourseList$ = new State([])
  packageList$ = new State([])
  smallCourseList$ = new State([])
  memberCardPage$ = new State({})
  depositCardPage$ = new State({})
  personalCoursePage$ = new State({})
  packagePage$ = new State({})
  smallCoursePage$ = new State({})
  constructor(private memberApi: MemberApi) {}

  SET_MEMBER_CARD_LIST(list) {
    list = list.map(item => {
      item.initAmount = `${item.init_amount.number}${item.init_amount.type}`
      item.remainAmount = `${item.remain_amount.number}${item.remain_amount.type}`
      item.memberList = item.member_info.members.map(member => {
        if (member.is_purchaser) {
          return `购买人: ${member.member_info}`
        } else {
          return `成员: ${member.member_info}`
        }
      })
      return item
    })
    this.memberCardList$.commit(() => list)
  }
  SET_DEPOSIT_CARD_LIST(list) {
    list = list.map(item => {
      item.initAmount = `${item.init_amount.number}${item.init_amount.type}`
      item.remainAmount = `${item.remain_amount.number}${item.remain_amount.type}`
      return item
    })
    this.depositCardList$.commit(() => list)
  }
  SET_PERSONAL_COURSE_LIST(list) {
    this.personalCourseList$.commit(() => list)
  }
  SET_PACKAGE_LIST(list) {
    list = list.map(item => {
      item.init = `${item.team_course_init}/${item.personal_course_init}`
      item.remain = `${item.team_course_remain}/${item.personal_course_remain}`
      item.memberList = item.member_info.members.map(member => {
        if (member.is_purchaser) {
          return `购买人: ${member.member_info}`
        } else {
          return `成员: ${member.member_info}`
        }
      })
      return item
    })

    this.packageList$.commit(() => list)
  }
  getMemberCardList(query: CardConsumptionQuery) {
    return this.memberApi.getMemberCardList(query).pipe(
      tap(res => {
        this.SET_MEMBER_CARD_LIST(res.list)
        this.memberCardPage$.commit(() => res.page)
      })
    )
  }
  getDepositCardList(query: CardConsumptionQuery) {
    return this.memberApi.getDepositCardList(query).pipe(
      tap(res => {
        this.SET_DEPOSIT_CARD_LIST(res.list)
        this.depositCardPage$.commit(() => res.page)
      })
    )
  }
  getPersonalCourseList(query: CardConsumptionQuery) {
    return this.memberApi.getPersonalCourseList(query).pipe(
      tap(res => {
        this.SET_PERSONAL_COURSE_LIST(res.list)
        this.personalCoursePage$.commit(() => res.page)
      })
    )
  }
  getPackageList(query: CardConsumptionQuery) {
    return this.memberApi.getPackageList(query).pipe(
      tap(res => {
        this.SET_PACKAGE_LIST(res.list)
        this.packagePage$.commit(() => res.page)
      })
    )
  }
  getSmallCourseList(query: CardConsumptionQuery) {
    return this.memberApi.getSmallCourseList(query).pipe(
      tap(res => {
        this.smallCourseList$.commit(() => res.list)
        this.smallCoursePage$.commit(() => res.page)
      })
    )
  }
  changePage(query) {
    let type: string = query.type
    switch (type) {
      case 'member':
        return this.getMemberCardList(query)
      case 'deposit':
        return this.getDepositCardList(query)
      case 'package':
        return this.getPackageList(query)
      case 'personal':
        return this.getPersonalCourseList(query)
      case 'small':
        return this.getSmallCourseList(query)
      default:
        return anyAll(
          this.getMemberCardList(query),
          this.getDepositCardList(query),
          this.getPackageList(query),
          this.getPersonalCourseList(query),
          this.getSmallCourseList(query)
        )
    }
  }
  init(query: any) {
    return this.changePage(query)
  }
  beforeRouteEnter(to: ServiceRoute, from: ServiceRoute) {
    return this.init(to.query)
  }
}
