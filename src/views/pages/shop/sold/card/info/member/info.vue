<template>
  <st-panel-layout :class="basic()">
    <st-panel :title="`${$c('member_card')}详情`">
      <div slot="actions">
        <st-btn-actions :options="btnOptions" />
      </div>
      <a-row :gutter="24">
        <a-col :span="9">
          <st-info>
            <st-info-item label="卡名">{{ info.card_name }}</st-info-item>
            <st-info-item label="类型">
              {{ info.card_type | enumFilter('sold_common.card_type') }}
            </st-info-item>
            <st-info-item label="初始额度">{{ info.init_amount }}</st-info-item>
            <st-info-item label="剩余额度">
              {{ info.remain_amount }}
            </st-info-item>
            <st-info-item label="有效期" class="mg-b16">
              {{ info.start_time }} 至 {{ info.end_time }}
            </st-info-item>
            <st-info-item label="合同编号" class="mg-b0">
              {{ info.contract_number }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="9">
          <st-info>
            <st-info-item label="所属会员">{{ info.member_name }}</st-info-item>
            <st-info-item label="手机号">{{ info.mobile }}</st-info-item>
            <st-info-item label="订单号">{{ info.order_id }}</st-info-item>
            <st-info-item label="订单状态">
              {{ info.order_status | enumFilter('sold_common.order_status') }}
            </st-info-item>
            <st-info-item label="当前状态">
              {{ info.card_status | enumFilter('sold_common.card_status') }}
            </st-info-item>
            <st-info-item label="入场时段">
              <template v-if="info && info.admission_time.type < 2">
                {{ info.admission_time.name }}
              </template>
              <a-popover :title="info.admission_time.name" v-else>
                <template slot="content">
                  <st-table
                    :columns="enterTimeColumns"
                    :dataSource="info.admission_time.list"
                    :pagination="false"
                    key="id"
                    :class="basic('popover-content')"
                  ></st-table>
                </template>
                <a type="primary">
                  {{ info.admission_time.name }}
                </a>
              </a-popover>
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="6">
          <st-info>
            <st-info-item label="允许转让">
              {{
                info.is_transferable | enumFilter('sold_common.is_transferable')
              }}
            </st-info-item>
            <st-info-item label="转让手续费" v-if="info.is_transferable !== 0">
              {{ info.transfer_num
              }}{{
                info.transfer_unit | enumFilter('package_course.transfer_unit')
              }}
            </st-info-item>
            <st-info-item label="入场场馆">
              <template v-if="info.admission_range.id < 2">
                {{ info.admission_range.shop_name }}
              </template>
              <a-popover :title="info.admission_range.shop_name" v-else>
                <template slot="content">
                  <st-table
                    :columns="admissionColumns"
                    :dataSource="info.admission_range.shops"
                    :pagination="false"
                    key="id"
                    :class="basic('popover-content')"
                  ></st-table>
                </template>
                <a type="primary">
                  {{
                    info.admission_range.id
                      | enumFilter('sold_common.admission_range')
                  }}
                </a>
              </a-popover>
            </st-info-item>
            <st-info-item label="约课范围">
              <template v-if="info.course_interests.id < 2">
                {{ info.course_interests.name }}
              </template>
              <a-popover :title="info.course_interests.name" v-else>
                <template slot="content">
                  <st-table
                    :columns="courseColumns"
                    :dataSource="info.course_interests.courses"
                    :pagination="false"
                    key="id"
                    :class="basic('popover-content')"
                  ></st-table>
                </template>
                <a type="primary">
                  {{
                    info.course_interests.id
                      | enumFilter('sold_common.course_interests')
                  }}
                </a>
              </a-popover>
            </st-info-item>
            <st-info-item
              v-if="info && info.card_number_type === 2"
              label="卡成员"
            >
              <template v-if="info.card_member.length === 0">
                无
              </template>
              <template v-else>
                <router-link
                  :to="{
                    path: '/shop/member/info/basic',
                    query: {
                      id: item.id
                    }
                  }"
                  v-for="(item, index) in info.card_member"
                  :key="index"
                >
                  {{ item.name }}
                </router-link>
              </template>
            </st-info-item>
            <st-info-item label="备注" class="mg-b0">
              {{ info.description }}
            </st-info-item>
          </st-info>
        </a-col>
      </a-row>
    </st-panel>
    <st-panel app class="mg-t16" :tabs="authTabs">
      <router-view></router-view>
    </st-panel>
  </st-panel-layout>
