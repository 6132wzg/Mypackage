<template>
  <st-panel-layout :class="basic()">
    <st-panel
      :title="
        `课程包详情(${packageInfo.effective_state ? '已生效' : '未生效'})`
      "
    >
      <div slot="actions">
        <st-btn-actions :options="btnOptions" />
      </div>
      <a-row :gutter="24">
        <a-col :span="9">
          <st-info>
            <st-info-item label="课程名称">
              {{ packageInfo.course_name }}
            </st-info-item>
            <st-info-item label="类型">{{ packageInfo.type }}</st-info-item>
            <st-info-item label="剩余课时">
              <span
                v-if="
                  packageInfo.is_limit === IS_LIMIT.NO_LIMIT &&
                    packageInfo.package_type === PACKAGE_TYPE.RANGE_COURSE
                "
              >
                不限次
              </span>
              <span v-else-if="packageInfo.total_times_remain">
                私教课&团体课共{{ packageInfo.total_times_remain }}节
              </span>
              <span v-else>
                {{ packageInfo.personal_course_remain }}节私教课,{{
                  packageInfo.team_course_remain
                }}节团体课
              </span>
            </st-info-item>
            <st-info-item v-if="packageInfo.effective_state" label="有效期">
              {{
                moment(packageInfo.course_buy_time * 1000).format(
                  'YYYY-MM-DD HH:mm'
                )
              }}
              至
              {{
                moment(packageInfo.course_end_time * 1000).format(
                  'YYYY-MM-DD HH:mm'
                )
              }}
            </st-info-item>
            <st-info-item label="合同编号" class="mg-b16">
              {{ packageInfo.contract_number }}
            </st-info-item>
            <st-info-item label="约课限制">
              {{ packageInfo.reserve_limit }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="9">
          <st-info>
            <st-info-item label="所属会员">
              {{ packageInfo.member_name }}
            </st-info-item>
            <st-info-item
              :label="packageInfo.is_minors ? '家长手机号' : '手机号'"
            >
              <span v-if="packageInfo.is_minors">
                {{ packageInfo.parent_mobile }}({{
                  packageInfo.parent_user_role
                }})
              </span>
              <span v-else>{{ packageInfo.mobile }}</span>
            </st-info-item>
            <st-info-item label="订单号">
              {{ packageInfo.order_id }}
            </st-info-item>
            <st-info-item label="订单状态">
              {{
                packageInfo.order_status
                  | enumFilter('sold_common.order_status')
              }}
            </st-info-item>
            <st-info-item label="成员">
              <st-overflow-text
                :value="packageInfo.members"
                max-width="120px"
              ></st-overflow-text>
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="6">
          <st-info>
            <st-info-item label="允许转让">
              {{
                packageInfo.is_transferable
                  | enumFilter('sold_common.is_transferable')
              }}
            </st-info-item>
            <st-info-item
              label="转让手续费"
              v-if="packageInfo.is_transferable !== 0"
            >
              {{ packageInfo.transfer_num
              }}{{
                packageInfo.transfer_unit
                  | enumFilter('package_course.transfer_unit')
              }}
            </st-info-item>
            <st-info-item label="当前状态">
              {{
                packageInfo.course_status
                  | enumFilter('sold_common.course_status')
              }}
            </st-info-item>
            <st-info-item label="上课范围">
              <a-popover :title="packageInfo.course_range.range_name">
                <template slot="content">
                  <st-table
                    v-if="rangeType === 1"
                    :columns="courseColumns"
                    :dataSource="courseTabData"
                    :pagination="false"
                    :class="basic('popover-content')"
                  >
                    <template slot="support_shop" slot-scope="text">
                      <st-overflow-text :value="text" max-width="100px" />
                    </template>
                  </st-table>
                  <st-table
                    v-if="rangeType === 2"
                    :columns="rangeColumns"
                    pageMode="client"
                    size="small"
                    simplePage
                    :dataSource="courseTabData"
                    :class="basic('popover-content')"
                  ></st-table>
                  <st-table
                    v-if="rangeType === 3"
                    :columns="courseColumns"
                    :dataSource="courseTabData"
                    :pagination="false"
                    :class="basic('popover-content')"
                  >
                    <st-table
                      slot="expandedRowRender"
                      slot-scope="text, index"
                      :columns="innerColumnsFix"
                      :dataSource="
                        index === 1 ? innerDataFixPersonal : innerDataFixTeam
                      "
                      :pagination="false"
                    ></st-table>
                  </st-table>
                </template>
                <a type="primary">{{ packageInfo.course_range.range_name }}</a>
              </a-popover>
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="24">
          <st-info>
            <st-info-item label="备注" class="mg-b0">
              {{ packageInfo.description || '无' }}
            </st-info-item>
          </st-info>
        </a-col>
      </a-row>
    </st-panel>
    <st-panel app class="mg-t12" :tabs="authTabs">
      <!-- TODO: 消费记录尚未实现 -->
      <!-- {
          label: '消费记录',
          route: {
            name: 'shop-sold-course-info-package-info-consumption-record',
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
import SoldCoursePackageUpgrade from '@/views/biz-modals/sold/course/package/upgrade'
import SoldCourseFreeze from '@/views/biz-modals/sold/course/freeze'
import SoldCourseRefund from '@/views/biz-modals/sold/course/refund'
import SoldCourseSurplus from '@/views/biz-modals/sold/course/surplus'
import SoldCourseTransfer from '@/views/biz-modals/sold/course/transfer'
import SoldCourseValid from '@/views/biz-modals/sold/course/valid'
import SoldCoursePackageUpdateExpirationDate from '@/views/biz-modals/sold/course/package/update-expiration-date'
import SoldCoursePackageDeduction from '@/views/biz-modals/sold/course/package/deduction'
import SoldCoursePackageMembeChange from '@/views/biz-modals/sold/course/package/member-change'
import DealGathering from '@/views/biz-modals/sold/deal/gathering'
import SoldCoursePackageUpdateRights from '@/views/biz-modals/sold/course/package/update-rights'
import { PACKAGE_TYPE, IS_LIMIT } from '@/constants/sold/package'
import useInternalNoteActions from '@/hooks/shop/sold-internal-note-actions.hook'
import contractActions from '@/hooks/contract.hook'
import { PrintService } from '@/services/print.service'
export default {
  name: 'PageShopSoldCoursePackageInfo',
  bem: {
    basic: 'page-shop-sold-info'
  },
  modals: {
    SoldCourseFreeze,
    SoldCourseRefund,
    SoldCourseSurplus,
    SoldCourseValid,
    DealGathering,
    SoldCoursePackageDeduction,
    SoldCoursePackageUpdateExpirationDate,
    SoldCoursePackageMembeChange,
    SoldCoursePackageUpgrade,
    SoldCourseTransfer,
    SoldCoursePackageUpdateRights
  },
  data() {
    return {
      PACKAGE_TYPE,
      IS_LIMIT
    }
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
      contractActions: contractActions(this)
    }
  },
  rxState() {
    return {
      packageInfo: this.infoService.packageInfo$,
      authTabs: this.infoService.authTabs$,
      auth: this.infoService.auth$
    }
  },
  computed: {
    btnOptions,
    rangeType() {
      return this.packageInfo.course_range
        ? this.packageInfo.course_range.range_type
        : 1
    },
    rangeColumns() {
      return [
        {
          title: '课程类型',
          dataIndex: 'course_type_name',
          key: 'course_type_name'
        },
        {
          title: '课程名称',
          dataIndex: 'course_name',
          key: 'course_name',
          width: '120px'
        },
        {
          title: '每次预约扣除次数',
          dataIndex: 'course_weights',
          key: 'course_weights'
        },
        { title: '上课门店', dataIndex: 'support_shop', key: 'support_shop' }
      ]
    },
    courseColumns() {
      const list = [
        { title: '课程类型', dataIndex: 'course_name', key: 'course_name' },
        {
          title: '上课门店',
          dataIndex: 'support_shop',
          key: 'support_shop',
          width: '120px',
          scopedSlots: { customRender: 'support_shop' }
        },
        { title: '节数', dataIndex: 'course_num', key: 'course_num' },
        { title: '课时费', dataIndex: 'course_price', key: 'course_price' },
        { title: '小计', dataIndex: 'pay_amount', key: 'pay_amount' }
      ]
      if (this.rangeType === 3) {
        list.splice(3, 1)
      }
      if (this.packageInfo.package_type !== PACKAGE_TYPE.ALL_COURSE) {
        if (this.packageInfo.is_limit === IS_LIMIT.NO_LIMIT) {
          list.splice(2, 1)
          list.splice(3, 1)
        }
        list.splice(1, 1)
      }
      return list
    },
    courseTabData() {
      let data = []
      const team = this.packageInfo.course_range
        ? this.packageInfo.course_range.team
        : {}
      const personal = this.packageInfo.course_range
        ? this.packageInfo.course_range.personal
        : {}
      let support_shop = ''
      if (team.support_shop) {
        support_shop = team.support_shop
      }
      if (personal.support_shop) {
        support_shop = personal.support_shop
      }
      if (team.course_name) {
        data.push({
          key: 0,
          support_shop,
          course_name: team.course_name,
          course_num: team.course_num,
          course_price: team.course_price,
          pay_amount: team.pay_amount
        })
      }

      if (personal.course_name) {
        data.push({
          key: 1,
          support_shop,
          course_name: personal.course_name,
          course_num: personal.course_num,
          course_price: personal.course_price,
          pay_amount: personal.pay_amount
        })
      }
      if (this.packageInfo.course_range.range_type === 2) {
        data = this.packageInfo.course_range.courses
      }
      return data
    },
    // 范围内课程团体课
    innerColumnsTeam() {
      const list = [
        {
          title: '课程名称',
          dataIndex: 'course_name',
          key: 'course_name',
          scopedSlots: { customRender: 'course_name' },
          width: '120px'
        },
        {
          title: '上课门店',
          dataIndex: 'support_shop',
          key: 'support_shop',
          width: '120px',
          scopedSlots: { customRender: 'support_shop' }
        }
      ]
      return list
    },
    innerDataTeam() {
      return this.packageInfo.course_range.team.courses
    },
    // 范围内课程私教课
    innerColumnsPersonal() {
      const list = [
        {
          title: '课程名称',
          dataIndex: 'course_name',
          key: 'course_name',
          width: '120px',
          scopedSlots: { customRender: 'course_name' }
        },
        {
          title: '上课门店',
          dataIndex: 'support_shop',
          key: 'support_shop',
          width: '120px',
          scopedSlots: { customRender: 'support_shop' }
        },
        {
          title: `${this.$c('coach')}等级`,
          dataIndex: 'levels',
          key: 'levels',
          scopedSlots: { customRender: 'levels' }
        }
      ]
      return list
    },
    innerDataPersonal() {
      const innerData = []
      for (
        let i = 0;
        i < this.packageInfo.course_range.personal.courses.length;
        i++
      ) {
        innerData.push({
          key: i,
          support_shop: this.packageInfo.course_range.personal.courses[i]
            .support_shop,
          course_name: this.packageInfo.course_range.personal.courses[i]
            .course_name,
          levels: this.packageInfo.course_range.personal.courses[i].levels.join(
            ','
          )
        })
      }
      return innerData
    },
    // 固定课程
    innerColumnsFix() {
      const list = [
        { title: '课程名称', dataIndex: 'course_name', key: 'course_name' },
        {
          title: '上课门店',
          dataIndex: 'support_shop',
          key: 'support_shop',
          scopedSlots: { customRender: 'support_shop' }
        },
        { title: '节数', dataIndex: 'course_num_init', key: 'course_num_init' },
        { title: '课时费', dataIndex: 'course_price', key: 'course_price' },
        { title: '总价', dataIndex: 'course_amount', key: 'course_amount' }
      ]
      return list
    },
    innerDataFixPersonal() {
      const innerData = []
      for (
        let i = 0;
        i < this.packageInfo.course_range.personal.courses.length;
        i++
      ) {
        innerData.push({
          key: i,
          course_name: this.packageInfo.course_range.personal.courses[i]
            .course_name,
          support_shop: this.packageInfo.course_range.personal.courses[i]
            .support_shop,
          course_num_init: this.packageInfo.course_range.personal.courses[i]
            .course_num_init,
          course_price: this.packageInfo.course_range.personal.courses[i]
            .course_price,
          course_amount: this.packageInfo.course_range.personal.courses[i]
            .course_amount,
          levels: this.packageInfo.course_range.personal.courses[i].levels.join(
            ','
          )
        })
      }
      return this.packageInfo.course_range.personal.courses
    },
    innerDataFixTeam() {
      const innerData = []
      for (
        let i = 0;
        i < this.packageInfo.course_range.team.courses.length;
        i++
      ) {
        innerData.push({
          key: i,
          course_name: this.packageInfo.course_range.team.courses[i]
            .course_name,
          support_shop: this.packageInfo.course_range.team.courses[i]
            .support_shop,
          course_num_init: this.packageInfo.course_range.team.courses[i]
            .course_num_init,
          course_price: this.packageInfo.course_range.team.courses[i]
            .course_price,
          course_amount: this.packageInfo.course_range.team.courses[i]
            .course_amount
        })
      }
      return innerData
    }
  },
  methods: {
    moment,
    onEditDate() {
      let id = this.packageInfo.id
      this.$modalRouter.push({
        name: 'sold-course-package-update-expiration-date',
        props: {
          id
        },
        on: {
          success: () => {
            // this.successTip()
          }
        }
      })
    },
    onMemberChange() {
      let id = this.packageInfo.id
      this.$modalRouter.push({
        name: 'sold-course-package-membe-change',
        props: {
          id
        },
        on: {
          success: () => {
            // this.successTip()
          }
        }
      })
    },
    onReduceTimes() {
      let id = this.packageInfo.id
      this.$modalRouter.push({
        name: 'sold-course-package-deduction',
        props: {
          id
        },
        on: {
          success: () => {
            this.successTip()
          }
        }
      })
    },

    // 修改剩余课时
    onSurplus() {
      // 后端返回的时间戳
      const time = this.packageInfo.effective_state
        ? `${moment(this.packageInfo.course_buy_time * 1000).format(
            'YYYY-MM-DD HH:mm'
          )} 至 ${moment(this.packageInfo.course_end_time * 1000).format(
            'YYYY-MM-DD HH:mm'
          )}`
        : '--'
      let data = {
        id: this.infoService.id,
        courseName: this.packageInfo.course_name,
        time
      }
      this.$modalRouter.push({
        name: 'sold-course-surplus',
        props: {
          courseType: 'coursePackage',
          courseData: data
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
      let record = this.packageInfo
      let url = `${window.location.origin}/common/contract-preview?id=${record.order_id}`
      window.open(url)
    },
    onUpgrade() {
      let id = this.packageInfo.id
      this.$modalRouter.push({
        name: 'sold-course-package-upgrade',
        props: {
          id
        },
        on: {
          success: res => {
            if (res.type === 'create') {
              // 创建订单成功
              this.$router.reload()
              this.onClear()
            } else if (res.type === 'createPay') {
              // 创建订单成功 并且到支付页面
              this.$modalRouter.push({
                name: 'deal-gathering',
                props: {
                  order_id: res.orderId,
                  type: 'package'
                },
                on: {
                  success: () => {
                    this.$router.reload()
                    this.onClear()
                  }
                }
              })
            }
          }
        }
      })
    },
    // 冻结
    onFreeze() {
      this.$modalRouter.push({
        name: 'sold-course-freeze',
        props: {
          type: 'package',
          id: this.infoService.id,
          courseName: this.packageInfo.course_name,
          courseNum: this.packageInfo.remain_course_num,
          courseEndTime: moment(this.packageInfo.course_end_time * 1000),
          time: `${moment(this.packageInfo.course_buy_time * 1000).format(
            'YYYY-MM-DD HH:mm'
          )} 至 ${moment(this.packageInfo.course_end_time * 1000).format(
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
          type: 'package',
          id: this.infoService.id
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    onValid() {
      this.$modalRouter.push({
        name: 'sold-course-valid',
        props: {
          info: this.packageInfo
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
          id: this.infoService.id,
          type: 'package'
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
      const { order_id, description } = this.packageInfo
      this.contractActions.editDescription({
        order_id,
        description
      })
    },
    updateRight() {
      const { id } = this.packageInfo
      this.$modalRouter.push({
        name: 'sold-course-package-update-rights',
        props: {
          id
        }
      })
    }
  }
}
</script>
