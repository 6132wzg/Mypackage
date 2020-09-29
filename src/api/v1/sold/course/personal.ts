import { Api } from '@/api/api'

export class SoldPersonalCourseApi extends Api {
  /**
   * 售出私教课扣次回显
   * @param {number} id
   */
  getDeductionInfo(id: number) {
    return this.http.get(`/v1/sold/course/personal/deduction/${id}`)
  }
  /**
   * 售出私教课扣次
   * @param {number} id
   */
  deduct(id, params: DeductInput) {
    return this.http.put(`/v1/sold/course/personal/deduction/${id}`, {
      params
    })
  }
  /**
   * 获取售出权益回显数据
   * @param {number} id
   */
  getRightsInfo(id: number) {
    return this.http.get(`/v1/sold/course/personal/rights/${id}`)
  }
  /**
   * 修改售出权益
   * @param {number} id
   */
  updateRights(id, params: UpdateRightsInput) {
    return this.http.put(`/v1/sold/course/personal/rights/${id}`, {
      params
    })
  }
}

export interface DeductInput {
  /**
   * 扣课次数
   */
  'personal-num': number
  /**
   * 扣课课程id
   */
  'personal-course_id': number
  /**
   * 扣课教练id
   */
  'personal-coach_id': number
  /**
   * 扣除时间
   */
  deduction_time: string
  /**
   * 备注
   */
  content: string
}

export interface UpdateRightsInput {}
