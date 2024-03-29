import { Injectable, ServiceRoute, Controller } from 'vue-service-app'
import { State } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import {
  OverviewApi,
  Version,
  RevenueParams
} from '@/api/v1/stat/overview/shop'
import { forkJoin } from 'rxjs'
import { anyAll } from '@/operators'
import { UserService } from '@/services/user.service'
@Injectable()
export class ClubService implements Controller {
  top$ = new State({
    revenue_amount: {
      today: '0.0/0.0',
      yesterday: '0.0/0.0',
      nearly_seven_days: '0.0/0.0',
      nearly_thirty_days: '0.0/0.0'
    },
    course_checkin_num: {},
    passenger_flow: {},
    be_member_num: {}
  })
  revenueDaily$ = new State([])
  revenueSummary$ = new State([])
  revenueSum$ = new State('')
  courseDaily$ = new State([])
  courseSummary$ = new State([])
  inoutNum$ = new State([])
  inoutTime$ = new State([])
  member$ = new State({ member: [], marketing: [] })
  newMember$ = new State([])

  constructor(
    private overviewApi: OverviewApi,
    private userService: UserService
  ) {}
  getTop(query: Version) {
    return this.overviewApi.getTop(query).pipe(
      tap(res => {
        this.top$.commit(() => res.info)
      })
    )
  }
  getRevenue(params: RevenueParams) {
    return this.overviewApi.getRevenue(params).pipe(
      tap(res => {
        const data = res.info
        let lineData: any = []
        const member_card = this.userService.c('member_card')
        const small_course = this.userService.c('small_course')
        this.revenueSummary$.commit(() => [
          { name: member_card, value: data.summary.member_card_amount },
          { name: '私教课', value: data.summary.personal_course_amount },
          { name: '团体课', value: data.summary.team_course_amount },
          { name: '课程包', value: data.summary.package_course_amount },
          { name: small_course, value: data.summary.small_course_amount },
          { name: '云店', value: data.summary.shop_amount },
          { name: '其他', value: data.summary.other_amount }
        ])
        this.revenueSum$.commit(() => data.summary.total_amount)
        for (let key in data.daily.member_card_amount) {
          let chartItem: any = {
            date: key,
            // 会员卡: Number(data.daily.member_card_amount[key]),
            私教课: Number(data.daily.personal_course_amount[key]),
            团体课: Number(data.daily.team_course_amount[key]),
            课程包: Number(data.daily.package_course_amount[key]),
            云店: Number(data.daily.shop_amount[key]),
            其他: Number(data.daily.other_amount[key]),
            总营收: Number(data.daily.total_amount[key])
          }
          chartItem[member_card] = Number(data.daily.member_card_amount[key])
          chartItem[small_course] = Number(data.daily.small_course_amount[key])
          lineData.push(chartItem)
        }
        console.log('营收趋势', lineData)
        this.revenueDaily$.commit(() => lineData)
      })
    )
  }
  getCourse(params: RevenueParams) {
    const small_course = this.userService.c('small_course')
    return this.overviewApi.getCourse(params).pipe(
      tap(res => {
        const data = res.info
        let lineData: any = []
        let courseSummary: any = [
          {
            group: '未消课',
            团体课: data.summary.team_uncheckin_num,
            私教课: data.summary.personal_uncheckin_num
          },
          {
            group: '总消课',
            团体课: data.summary.team_checkin_num,
            私教课: data.summary.personal_checkin_num
          },
          {
            group: '总售课',
            团体课: data.summary.sale_team_num,
            私教课: data.summary.sale_personal_num
          }
        ]
        courseSummary = courseSummary.map((item: any) => {
          item[small_course] = data.summary.sale_personal_num
          return item
        })
        this.courseSummary$.commit(() => courseSummary)
        for (let key in data.daily.personal_reserved_num) {
          let chartItem: any = {
            date: key,
            私教课预约人数: data.daily.personal_reserved_num[key],
            私教课签到人数: data.daily.personal_checkin_num[key],
            团体课可预约人数: data.daily.team_can_reserve_num[key],
            团体课预约人数: data.daily.team_reserved_num[key],
            团体课签到人数: data.daily.team_sigin_num[key]
          }
          chartItem[`${small_course}预约人数`] =
            data.daily.small_reserved_num[key]
          chartItem[`${small_course}签到人数`] = data.daily.small_sigin_num[key]
          lineData.push(chartItem)
        }
        console.log('上课分析', lineData)
        this.courseDaily$.commit(() => lineData)
      })
    )
  }
  getInout(params: RevenueParams) {
    return this.overviewApi.getInout(params).pipe(
      tap(res => {
        const data = res
        let lineData: any = []
        for (let key in data.inout_num) {
          let chartItem = {
            date: key,
            value: data.inout_num[key]
          }
          lineData.push(chartItem)
        }
        console.log('入场', lineData)
        this.inoutNum$.commit(() => lineData)
        this.inoutTime$.commit(() => [
          {
            name: '08:00之前',
            value: data.inout_time.level0_num
          },
          {
            name: '08:00~12:00',
            value: data.inout_time.level1_num
          },
          {
            name: '12:00~16:00',
            value: data.inout_time.level2_num
          },
          {
            name: '16:00~20:00',
            value: data.inout_time.level3_num
          },
          {
            name: '20:00~24:00',
            value: data.inout_time.level4_num
          }
        ])
      })
    )
  }
  getMember(query: Version) {
    return this.overviewApi.getMember(query).pipe(
      tap(res => {
        const data = res.info
        this.member$.commit(() => {
          return {
            member: [
              { name: '消费人数', value: data.member.consume_num },
              { name: '办理入会人数', value: data.member.member_num },
              { name: '购买私教人数', value: data.member.buy_person_course_num }
            ],
            marketing: [
              { name: '消费人数', value: data.marketing.consume_num },
              { name: '办理入会人数', value: data.marketing.member_num },
              {
                name: '购买私教人数',
                value: data.marketing.buy_person_course_num
              }
            ]
          }
        })
      })
    )
  }
  getNewMember(params: RevenueParams) {
    return this.overviewApi.getNewMember(params).pipe(
      tap(res => {
        const data = res.info.new_member_num
        let lineData: any = []
        for (let key in data) {
          let chartItem = {
            date: key,
            value: data[key]
          }
          lineData.push(chartItem)
        }
        console.log('newMember', lineData)
        this.newMember$.commit(() => lineData)
      })
    )
  }
  init() {
    return anyAll(
      this.getTop({ version: 'club' }),
      this.getRevenue({ recently_day: 7 }),
      this.getCourse({ recently_day: 7 }),
      this.getInout({ recently_day: 7 }),
      this.getMember({ version: 'club' }),
      this.getNewMember({ recently_day: 7 })
    )
  }
  beforeCreate() {
    return this.init()
  }
}
