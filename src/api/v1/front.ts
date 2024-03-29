import { Api } from '../api'

export interface AddWorkNotesInput {
  subject: string
  content: string
}
export interface GetMemberListInput {
  keyword?: string
}
export interface GetEntranceListInput {
  entry_type?: number
  keyword?: string
  current_page: number
  size: number
}
export interface SetEntranceLeaveBatchInput {
  ids: Array<number>
}
export interface SetEntranceInput {
  member_id: number
  cabinet_id?: number
  proof_type: number
  proof_value: number
  seller_id?: number
  coach_id?: number
}
export interface EditEntranceCabinetInput {
  id: number
  cabinet_id: number
}
export interface EditSellerInput {
  member_id: number
  seller_id: number
}
export interface EditCoachInput {
  member_id: number
  coach_id: number
}
export interface GetCabinetInput {
  keywords?: string
}
export class FrontApi extends Api {
  /**
   * 新增待办
   */
  addWorkNotes(params: AddWorkNotesInput) {
    return this.http.post(`/v1/front/notes`, { params })
  }
  /**
   * 待办列表
   */
  getWorkNoteList() {
    return this.http.get(`/v1/front/notes`)
  }
  /**
   *  完成待办
   */
  setWorkNote(id: string) {
    return this.http.put(`/v1/front/notes/${id}`)
  }
  /**
   *  已完成的待办列表
   */
  getWorkNoteDoneList() {
    return this.http.get(`/v1/front/notes/done`)
  }
  /**
   * 搜索会员
   */
  getMemberList(query: GetMemberListInput) {
    return this.http.get(`/v1/member/options`, { query })
  }
  /**
   * 入场管理列表
   */
  getEntranceList(query: GetEntranceListInput) {
    return this.http.get(`/v1/front/entrance`, { query })
  }
  /**
   * 入离场记录
   */
  getEntranceLogList(query: GetEntranceListInput) {
    return this.http.get(`/v1/front/entrance/stat`, { query })
  }
  /**
   * 单个离场
   */
  setEntranceLeave(id: string) {
    return this.http.delete(`/v1/front/entrance/leave/${id}`)
  }
  /**
   * 离场之前判断柜子是否是智能柜
   */
  getCabinetInfo(id: string) {
    return this.http.get(`/v1/front/cabinet/member/${id}/temporary`)
  }
  /**
   * 批量离场
   */
  setEntranceLeaveBatch(params: SetEntranceLeaveBatchInput) {
    return this.http.post(`/v1/front/entrance/batch`, { params })
  }
  /**
   * 前台头部统计
   */
  getEntranceSummary() {
    return this.http.get(`/v1/front/stat`)
  }
  /**
   * 销售员列表
   */
  getSellerList() {
    return this.http.get(`/v1/front/entrance/seller`)
  }
  /**
   * 教练列表
   */
  getCoachList() {
    return this.http.get(`/v1/front/entrance/coach`)
  }
  /**
   * 前台会员详情
   */
  getMemberInfo(id: string) {
    return this.http.get(`/v1/front/entrance/member/${id}`)
  }
  /**
   *  入场凭证列表
   */
  getEntranceOptionList(id: string) {
    return this.http.get(`/v1/front/entrance/options/${id}`)
  }
  /**
   *  储物柜列表
   */
  getCabinetList(id: string, query: GetCabinetInput) {
    return this.http.get(`/v1/front/cabinet/options/${id}`, { query })
  }
  /**
   *  会员入场
   */
  setEntrance(params: SetEntranceInput) {
    return this.http.post(`/v1/front/entrance`, { params })
  }
  /**
   *  修改入场会员的储物柜
   */
  editEntranceCabinet(params: EditEntranceCabinetInput) {
    return this.http.put(`/v1/front/entrance/cabinet`, { params })
  }
  /**
   *  关联跟进销售
   */
  editSeller(params: EditSellerInput) {
    return this.http.put(`/v1/front/entrance/seller`, { params })
  }
  /**
   *  关联跟进销售
   */
  editCoach(params: EditCoachInput) {
    return this.http.put(`/v1/front/entrance/coach`, { params })
  }
}
