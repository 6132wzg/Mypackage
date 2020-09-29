import { Api } from '@/api/api'
// 数据统计报表 公共接口
export class CommonApi extends Api {
  /**
   * 品牌 全部员工
   */
  getStaffList(query: AllStaffListParams) {
    return this.http.get(`/v1/staff/brand/get-all-staff`, {
      query
    })
  }
  /**
   * 门店 全部员工
   */
  getShopStaffList(query: AllStaffListParams) {
    return this.http.get(`/v1/staff/shop/get-all-staff`, { query })
  }

  // 全部教练？-是部门
  getDepartmentList() {
    return this.http.get('/v1/department/get-all-list')
  }
  // 全部课程
  getCourseList(query: CourseListParams) {
    return this.http.get('/v1/report/common/course/list', { query })
  }

  // 私教课
  getPersonalCourseList(query: CourseListParams) {
    // /v1/report/personal-course/get-template-list
    return this.http.get('/v1/report/personal-course/get-template-list', {
      query
      // yapi: 53
    })
  }
  /**
   * 搜索会员
   */
  getMemberList(query: GetMemberListInput, type: any = '') {
    return this.http.get(`/v1/member/${type}/options`, { query })
  }
  /**
   * 搜索全量会员
   */
  getAllMemberList(query: GetMemberListInput) {
    return this.http.get(`/v1/member/brand/members`, { query })
  }

  /**
   * 课程类型列表
   */
  getCourseCategoryList(query = {}) {
    return this.http.get('/v1/special/course/category', {
      query: Object.assign(
        {
          size: 100
        },
        query
      )
    })
  }
  /**
   * 品牌 营收汇总 刷新
   */
  getRevenueGatherRefresh() {
    return this.http.get(`/v1/report/revenue/brand/increment_refresh`, {
      // yapi: 53
    })
  }
  /**
   * 品牌 营收汇总 刷新
   */
  getShopRevenueGatherRefresh() {
    return this.http.get(`/v1/report/revenue/shop/increment_refresh`, {
      // yapi: 53
    })
  }
  /**
   * 品牌 营收(商品) 刷新
   */
  getRevenueProductRefresh() {
    return this.http.get(`/v1/report/revenue/brand/product/increment_refresh`, {
      // yapi: 53
    })
  }
  /**
   * 门店 营收(商品) 刷新
   */
  getShopRevenueProductRefresh() {
    return this.http.get(`/v1/report/revenue/shop/product/increment_refresh`, {
      // yapi: 53
    })
  }

  /**
   * 销售汇总(商品) 刷新
   */
  getProductPerformanceRefresh() {
    return this.http.post(`/v1/report/product-performance/refresh`, {
      // yapi: 53
    })
  }
  /**
   * 销售汇总(员工) 刷新
   */
  getSalesRefresh() {
    return this.http.post(`/v1/report/sales/refresh`, {
      // yapi: 53
    })
  }
  /**
   * 私教存课(课程) 刷新
   */
  getPersonalCousreCStockRefresh() {
    return this.http.post(`/v1/report/personal-course/refresh`, {
      // yapi: 53
    })
  }
}

export interface AllStaffListParams {
  shop_id?: number
  department_id?: number
}

export interface GetMemberListInput {
  current_page?: number
  size?: number
  keyword?: string
}

export interface CourseListParams {
  type?: number
  category_id?: number
  shop_id?: number
  current_page?: number
  size?: number
}