</template>
<script>
import { InfoService } from './info.service'
import { btnOptions } from './info.config'
import moment from 'moment'
import SoldCardArea from '@/views/biz-modals/sold/card/area'
import SoldCardFreeze from '@/views/biz-modals/sold/card/freeze'
import SoldCardRefund from '@/views/biz-modals/sold/card/refund'
import SoldCardSetTime from '@/views/biz-modals/sold/card/set-time'
import SoldCardTransfer from '@/views/biz-modals/sold/card/transfer'
import SoldCardMemberReactive from '@/views/biz-modals/sold/card/member/reactive'
import {
  admissionColumns,
  courseColumns,
  enterTimeColumns
} from '../info.config'
import useCardActions from '@/hooks/card-actions.hook'
import useInternalNoteActions from '@/hooks/shop/sold-internal-note-actions.hook'
import contractActions from '@/hooks/contract.hook'
import soldMemberCardActions from '@/hooks/sold/member-card-actions.hook'
import { PrintService } from '@/services/print.service'
export default {
  name: 'PageShopSoldCardMemberInfo',
  bem: {
    basic: 'page-shop-sold-info'
  },
  modals: {
    SoldCardArea,
    SoldCardFreeze,
    SoldCardRefund,
    SoldCardSetTime,
    SoldCardTransfer,
    SoldCardMemberReactive
  },
  serviceInject() {
    return {
      infoService: InfoService,
      printService: PrintService
    }
  },
  rxState() {
    return {
      info: this.infoService.info$,
      loading: this.infoService.loading$,
      authTabs: this.infoService.authTabs$,
      auth: this.infoService.auth$
    }
  },
  beforeCreate() {
    this.cardActions.$on('refresh', val => {
      this.$router.reload()
    })
  },
  hooks() {
    return {
      cardActions: useCardActions(),
      internalNoteActions: useInternalNoteActions(),
      contractActions: contractActions(this),
      soldMemberCardActions: soldMemberCardActions(this)
    }
  },
  computed: {
    // 门店范围
    admissionColumns,
    // 授课范围
    courseColumns,
    enterTimeColumns,
    btnOptions
  },
  methods: {
    moment,
    // 跳转合同
    toContract() {
      let record = this.info
      let url = `${window.location.origin}/common/contract-preview?id=${record.order_id}`
      window.open(url)
    },
    // 冻结
    onFreeze() {
      this.$modalRouter.push({
        name: 'sold-card-freeze',
        props: {
          id: this.infoService.id
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
    // 重新激活
    onReactive() {
      this.$modalRouter.push({
        name: 'sold-card-member-reactive',
        props: {
          id: this.infoService.id
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 取消冻结
    onUnfreeze(record) {
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
    // 续卡
    onRenewal() {
      this.cardActions.onRenewal({
        id: this.infoService.id
      })
    },
    // 升级
    onUpgrade() {
      this.cardActions.upgradeCard({
        id: this.infoService.id
      })
    },
    // 变更成员
    onChangeMember() {
      this.cardActions.onChangeMember({
        id: this.infoService.id
      })
    },
    // 转让
    onTransfer() {
      this.$modalRouter.push({
        name: 'sold-card-transfer',
        props: {
          id: this.infoService.id,
          type: 'member'
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
        name: 'sold-card-refund',
        props: {
          type: 'member',
          id: this.infoService.id
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 修改有效时间
    onSetTime() {
      this.$modalRouter.push({
        name: 'sold-card-set-time',
        props: {
          id: this.infoService.id
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 变更vip入场区域
    onArea() {
      this.$modalRouter.push({
        name: 'sold-card-area',
        props: {
          id: [this.infoService.id]
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    /**
     * 修改合同备注
     */
    onEditContractDescription() {
      const { order_id, description } = this.info
      this.contractActions.editDescription({
        order_id,
        description
      })
    }
  }
}
</script>
