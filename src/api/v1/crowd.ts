import { Api } from '../api'

export interface CrowdDetailQuery {
  id: string
  current_page: number
  size: number
  keyword: string
}

export class CrowdAPI extends Api {
  /* 品牌 获取新增界面初始值 v1/crowd/field get */
  getCrowdBrandField() {
    return this.http.get(`/v1/crowd/brand/field`)
  }
  /* 品牌新增人群v1/crowd/brand */
  setCrowdBrandField(params: any) {
    return this.http.post(`/v1/crowd/brand`, { params })
  }
  /* 品牌人群详情 v1/crowd/brand/<id:\d+> */
  getCrowdBrand(id: string) {
    return this.http.get(`/v1/crowd/brand/crowd/${id}`)
  }
  /* 品牌编辑人群 v1/crowd/brand/crowd/<id:\d+> */
  updateCrowdBrandCrowd(id: string, params: any) {
    return this.http.put(`/v1/crowd/brand/crowd/${id}`, { params })
  }
  /* 品牌 人群首页列表 v1/crowd/index */
  getCrowdIndex() {
    return this.http.get(`/v1/crowd/brand/index`)
  }
  /* 品牌删除人群 v1/crowd/brand/crowd/<id:\d+> */
  delCrowdBrandCrowd(id: string) {
    return this.http.delete(`/v1/crowd/brand/crowd/${id}`)
  }

  /* 门店 获取新增界面初始值 v1/crowd/field get */
  getCrowdShopField() {
    return this.http.get(`/v1/crowd/shop/field`)
  }
  /* 门店 新增人群v1/crowd/brand */
  setCrowdShopField(params: any) {
    return this.http.post(`/v1/crowd/shop`, { params })
  }
  /* 门店 人群详情 v1/crowd/brand/<id:\d+> */
  getCrowdShop(id: string) {
    return this.http.get(`/v1/crowd/shop/crowd/${id}`)
  }
  /* 门店 编辑人群 v1/crowd/brand/crowd/<id:\d+> */
  getCrowdShopCrowd(id: string, params: any) {
    return this.http.put(`/v1/crowd/shop/crowd/${id}`, { params })
  }
  /* 门店 人群首页列表/v1/crowd/shop/index */
  getCrowdShopIndex() {
    return this.http.get(`/v1/crowd/shop/index`)
  }
  /* 删除人群 v1/crowd/brand/crowd/<id:\d+> */
  delCrowdShopCrowd(id: string) {
    return this.http.delete(`/v1/crowd/shop/crowd/${id}`)
  }
  /* 品牌导出 v1/crowd/brand/export/ */
  crowdBrandExport(id: string) {
    return this.http.get(`/v1/crowd/brand/export/${id}`)
  }
  /* 门店导出 v1/crowd/shop/export/ */
  crowdShopExport(id: string) {
    return this.http.get(`/v1/crowd/shop/export/${id}`)
  }
  /* 品牌人群分析 v1/crowd/brand/analysis/<id:\d+> */
  getCrowdBrandAnalysis(id: string) {
    return this.http.get(`/v1/crowd/brand/analysis/${id}`)
  }
  /* 门店人群分析 v1/crowd/shop/analysis/<id:\d+> */
  getCrowdShopAnalysis(id: string) {
    return this.http.get(`/v1/crowd/shop/analysis/${id}`)
  }
  /**
   * 品牌 人群刷新 /v1/crowd/brand/refresh/<id:\d+>
   */
  crowdBrandRefresh(id: string) {
    return this.http.post(`/v1/crowd/brand/refresh/${id}`)
  }
  /**
   * 门店 人群刷新 /v1/crowd/refresh/<id:\d+>
   */
  crowdShopRefresh(id: string) {
    return this.http.post(`/v1/crowd/shop/refresh/${id}`)
  }
  /**
   * 品牌人群明细 v1/crowd/brand/member/<id:\d+>
   */
  crowdBrandMember(query: CrowdDetailQuery) {
    return this.http.get(`/v1/crowd/brand/member/${query.id}`, { query })
  }
  /**
   * 门店人群明细 v1/crowd/shop/member/<id:\d+>
   */
  crowdShopmember(query: CrowdDetailQuery) {
    return this.http.get(`/v1/crowd/shop/member/${query.id}`, { query })
  }
}
