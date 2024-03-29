import { SmallCourseApi } from './../sold/small-course'
import { HttpService } from '@/services/http.service'
import { AppConfig } from '@/constants/config'
import { Injectable } from 'vue-service-app'
@Injectable()
export class StatApi {
  constructor(protected http: HttpService, protected appConfig: AppConfig) {}
  getRevenueShopList(query: RevenueShopListQuery) {
    return this.http.get('/v1/stat/revenue/shop', { query })
  }
  getFinanceShopList(query: FinanceShopListQuery) {
    return this.http.get('/v1/stat/finance/shop', { query })
  }
  getCourseList(query: CourseShopListQuery) {
    return this.http.get('/v1/stat/course/shop', { query })
  }
  getDepartmentList() {
    return this.http.get('/v1/stat/course/shop/department')
  }
  getCoachList() {
    return this.http.get('/v1/stat/course/shop/department/coach')
  }
  getDepartmentStaffList() {
    return this.http.get('/v1/stat/sale/department/staff')
  }
  getCourseCoachShopList(query: CourseShopListQuery) {
    return this.http.get('/v1/stat/course/shop/coach', { query })
  }
  getRevenueShopToday(query: RevenueShopTodayQuery) {
    return this.http.get('/v1/stat/revenue/shop/today', { query })
  }
  getOrderShopList(query: OrderShopListQuery) {
    return this.http.get('/v1/stat/order/shop', { query })
  }
  getCourseModalCoachAndCourseList(query: any) {
    return this.http.get('/v1/stat/course/shop/course/coach', { query })
  }
  getCheckinModalCoachAndCourseList(query: any) {
    return this.http.get('/v1/stat/course/shop/course/checkin/coach', { query })
  }
  getPersonalCourse(query: any) {
    return this.http.get(
      `/v1/stat/course/shop/personal/course${query.type || ''}`,
      {
        query
      }
    )
  }
  getPersonalConsume(query: any) {
    return this.http.get(
      `/v1/stat/course/shop/personal/course/checkin${query.type || ''}`,
      {
        query
      }
    )
  }

  getTeamCourse(query: any) {
    return this.http.get(
      `/v1/stat/course/shop/team/course${query.type || ''}`,
      {
        query
      }
    )
  }
  getTeamConsume(query: any) {
    return this.http.get(
      `/v1/stat/course/shop/team/course/checkin${query.type || ''}`,
      {
        query
      }
    )
  }
  getSmallCourse(query: any) {
    return this.http.get(
      `/v1/stat/course/shop/small/course${query.type || ''}`,
      {
        query
      }
    )
  }
  getSmallConsume(query: any) {
    return this.http.get(
      `/v1/stat/course/shop/small/course/checkin${query.type || ''}`,
      {
        query
      }
    )
  }
  getSellAmount(query: any) {
    return this.http.get(`/v1/stat/sale${query.type || ''}`, {
      query
    })
  }
  getSellList(query: OrderShopListQuery) {
    return this.http.get('/v1/stat/sale/summary', { query })
  }
  getSellStaffList(query: SellStaffListQuery) {
    return this.http.get('/v1/stat/sale/staff', { query })
  }
  getFollowDateList(query: any) {
    return this.http.get('/v1/stat/follow/dates', { query })
  }
  getFollowStaffList(query: any) {
    return this.http.get('/v1/stat/follow/staff', { query })
  }
  getFollowShopTotal(query: any) {
    return this.http.get('/v1/stat/follow/follow_total', { query })
  }
  getFollowHistory(query: any) {
    console.log(query)
    return this.http.get('/v1/member/follow/history', { query })
  }
  getFollowOperatoList() {
    return this.http.get('/v1/member/record_staff')
  }
  /**
   * 教练列表
   */
  getStaffList(query: any) {
    return this.http.get('/v1/report/common/staff/list', {
      query
      // yapi: 53
    })
  }
}

export interface PersonalCourseQuery {
  current_page?: number
}
export interface PersonalConsumeQuery {}
export interface TeamCourseQuery {}
export interface TeamConsumeQuery {}
export interface RevenueShopListQuery {
  page?: number
  size?: number
  day?: number
  start_date: string
  end_date: string
}
export interface FinanceShopListQuery {
  page?: number
  size?: number
  recently_day?: number
  start_date: string
  end_date: string
}
export interface CourseShopListQuery {
  page?: number
  size?: number
  recently_day?: number
  start_date: string
  end_date: string
}
export interface OrderShopListQuery {
  page?: number
  size?: number
  day?: number
  start_date: string
  end_date: string
}
export interface SellStaffListQuery {
  page?: number
  size?: number
  day?: number
  staff_id?: number
  department_id?: number
  start_date: string
  end_date: string
  current_page: number
}
export interface RevenueShopTodayQuery {}
