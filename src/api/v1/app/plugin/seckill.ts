import { Api } from '../../../api'
/**
 * 秒杀
 */
export class SeckillApi extends Api {
  // 小程序店铺装修、按店铺id查询的 秒杀活动
  getLimitSeckillList(query: any) {
    return this.http.get('/v1/setting/mina/spike', { query })
  }
  // 列表
  getSeckillList(query: any) {
    return this.http.get('/v1/plugin/limited_time_spike', { query })
  }
  // 详情
  getSeckillInfo(id: any) {
    return this.http.get(`/v1/plugin/limited_time_spike/${id}`)
  }
  // 新增
  addSeckill(params: EditSeckill) {
    return this.http.post('/v1/plugin/limited_time_spike', { params })
  }
  // 编辑
  editSeckill(params: EditSeckill) {
    return this.http.put(
      `/v1/plugin/limited_time_spike/${params.activity_id}`,
      { params }
    )
  }
  // 结束
  stopSeckill(id: any) {
    return this.http.put(`v1/plugin/limited_time_spike/${id}/stop`)
  }
  // 删除
  deleteSeckill(id: any) {
    return this.http.delete(`/v1/plugin/limited_time_spike/${id}`)
  }
}

export interface EditSeckill {
  activity_id?: number
}
