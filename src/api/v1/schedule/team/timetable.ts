import { Api } from '@/api/api'

export class TeamScheduleTimeTableApi extends Api {
  /**
   * 获取课表模板
   */
  getTimeTableTemplate() {
    return this.http.get('/v1/schedule/team/shop/timetable/template')
  }
  /**
   * 编辑课表模板
   * @param params
   */
  saveTimeTableTemplate(params: any) {
    return this.http.put('/v1/schedule/team/shop/timetable/template', {
      params
    })
  }
  /**
   * 获取课表列表
   * @param query
   */
  getTimeTableList(query: any) {
    return this.http.get('/v1/schedule/team/shop/timetable/list', {
      query
    })
  }
}
