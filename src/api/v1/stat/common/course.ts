import { Api } from '@/api/api'
// 课程数据统计（门店、品牌）弹窗
export class CourseApi extends Api {
  /**
   * barnd 品牌 shop 门店
   * personal 私课 team 团课
   * coach 教练 member 会员
   */
  PersonalReserveMap$ = {
    'brand-personal-coach':
      '/v1/report/brand/personal_coach/effective_reserve_list',
    'brand-team-coach': '/v1/report/brand/team_coach/effective_reserve_list',
    'brand-personal-member':
      '/v1/report/personal-member/brand/get-reserve-list',
    'brand-team-course': '/v1/report/brand/team_course/effective_reserve_list',
    'shop-personal-coach':
      '/v1/report/shop/personal_coach/effective_reserve_list',
    'shop-team-coach': '/v1/report/shop/team_coach/effective_reserve_list',
    'shop-personal-member': '/v1/report/personal-member/shop/get-reserve-list',
    'shop-team-course': '/v1/report/shop/team_course/effective_reserve_list'
  }
  /**
   * 预约明细
   */
  getReserveList(query: CourseDataParams, type: string) {
    return this.http.get(this.PersonalReserveMap$[type], {
      query
      // yapi: 53
    })
  }

  CoachMap$ = {
    'brand-personal-coach': '/v1/report/brand/personal_coach/free_coach_list',
    'brand-team-coach': '/v1/report/brand/team_coach/free_coach_list',
    'shop-personal-coach': '/v1/report/shop/personal_coach/free_coach_list',
    'shop-team-coach': '/v1/report/shop/team_coach/free_coach_list'
  }
  /**
   * 查看员工
   */
  getCoachList(query: FreeCoachParams, type: any) {
    return this.http.get(this.CoachMap$[type], {
      query
      // yapi: 53
    })
  }
}

export interface FreeCoachParams {
  shop_id?: number
  staff_id?: number
  current_page?: number
  size?: number
  day?: number
  start_date?: string
  end_date?: string
}

export interface CourseDataParams {
  shop_id?: number
  staff_id?: number
  member_id?: number
  course_id?: number
  category_id?: number
  current_page?: number
  size?: number
  day?: number
  start_date?: string
  end_date?: string
}
