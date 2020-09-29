import { Api } from '@/api/api'

export class ApplicationApi extends Api {
  /**
   * 选择会员卡
   */
  getCardList(query: GetCardListInput) {
    return this.http.get('/v1/applications/auto-renewal/card-list', { query })
  }
  /**
   * 商品列表
   */
  getProductList(query: GetProductListInput) {
    return this.http.get('/v1/applications/auto-renewal/list', {
      query
    })
  }
  /**
   * 商品详情
   */
  getProductDetail(query: { id: number }) {
    return this.http.get('/v1/applications/auto-renewal/info', {
      query
    })
  }
  /**
   * 商品新增
   */
  productAdd(params: any) {
    return this.http.post('/v1/applications/auto-renewal/add', {
      params
    })
  }
  /**
   * 商品编辑
   */
  productEdit(params: any) {
    return this.http.put('/v1/applications/auto-renewal/edit', {
      params
    })
  }
  /**
   * 商品上架
   */
  productPutaway(id: number) {
    return this.http.put('/v1/applications/auto-renewal/up', {
      params: { id }
    })
  }
  /**
   * 商品下架
   */
  productSoldOut(id: number) {
    return this.http.put('/v1/applications/auto-renewal/down', {
      params: { id }
    })
  }
  /**
   * 商品下架
   */
  productDel(id: number) {
    return this.http.delete(`/v1/applications/auto-renewal/delete/${id}`)
  }
  /**
   * 考勤设置-时间区间
   */
  getAttendanceSettingTime() {
    return this.http.get(`/v1/applications/staff-attendance/time-mapping`)
  }
  /**
   * 考勤设置-查看
   */
  getAttendanceSetting() {
    return this.http.get(`/v1/applications/staff-attendance/setting`)
  }
  /**
   * 考勤设置-保存
   */
  putAttendanceSetting(params: PutAttendanceSettingInterface) {
    return this.http.put(`/v1/applications/staff-attendance/setting`, {
      params
    })
  }
  /**
   * 考勤统计
   */
  getAttendanceSummary(query: GetAttendanceSummaryInterface) {
    return this.http.get(`/v1/applications/staff-attendance/summary`, {
      query
    })
  }
  /**
   * 考勤报表
   */
  getAttendanceList(query: GetAttendanceListInterface) {
    return this.http.get(`/v1/applications/staff-attendance/list`, {
      query
    })
  }
  /**
   * 考勤报表-补卡
   */
  postAttendanceMend(params: PostAttendanceMendInterface) {
    return this.http.post(`/v1/applications/staff-attendance/mend`, {
      params
    })
  }
  /**
   * 考勤报表-获取门店信息
   */
  getStaffShops(query: { id: [number, string] }) {
    return this.http.get(`/v1/applications/staff-attendance/staff-shops`, {
      query
    })
  }
}
export interface GetProductListInput {
  shelf_status?: number
  card_name?: string
}
export interface GetCardListInput {
  current_page?: number
}

export interface GetAttendanceListInterface {
  date_symbol?: string
  date_start?: string
  date_end?: string
  shop_id?: string
  department_id?: string
  staff_id?: string
  current_page?: string
  size?: string
}

export interface GetAttendanceSummaryInterface {
  date_symbol?: string
  date_start?: string
  date_end?: string
  shop_id?: string
  department_id?: string
  staff_id?: string
}

export interface PostAttendanceMendInterface {
  id?: [string, number]
  staff_id: [string, number]
  date: string
  in_shop_id: [string, number]
  in_time: string
  out_shop_id: [string, number]
  out_time: string
  remark: string
}

export interface PutAttendanceSettingInterface {
  types: Array<number>
  start: string
  range: number
  end: string
}
