import { Api } from '@/api/api'

export class PluginPosApi extends Api {
  // 新增pos机
  addPos(params: any) {
    return this.http.post(`/v1/applications/pos/bind`, { params })
  }

  // 编辑Pos机
  editPos(params: any) {
    return this.http.put(`/v1/applications/pos/edit`, { params })
  }

  // 获取所有可用pos机的列表
  getEnablePosDeviceList(query: any) {
    return this.http.get(`/v1/applications/pos/list-enable`, { query })
  }
  // 获取所有pos机的列表
  getPosDeviceList() {
    return this.http.get(`/v1/applications/pos/list`)
  }
  // 获取pos机相关信息
  getPosInfo(query: any) {
    return this.http.get(`/v1/applications/pos/info`, { query })
  }
  // 获取pos机相关信息
  getPosFinanceTotal(query: any) {
    return this.http.get(`/v1/applications/pos/finance-total`, {
      query
    })
  }
  // 获取pos机相关信息
  getPosFinanceList(query: any) {
    return this.http.get(`/v1/applications/pos/finance-list`, {
      query
    })
  }
}

export interface IndicatorAddQuery {
  item_name: string
  item_unit: string
  is_show: number
  is_must: number
}
