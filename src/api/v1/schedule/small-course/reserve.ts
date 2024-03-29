import { Api } from '@/api/api'

/**
 *
 *
 * @export
 * @class ScheduleApi
 * @extends {Api}
 * 小班课排期接口
 */
export class SmallCourseScheduleReserveApi extends Api {
  /**
   *
   * @param params
   * 新增预约
   */
  addAtion(params: AddReserveInput) {
    return this.http.post('/v1/schedule/small_course/shop/reserve', { params })
  }
  /**
   *
   * @param id
   * 取消预约
   */
  cancelAtion(id: any) {
    return this.http.put(`/v1/schedule/small_course/shop/cancel/${id}`)
  }
  /**
   *
   * @param params
   * 小班课签到消费
   */
  check(id: any) {
    return this.http.put(`/v1/schedule/small_course/shop/check/${id}`)
  }
  /**
   *
   * @param id
   * 获取预约详情
   */
  getInfo(id: string) {
    return this.http.get(`/v1/schedule/small_course/shop/${id}`)
  }
  /**
   * 取消排期
   */
  cancel(id: string) {
    return this.http.put(`/v1/schedule/small/cancel/${id}`)
  }
  /**
   * 新增补课
   */
  remedial(params: any) {
    return this.http.post(`/v1/schedule/small_course/shop/make_up/add`, {
      params
    })
  }
  /**
   * 补签到
   */
  checkSign(id: string) {
    return this.http.put(`/v1/schedule/small_course/shop/make_up/check/${id}`)
  }
  /**
   * 请假
   */
  leave(id: string) {
    return this.http.put(`/v1/schedule/small_course/shop/leave/${id}`)
  }
  /**
   * 查看补课
   */
  getMessage(id: string) {
    return this.http.get(`/v1/schedule/small_course/shop/make_up/msg?id=${id}`)
  }
  /**
   * 补课排期列表
   */
  sheduleList(params: any) {
    return this.http.get(
      `/v1/schedule/small_course/shop/make_up/list?id=${params.id}&course_id=${params.course_id}`
    )
  }
  /**
   * 补课课程列表
   */
  courseList(id: String) {
    return this.http.get(
      `/v1/schedule/small_course/make_up/course?member_id=${id}}`
    )
  }
  /**
   * 补课回显
   */
  courseInfo(id: string) {
    return this.http.get(`/v1/schedule/small_course/shop/make_up/info?id=${id}`)
  }
}
export interface AddReserveInput {
  schedule_id: number
  member_id: number
  seat: any[]
  consume_type: number
  consume_id: number
}
export interface CheckInput {
  id: number
  checkin_method: number
}
