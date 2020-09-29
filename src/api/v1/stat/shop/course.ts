import { Api } from '@/api/api'
// 门店下的课程数据统计
export class CourseApi extends Api {
  /**
   * 门店 私教上课（教练）列表
   */
  getShopCoachList(query: CourseDataParams) {
    return this.http.get(`/v1/report/shop/personal_coach/list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 门店 私教上课（教练）合计
   */
  getShopCoachTotal(query: CourseDataParams) {
    return this.http.get(`/v1/report/shop/personal_coach/total`, {
      query
      // yapi: 53
    })
  }
  /**
   * 门店 团课上课（教练）列表
   */
  getShopTeamCoachList(query: CourseDataParams) {
    return this.http.get(`/v1/report/shop/team_coach/list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 门店 团课上课（教练）合计
   */
  getShopTeamCoachTotal(query: CourseDataParams) {
    return this.http.get(`/v1/report/shop/team_coach/total`, {
      query
      // yapi: 53
    })
  }

  /**
   * 门店 私教上课（会员）列表
   */
  getMemberList(query: CourseDataParams) {
    return this.http.get(`/v1/report/personal-member/shop/get-list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 门店 私教上课（会员）合计
   */
  getMemberTotal(query: CourseDataParams) {
    return this.http.get(`/v1/report/personal-member/shop/get-total-data`, {
      query
      // yapi: 53
    })
  }
  /**
   * 门店 团课上课（课程）列表
   */
  getTeamCourseList(query: CourseDataParams) {
    return this.http.get(`/v1/report/shop/team_course/list`, {
      query
    })
  }
  /**
   * 门店 团课上课（课程）合计
   */
  getTeamCourseTotal(query: CourseDataParams) {
    return this.http.get(`/v1/report/shop/team_course/total`, {
      query
    })
  }

  /**
   * 门店 私教存课（课程）列表
   */
  getStockList(query: CourseDataParams) {
    return this.http.get(`/v1/report/personal-course/shop/get-list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 门店 私教存课（课程）子列表
   */
  getStockChildList(query: CourseDataParams) {
    return this.http.get(`/v1/report/personal-course/shop/get-sold-list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 门店 私教存课（课程）合计
   */
  getStockTotal(query: CourseDataParams) {
    return this.http.get(`/v1/report/personal-course/shop/get-total-data`, {
      query
      // yapi: 53
    })
  }
}

export interface CourseDataParams {
  staff_id?: number
  member_id?: number
  course_id?: number
  category_id?: number
  current_page?: number
  size?: number
  day?: number
  start_date?: string
  end_date?: string
}
