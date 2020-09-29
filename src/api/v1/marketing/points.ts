import { Api } from '../../api'
export interface PointsMemberListQuery {
  keyword: string
  sort_by: string
  sort_order: string
}
export interface PointsDetailsListQuery {
  keyword: string
  start_time: string
  end_time: string
  action: number
  search_date: number
}
export interface EditPoints {
  validate_num: number
  validdate_unit: number
  get_rules: object[]
  support_category: object[]
  points_limit: number
  activity_status: number
}
export interface EditPointsInput {
  member_ids?: number[]
  memberId?: number
  points: number
  remark: string
}
export class PointsApi extends Api {
  // 会员积分列表
  getPointsMemberList(query: PointsMemberListQuery) {
    return this.http.get('/v1/plugin/points/member', { query })
  }
  // 积分流水列表
  getPointsDetailsList(query: PointsDetailsListQuery) {
    return this.http.get('/v1/plugin/points/details', { query })
  }
  // 积分设置
  editPoints(params: EditPoints) {
    return this.http.put('/v1/plugin/points', { params })
  }
  // 积分设置回显
  getPointsInfo() {
    return this.http.get('/v1/plugin/points')
  }
  // 减少积分
  minusPoints(params: EditPointsInput) {
    return this.http.post(`/v1/plugin/points/minus/${params.memberId}`, {
      params
    })
  }
  // 增加积分
  addPoints(params: EditPointsInput) {
    return this.http.post(`/v1/plugin/points/add/${params.memberId}`, {
      params
    })
  }
  // 批量减少积分
  minusPointsByBatch(params: EditPointsInput) {
    return this.http.post('/v1/plugin/points/minus', {
      params
    })
  }
  // 批量增加积分
  addPointsByBatch(params: EditPointsInput) {
    return this.http.post('/v1/plugin/points/add', {
      params
    })
  }
  // 积分 增加、减少、批量增加、批量减少 请求url Map
  addOrMinusPointsUrlMap = (type, params) => {
    return {
      add: `/v1/plugin/points/add/${params.memberId}`,
      'add-by-batch': '/v1/plugin/points/add',
      minus: `/v1/plugin/points/minus/${params.memberId}`,
      'minus-by-batch': '/v1/plugin/points/minus',
      'shop-add': `/v1/plugin/points/shop/add/${params.memberId}`,
      'shop-minus': `/v1/plugin/points/shop/minus/${params.memberId}`
    }[type]
  }
  // 积分 增加、减少、批量增加、批量减少 接口方法
  addOrMinusPoints(params: EditPointsInput, type: any) {
    const url = this.addOrMinusPointsUrlMap(type, params)
    return this.http.post(url, {
      params
    })
  }
}
