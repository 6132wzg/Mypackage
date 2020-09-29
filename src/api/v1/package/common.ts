import { Api } from '@/api/api'

export class CommonPackageApi extends Api {
  getCourseList(params: GetCourseInput) {
    const platform = params.platform ? `${params.platform}/` : ''
    return this.http.get(`/v1/course/package/${platform}${params.type}`, {
      query: {
        search: params.search,
        course_type: params.course_type
      }
    })
  }
  /**
   * 教练等级与教练数列表
   */
  getCoachList() {
    return this.http.get(`/v1/course/package/coach`)
  }
  getUpShelf(query: QueryInput) {
    return this.http.get(
      `/v1/course/package/${query.pageType}/upshelf/${query.id}`,
      {
        query
      }
    )
  }
  getDownShelf(query: QueryInput) {
    return this.http.get(
      `/v1/course/package/${query.pageType}/downshelf/${query.id}`,
      {
        query
      }
    )
  }
  setUpShelf(params: UpShelfInput) {
    return this.http.put(
      `/v1/course/package/${params.pageType}/upshelf/${params.id}`,
      {
        params
      }
    )
  }
  deletePackage(params: any) {
    return this.http.delete(
      `/v1/course/package/${params.pageType}/${params.id}`
    )
  }
  setDownShelf(params: any) {
    return this.http.put(
      `/v1/course/package/${params.pageType}/downshelf/${params.id}`,
      {
        params
      }
    )
  }
}

export interface GetCourseInput {
  type: string
  search?: string
  course_type?: number
  platform?: string
}
export interface QueryInfo {
  pageType: string
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
