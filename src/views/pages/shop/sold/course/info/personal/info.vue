<template>
  <st-panel-layout :class="basic()">
    <st-panel title="私教课详情">
      <div slot="actions">
        <st-btn-actions :options="btnOptions"></st-btn-actions>
      </div>
      <a-row :gutter="24">
        <a-col :span="9">
          <st-info>
            <st-info-item label="课程名称">
              {{ personalInfo.course_name }}
            </st-info-item>
            <st-info-item label="类型">{{ personalInfo.type }}</st-info-item>
            <st-info-item label="剩余课时">
              {{ personalInfo.remain_course_num }}节
            </st-info-item>
            <st-info-item label="购买课时">
              {{ personalInfo.init_course_num }}节
            </st-info-item>
            <st-info-item label="有效期">
              {{ personalInfo.buy_time }} 至 {{ personalInfo.end_time }}
            </st-info-item>
            <st-info-item label="合同编号">
              {{ personalInfo.contract_number }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="9">
          <st-info>
            <st-info-item label="所属会员">
              {{ personalInfo.member_name }}
            </st-info-item>
            <st-info-item label="手机号">
              {{ personalInfo.mobile }}
            </st-info-item>
            <st-info-item :label="`上课${$c('coach')}`">
              <coaches :list="personalInfo.coach_name"></coaches>
            </st-info-item>
            <st-info-item :label="`${$c('coach')}等级`">
              {{ personalInfo.coach_level }}
            </st-info-item>
            <st-info-item label="订单号">
              {{ personalInfo.order_id }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="6">
          <st-info>
            <st-info-item label="允许转让">
              {{
                personalInfo.is_transferable
                  | enumFilter('sold_common.is_transferable')
              }}
            </st-info-item>
            <st-info-item label="转让手续费">
              {{ personalInfo.transfer_num
              }}{{
                personalInfo.transfer_unit
                  | enumFilter('package_course.transfer_unit')
              }}
            </st-info-item>
            <st-info-item label="当前状态">
              {{
                personalInfo.course_status
                  | enumFilter('sold_common.course_status')
              }}
            </st-info-item>
            <st-info-item label="订单状态">
              {{
                personalInfo.order_status
                  | enumFilter('sold_common.order_status')
              }}
            </st-info-item>
            <st-info-item label="时长">
              {{ personalInfo.duration }}分钟
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="24">
          <st-info>
            <st-info-item label="备注" class="mg-b0">
              {{ personalInfo.description || '无' }}
            </st-info-item>
          </st-info>
        </a-col>
      </a-row>
    </st-panel>
    <st-panel app class="mg-t12" :tabs="authTabs">
      <!-- TODO：暂不开放，预留代码 -->
      <!-- {
          label: '消费记录',
          route: {
            name: 'shop-sold-course-info-personal-info-consumption-record',
            query: { id: infoService.id }
          }
        }, -->
      <router-view></router-view>
    </st-panel>
  </st-panel-layout>
</template>
<script>
import { InfoService } from './info.service'
import { btnOptions } from './info.config'
import moment from 'moment'
import SoldCourseCoach from '@/views/biz-modals/sold/course/coach'
import SoldCourseFreeze from '@/views/biz-modals/sold/course/freeze'
import SoldCourseRefund from '@/views/biz-modals/sold/course/refund'
import SoldCourseSurplusPersonal from '@/views/biz-modals/sold/course/surplus-personal'
import SoldCourseTransfer from '@/views/biz-modals/sold/course/transfer'
import SoldCourseActivated from '@/views/biz-modals/sold/course/activated'
import SoldCourseLease from '@/views/biz-modals/sold/course/lease'
import Coaches from '@/views/biz-components/course/coaches'
import useInternalNoteActions from '@/hooks/shop/sold-internal-note-actions.hook'
import contractActions from '@/hooks/contract.hook'
import soldPersonalCourseActions from '@/hooks/sold/personal-course-actions.hook'
import { PrintService } from '@/services/print.service'
export default {
  name: 'PageShopSoldCoursePersonalInfo',
  bem: {
    basic: 'page-shop-sold-info'
  },
  modals: {
    SoldCourseCoach,
    SoldCourseFreeze,
    SoldCourseRefund,
    SoldCourseSurplusPersonal,
    SoldCourseTransfer,
    SoldCourseActivated,
    SoldCourseLease
  },
  components: {
    Coaches
  },
  serviceInject() {
    return {
      infoService: InfoService,
      printService: PrintService
    }
  },
  hooks() {
    return {
      internalNoteActions: useInternalNoteActions(),
      contractActions: contractActions(this),
      soldPersonalCourseActions: soldPersonalCourseActions(this)
    }
  },
  rxState() {
    return {
      personalInfo: this.infoService.personalInfo$,
      authTabs: this.infoService.authTabs$,
      auth: this.infoService.auth$
    }
  },
  computed: {
    btnOptions
  },
  methods: {
    moment,
    // 修改剩余课时
    onSurplus() {
      this.$modalRouter.push({
        name: 'sold-course-surplus-personal',
        props: {
          courseData: this.personalInfo
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 跳转合同
    toContract() {
      let record = this.personalInfo
      let url = `${window.location.origin}/common/contract-preview?id=${record.order_id}`
      window.open(url)
    },
    // 冻结
    onFreeze() {
      this.$modalRouter.push({
        name: 'sold-course-freeze',
        props: {
          type: 'personal',
          id: this.personalInfo.id,
          courseName: this.personalInfo.course_name,
          courseNum: this.personalInfo.remain_course_num,
          courseEndTime: moment(this.personalInfo.end_time * 1000),
          time: `${moment(this.personalInfo.buy_time * 1000).format(
            'YYYY-MM-DD HH:mm'
          )} 至 ${moment(this.personalInfo.end_time * 1000).format(
            'YYYY-MM-DD HH:mm'
          )}`
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 取消冻结
    onUnfreeze() {
      this.$confirm({
        title: '提示',
        content: '是否取消冻结？',
        maskClosable: true,
        onOk: () => {
          return this.infoService
            .unFreeze(this.infoService.id)
            .toPromise()
            .then(() => {
              this.$router.reload()
            })
        }
      })
    },
    // 转让
    onTransfer() {
      this.$modalRouter.push({
        name: 'sold-course-transfer',
        props: {
          type: 'personal',
          id: this.personalInfo.id
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 退款
    onRefund() {
      this.$modalRouter.push({
        name: 'sold-course-refund',
        props: {
          type: 'personal',
          id: this.personalInfo.id
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 修改教练
    onEditCoach() {
      this.$modalRouter.push({
        name: 'sold-course-coach',
        props: {
          record: this.personalInfo
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 重新激活
    onActivated() {
      this.$modalRouter.push({
        name: 'sold-course-activated',
        props: {
          type: 'personal',
          id: this.personalInfo.id
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 延长有效期
    onLease(record) {
      this.$modalRouter.push({
        name: 'sold-course-lease',
        props: {
          type: 'personal',
          id: this.personalInfo.id
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 对内备注
    onInternalNote() {
      this.internalNoteActions.onOpenModal({ id: this.infoService.id })
    },
    /**
     * 修改合同备注
     */
    onEditContractDescription() {
      const { order_id, description } = this.personalInfo
      this.contractActions.editDescription({
        order_id,
        description
      })
    }
  }
}
</script>
