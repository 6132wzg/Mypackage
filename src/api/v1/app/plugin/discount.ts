import { Api } from '../../../api'
/**
 * 限时打折
 */
export class DiscountApi extends Api {
  // 小程序店铺装修、按店铺id查询的 打折活动
  getLimitDiscountList(query: any) {
    return this.http.get('/v1/setting/mina/discount', { query })
  }

  // 列表
  getDiscountList(query: any) {
    return this.http.get('/v1/plugin/limited_time_discount', { query })
  }
  // 详情
  getDiscountInfo(id: any) {
    return this.http.get(`/v1/plugin/limited_time_discount/${id}`)
  }
  // 新增
  addDiscount(params: EditDiscount) {
    return this.http.post('/v1/plugin/limited_time_discount', { params })
  }
  // 编辑
  editDiscount(params: EditDiscount) {
    return this.http.put(
      `/v1/plugin/limited_time_discount/${params.activity_id}`,
      { params }
    )
  }
  // 结束
  stopDiscount(id: any) {
    return this.http.put(`/v1/plugin/limited_time_discount/${id}/stop`)
  }
  // 删除
  deleteDiscount(id: any) {
    return this.http.delete(`v1/plugin/limited_time_discount/${id}`)
  }
}

export interface EditDiscount {
  activity_id?: number
}
