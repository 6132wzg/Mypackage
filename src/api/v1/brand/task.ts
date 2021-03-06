import { Api } from '@/api/api'

export class TaskApi extends Api {
  /**
   * 获取门店下任务中心数据列表
   * @param query
   */
  getList(query: any) {
    return this.http.get('/v1/setting/brand/task', { query })
  }
  /**
   * 获取任务执行详情列表信息
   * @param query
   */
  getDetailList(query: any) {
    return this.http.get(`/v1/setting/brand/task/${query.task_id}`, { query })
  }
  /**
   * 终止任务
   * @param query
   */
  stopTask(task_id: any) {
    return this.http.delete(`/v1/setting/brand/task/${task_id}`)
  }
}
