import { Api } from '@/api/api'
// 品牌下的课程数据统计
export class CourseApi extends Api {
  /**
   * 品牌 课程概览统计图
   */
  getChart(query: CourseChartParams) {
    return this.http.get(`/v1/report/brand/course/overview`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 私教上课（教练）列表
   */
  getCoachList(query: CourseDataParams) {
    return this.http.get(`/v1/report/brand/personal_coach/list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 私教上课（教练）合计
   */
  getCoachTotal(query: CourseDataParams) {
    return this.http.get(`/v1/report/brand/personal_coach/total`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 团课上课（教练）列表
   */
  getTeamCoachList(query: CourseDataParams) {
    return this.http.get(`/v1/report/brand/team_coach/list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 团课上课（教练）合计
   */
  getTeamCoachTotal(query: CourseDataParams) {
    return this.http.get(`/v1/report/brand/team_coach/total`, {
      query
      // yapi: 53
    })
  }

  /**
   * 品牌 私教上课（会员）列表
   */
  getMemberList(query: CourseDataParams) {
    return this.http.get(`/v1/report/personal-member/brand/get-list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 私教上课（会员）合计
   */
  getMemberTotal(query: CourseDataParams) {
    return this.http.get(`/v1/report/personal-member/brand/get-total-data`, {
      query
      // yapi: 53
    })
  }

  /**
   * 品牌 团课上课（课程）列表
   */
  getTeamCourseList(query: CourseDataParams) {
    return this.http.get(`/v1/report/brand/team_course/list`, {
      query
    })
  }
  /**
   * 品牌 团课上课（课程）合计
   */
  getTeamCourseTotal(query: CourseDataParams) {
    return this.http.get(`/v1/report/brand/team_course/total`, {
      query
    })
  }

  /**
   * 品牌 私教存课（课程）列表
   */
  getStockList(query: CourseDataParams) {
    return this.http.get(`/v1/report/personal-course/brand/get-list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 私教存课（课程）子列表
   */
  getStockChildList(query: CourseDataParams) {
    return this.http.get(`/v1/report/personal-course/brand/get-sold-list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 私教存课（课程）合计
   */
  getStockTotal(query: CourseDataParams) {
    return this.http.get(`/v1/report/personal-course/brand/get-total-data`, {
      query
      // yapi: 53
    })
  }
}

export interface CourseChartParams {
  shop_id?: number
}

export interface CourseDataParams {
  shop_id?: number
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
