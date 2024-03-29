import { Api } from '../../api'

export class SmallCourseApi extends Api {
  /**
   * 小班课列表
   */
  getSmallCourseList(params: any) {
    return this.http.get(`/v1/sold/course/small_course`, { query: params })
  }
  /**
   * 售出小班课详情
   */
  getSmallCourseInfo(id: string) {
    return this.http.get(`/v1/sold/course/small_course/detail/${id}`)
  }
  /**
   * 售出 小班课 详情操作日志
   */
  getSmallCourseOperationInfo(query: any) {
    return this.http.get(
      `/v1/sold/course/small_course/operation/log/${query.id}`,
      {
        query
      }
    )
  }
  /**
   * 售出 小班课 详情使用记录
   */
  getSmallCourseUsageLog(query: any) {
    return this.http.get(`/v1/sold/course/small_course/usage/log/${query.id}`, {
      query
    })
  }
  /**
   * 售出小班课转让回显
   */
  getTransferSmallCourseInfo(id: string) {
    return this.http.get(`/v1/sold/course/small_course/transfer/${id}`)
  }
  /**
   * 售出小班课转让
   */
  smallCourseTransfer(params: any, id: string) {
    return this.http.put(`/v1/sold/course/small_course/transfer/${id}`, {
      params
    })
  }
  /**
   * 售出小班课换班回显
   */
  getSmallCourseChange(id: string) {
    return this.http.get(`/v1/sold/course/small_course/displace/${id}`)
  }
  /**
   * 售出小班课可选列表
   */
  getSmallCourseSelectList(keywords: string) {
    return this.http.get(`/v1/order/transaction/small_course/select`, {
      query: {
        keywords
      }
    })
  }
  /**
   * 售出小班课换班
   */
  changeSmallCourse(params: any, id: string) {
    return this.http.put(`/v1/sold/course/small_course/displace/${id}`, {
      params
    })
  }
  /**
   * 售出小班课退款回显
   */
  getRefundSmallCourseInfo(id: string) {
    return this.http.get(`/v1/sold/course/small_course/refund/${id}`)
  }
  /**
   * 售出小班课退款
   */
  smallCourseRefund(params: any, id: string) {
    return this.http.put(`/v1/sold/course/small_course/refund/${id}`, {
      params
    })
  }
}
