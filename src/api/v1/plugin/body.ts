import { Api } from '@/api/api'

export class PluginBodyApi extends Api {
  // 体测项目列表
  getBodyTemplateInfo() {
    return this.http.get(`/v1/plugin/body/brand_items`)
  }

  // 体测项目新增
  addBodyIndicator(params: IndicatorAddQuery) {
    return this.http.post(`/v1/plugin/body/item_add`, { params })
  }
  // 体测项目编辑
  editBodyIndicator(params: IndicatorEditQuery) {
    return this.http.post(`/v1/plugin/body/item_edit`, { params })
  }
  // 体测项目删除
  deleteBodyIndicator(id: string | number) {
    return this.http.post(`/v1/plugin/body/item_del`, {
      params: { id }
    })
  }
  // 体测项目删除
  moveBodyIndicators(params: any) {
    return this.http.post(`/v1/plugin/body/item_move`, {
      params
    })
  }
  // 体态图列表
  getBodyAlbumTemplate() {
    return this.http.get('/v1/plugin/body/brand_album_template')
  }
  // 体态图新增
  addBodyAlbumTemplate(img_name: string) {
    return this.http.post('/v1/plugin/body/image_template_add', {
      params: { img_name }
    })
  }
  // 体态图删除
  deleteBodyAlbumTemplate(id: string | number) {
    return this.http.post('/v1/plugin/body/image_template_del', {
      params: { id }
    })
  }
}

export interface IndicatorAddQuery {
  item_name: string
  item_unit: string
  is_show: number
  is_must: number
}

export interface IndicatorEditQuery {
  item_key: string
  item_value: string
  id: number
}

export interface EditBodyAlbumTemplateInput {
  img_name: string
  id: number
}
