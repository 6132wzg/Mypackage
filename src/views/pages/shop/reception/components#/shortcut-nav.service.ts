import { Injectable } from 'vue-service-app'
import { AuthService } from '@/services/auth.service'

@Injectable()
export class ShortcutNavService {
  auth$ = this.authService.authMap$({
    receptionRecord: 'shop:front_end:module|goods_manage', // 发货管理
    store: 'shop:front_end:module|cloud_store', // 云店
    soldCard: 'shop:front_end:module|sold_card_tab', // 售卡管理
    soldCourse: 'shop:front_end:module|sold_course_tab', // 售课管理
    courseSign: 'shop:front_end:module|reserve_page', // 课程签到 x
    checkInoutRecord: 'shop:front_end:module|check_in_get', // 入离场明细
    earnestManage: 'shop:front_end:module|temporary_page', // 定金管理
    scheduleAgency: 'shop:front_end:module|schedule_page', // 课程预约
    receptionCabinet: 'shop:front_end:module|cabinet_page' // 储物柜
  })
  constructor(private authService: AuthService) {}
}
