import { Api } from '@/api/api'
const url = '/v1/setting/course'
export class CourseApi extends Api {
  /**
   * 课程类型列表
   */
  getCourseCategoryList(query: GetCourseCategoryListInput = {}) {
    return this.http.get(url, {
      query: Object.assign(
        {
          size: 100
        },
        query
      )
    })
  }
  /**
   * 新增课程类型
   */
  addCourseCategory(params: AddCourseCategoryInput) {
    return this.http.post(url, { params })
  }
  /**
   * 编辑课程类型
   */
  updateCourseCategory(params: UpdateCourseCategoryInput) {
    return this.http.put(`${url}/${params.id}`, { params })
  }
  /**
   * 删除课程类型
   */
  deleteCourseCategory(params: DeleteCourseCategoryInput) {
    return this.http.delete(`${url}/${params.id}`)
  }
  /**
   * 获取小班课范围列表
   */
  getCourseGroupRangeList(query: {}) {
    return this.http.get('/v1/setting/course/scope', {
      query: Object.assign(
        {
          size: 100
        },
        query
      )
    })
  }
  /**
   * 新增小班课范围
   */
  addCourseRange(params: any) {
    return this.http.post('/v1/setting/course/scope', { params })
  }
  /**
   * 编辑小班课范围
   */
  editCourseRange(params: any) {
    return this.http.put('/v1/setting/course/scope/' + params.id, {
      params
    })
  }
  /**
   * 删除课程范围
   */
  deleteCourseRange(id: string) {
    return this.http.delete('/v1/setting/course/scope/' + id)
  }
}

export interface GetCourseCategoryListInput {
  page?: number
  size?: number
}

export interface AddCourseCategoryInput {
  /**
   * 新增课程类型名称
   */
  setting_name: string
}

export interface UpdateCourseCategoryInput {
  /**
   * 课程类型id
   */
  id: number
  /**
   * 编辑课程类型名称
   */
  setting_name: string
}

export interface DeleteCourseCategoryInput {
  /**
   * 课程类型设置ID
   */
  id: number
}
