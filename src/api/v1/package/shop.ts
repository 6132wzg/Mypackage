import { Api } from '@/api/api'

export class ShopPackageApi extends Api {
  getList(query: any) {
    return this.http.get(`/v1/special/course/category`, { query })
  }
  getPackageList(query: any) {
    return this.http.get(`/v1/course/package/shop`, { query })
  }
  editShowBack(id: any) {
    return this.http.get(`/v1/course/package/shop/edit/${id}`)
  }
  addPackageInfo(params: any) {
    return this.http.post(`/v1/course/package/shop`, { params })
  }
  editPackageInfo(params: any) {
    return this.http.put(`/v1/course/package/shop/${params.id}`, {
      params
    })
  }

  getPackageDetail(query: GetDetailInput) {
    return this.http.get(`/v1/course/package/${query.packageType}/${query.id}`)
  }
  getUpShelf(query: QueryInput) {
    return this.http.get(`/v1/course/package/shop/upshelf/${query.id}`, {
      query
    })
  }
  getDownShelf(query: QueryInput) {
    return this.http.get(`/v1/course/package/shop/downshelf/${query.id}`, {
      query
    })
  }
  setUpShelf(params: UpShelfInput) {
    return this.http.put(`/v1/course/package/shop/upshelf/${params.id}`, {
      params
    })
  }
  setDownShelf(params: any) {
    return this.http.put(`/v1/course/package/shop/downshelf/${params.id}`, {
      params
    })
  }
  shelfPackage(params: any) {
    return this.http.post(`/v1/course/package/shop/up`, {
      params
    })
  }
}

export interface GetDetailInput {
  id: number
  packageType: string // brand shop
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
