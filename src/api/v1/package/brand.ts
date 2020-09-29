import { Params } from './../staff'
import { GetInfoInput } from '@/api/v1/admin/tooltip'
import { Api } from '@/api/api'

export class BrandPackageApi extends Api {
  addUnLimit(params: any) {
    return this.http.post('/v1/course/package/brand/unlimited', {
      params
    })
  }
  addFix(params: any) {
    return this.http.post('/v1/course/package/brand/fixation', {
      params
    })
  }
  addRange(params: any) {
    return this.http.post('/v1/course/package/brand/range', {
      params
    })
  }
  addUnLimitAndOnShelf(params: any) {
    return this.http.post('/v1/course/package/brand/unlimited/up', {
      params
    })
  }
  addFixOnShelf(params: any) {
    return this.http.post('/v1/course/package/brand/fixation/up', {
      params
    })
  }
  addRangeOnShelf(params: any) {
    return this.http.post('/v1/course/package/brand/range/up', {
      params
    })
  }
  editUnLimit(params: any) {
    return this.http.put(`/v1/course/package/brand/unlimited/${params.id}`, {
      params
    })
  }
  editFix(params: any) {
    return this.http.put(`/v1/course/package/brand/fixation/${params.id}`, {
      params
    })
  }
  editRange(params: any) {
    return this.http.put(`/v1/course/package/brand/range/${params.id}`, {
      params
    })
  }
  getFixEditShow(id: any) {
    return this.http.get(`/v1/course/package/brand/fixation/${id}`)
  }
  getRangeEditShow(id: any) {
    return this.http.get(`/v1/course/package/brand/range/${id}`)
  }
  getUnLimitEditShow(id: any) {
    return this.http.get(`/v1/course/package/brand/unlimited/${id}`)
  }
  getList(query: QueryInfo) {
    return this.http.get(`/v1/course/package/brand`, { query })
  }
  getUpShelf(query: QueryInput) {
    return this.http.get(`/v1/course/package/brand/upshelf/${query.id}`, {
      query
    })
  }
  getDownShelf(query: QueryInput) {
    return this.http.get(`/v1/course/package/brand/downshelf/${query.id}`, {
      query
    })
  }
  setUpShelf(params: UpShelfInput) {
    return this.http.put(`/v1/course/package/brand/upshelf/${params.id}`, {
      params
    })
  }
  deletePackage(id: number | string) {
    return this.http.delete(`/v1/course/package/brand/${id}`)
  }
  setDownShelf(params: any) {
    return this.http.put(`/v1/course/package/brand/downshelf/${params.id}`, {
      params
    })
  }
  getShelfStatusList(id: number | string) {
    return this.http.get(`/v1/course/package/brand/shelf_status/${id}`)
  }
  getDownShelfShopList(id: number | string) {
    return this.http.get(`/v1/course/package/brand/downshelf_shops/${id}`)
  }
  getPackageDetailInfo(query: GetDetailInput) {
    return this.http.get(
      `/v1/course/package/brand/${query.packageType}/detail/${query.id}`,
      {
        query
      }
    )
  }
  getPackageDetail(query: GetDetailInput) {
    return this.http.get(`/v1/course/package/${query.packageType}/${query.id}`)
  }
  setSyncSold(id: string | number) {
    return this.http.put(`/v1/course/package/sync_sold/${id}`)
  }
  editShowBack(id: any) {
    return this.http.get(`/v1/course/package/brand/edit/${id}`)
  }
  addPackageInfo(params: any) {
    return this.http.post(`/v1/course/package/brand`, { params })
  }
  editPackageInfo(params: any) {
    return this.http.put(`/v1/course/package/brand/${params.id}`, {
      params
    })
  }
  shelfPackage(params: any) {
    return this.http.post(`/v1/course/package/brand/up`, {
      params
    })
  }
}

export interface QueryInfo {
  package_type?: number
  channel?: string
  sort_by?: string
  page?: number
  size?: number
}
export interface GetDetailInput {
  id: number
  packageType: string // range 范围内 ， fixation 固定的 不限课程 unlimited
}
export interface QueryInput {
  pageType: string
  id: number
}
export interface UpShelfInput {
  id: string
  pageType: string
  sale_start_time: string
  sale_end_time: string
}
