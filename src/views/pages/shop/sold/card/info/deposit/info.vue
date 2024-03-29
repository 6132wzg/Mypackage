<template>
  <st-panel-layout :class="basic()">
    <st-panel title="储值卡详情">
      <div slot="actions">
        <st-btn-actions :options="btnOptions" />
      </div>
      <a-row :gutter="24">
        <a-col :span="9">
          <st-info>
            <st-info-item label="卡名">{{ info.card_name }}</st-info-item>
            <st-info-item label="类型">{{ info.type }}</st-info-item>
            <st-info-item label="初始额度">{{ info.init_amount }}</st-info-item>
            <st-info-item label="剩余额度">{{ info.now_amount }}</st-info-item>
            <st-info-item label="有效期" class="mg-b16">
              {{ moment(info.buy_time * 1000).format('YYYY-MM-DD HH:mm') }} 至
              {{ moment(info.end_time * 1000).format('YYYY-MM-DD HH:mm') }}
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
            <st-info-item label="当前状态" class="mg-b0">
              {{ info.is_valid | enumFilter('sold_common.card_status') }}
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
            <st-info-item
              label="转让手续费"
              v-if="info.is_transferable && info.transfer_unit"
            >
              {{ info.transfer_num
              }}{{
                info.transfer_unit | enumFilter('package_course.transfer_unit')
              }}
            </st-info-item>
            <st-info-item label="消费场馆">
              <template v-if="info.shop_range.id < 2">
                {{ info.shop_range.shop_name }}
              </template>
              <a-popover :title="info.shop_range.shop_name" v-else>
                <template slot="content">
                  <st-table
                    :columns="admissionColumns"
                    :dataSource="info.shop_range.shops"
                    :pagination="false"
                    key="id"
                    :class="basic('popover-content')"
                  ></st-table>
                </template>
                <a type="primary">
                  {{
                    info.shop_range.id
                      | enumFilter('sold_common.admission_range')
                  }}
                </a>
              </a-popover>
            </st-info-item>
            <st-info-item label="消费类目">
              <span v-for="(item, index) in info.consumer_type" :key="index">
                {{ item | enumFilter('deposit_card.consumer_type') }}
                <i v-if="index !== info.consumer_type.length - 1">、</i>
              </span>
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
import SoldCardRefund from '@/views/biz-modals/sold/card/refund'
import SoldCardTransfer from '@/views/biz-modals/sold/card/transfer'
import { admissionColumns } from '../info.config'
import useInternalNoteActions from '@/hooks/shop/sold-internal-note-actions.hook'
import contractActions from '@/hooks/contract.hook'
import soldDepositCardActions from '@/hooks/sold/deposit-card-actions.hook'
import { PrintService } from '@/services/print.service'
export default {
  name: 'PageShopSoldCardDepositInfo',
  bem: {
    basic: 'page-shop-sold-info'
  },
  modals: {
    SoldCardRefund,
    SoldCardTransfer
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
  hooks() {
    return {
      internalNoteActions: useInternalNoteActions(),
      contractActions: contractActions(this),
      soldDepositCardActions: soldDepositCardActions(this)
    }
  },
  computed: {
    // 门店范围
    admissionColumns,
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
    // 退款
    onRefund() {
      this.$modalRouter.push({
        name: 'sold-card-refund',
        props: {
          type: 'deposit',
          id: this.infoService.id
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 转让
    onTransfer() {
      this.$modalRouter.push({
        name: 'sold-card-transfer',
        props: {
          id: this.infoService.id,
          type: 'deposit'
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
      const { order_id, description } = this.info
      this.contractActions.editDescription({
        order_id,
        description
      })
    }
  }
}
</script>
