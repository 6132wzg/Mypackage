<template>
  <div :class="b()">
    <div :class="b('actions')">
      <div :class="b('actions-left')">
        <st-button
          v-if="auth.batchAdd && type !== 'record' && channel === 'manage'"
          type="primary"
          class="mg-r8"
          @click="onCabinetBatchAdd"
        >
          批量新增
        </st-button>
        <st-button
          v-if="auth.batchDel && type !== 'record' && channel === 'manage'"
          class="mg-r8"
          @click="onCabinetBatchDel"
          :disabled="isSelectedDisabled"
          :loading="loading.del"
        >
          批量删除
        </st-button>
        <st-button
          v-if="type === 'temporary' && channel === 'use'"
          class="mg-r8"
          type="primary"
          @click="onCabinetBatchClean"
          :disabled="isSelectedDisabled"
          :loading="loading.del"
        >
          批量清柜
        </st-button>
        <st-button
          v-if="type === 'long-term' && auth.batchPrice && channel === 'manage'"
          class="mg-r8"
          :disabled="isSelectedDisabled"
          @click="onCabinetBatchChangePrice"
        >
          批量改价
        </st-button>
      </div>
      <div :class="b('actions-right')" v-if="type !== 'record'">
        <a-select
          class="mg-r8"
          v-model="$searchQuery.battery"
          style="width: 140px"
          @change="refresh"
        >
          <a-select-option value="all">
            全部电量
          </a-select-option>
          <a-select-option value="low">
            低电量
          </a-select-option>
        </a-select>
        <a-select
          v-model="$searchQuery.cabinet_business_type"
          style="width: 140px"
          @change="refresh"
        >
          <a-select-option
            v-for="(item, index) in cabinetBusinessOption"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </div>
      <div :class="b('actions-right')" v-else>
        <a-range-picker
          :disabledDate="disabledDate"
          class="mg-r8"
          format="YYYY-MM-DD HH:mm"
          :showTime="{ formate: 'HH:mm' }"
          @ok="onDateOk"
        ></a-range-picker>
        <a-select
          v-model="$searchQuery.cabinet_type"
          style="width: 140px"
          class="mg-r8"
          @change="refresh"
        >
          <a-select-option
            v-for="(item, index) in cabinetTypeOption"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
        <a-select
          v-model="$searchQuery.action_type"
          style="width: 140px"
          class="mg-r8"
          @change="refresh"
        >
          <a-select-option
            v-for="(item, index) in actionTypeOption"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <div :class="b('list')" v-if="type !== 'record'">
      <st-table
        rowKey="id"
        :loading="loading"
        :alertSelection="{ onReset: onSelectionReset }"
        :rowSelection="{
          fixed: true,
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectionChange
        }"
        :dataSource="list"
        :page="page"
        :columns="columns"
        :scroll="{ x: 1200 }"
        @change="onTableChange"
      >
        <template slot="is_smart" slot-scope="text">
          {{ text === 1 ? '是' : '否' }}
        </template>
        <template slot="battery" slot-scope="text, record">
          <span
            :class="bBattrey({ active: !record.battery.status })"
            v-if="record.is_smart"
          >
            {{ record.battery.status ? '正常' : '低电压' }}({{
              record.battery.value
            }})
          </span>
          <span v-else>--</span>
        </template>
        <template slot="price" slot-scope="text, record">
          {{ record.price_num }}
        </template>
        <template slot="cabinet_business_type" slot-scope="text">
          <st-status :type="text"></st-status>
        </template>
        <div slot="action" slot-scope="text, record">
          <st-table-actions>
            <a
              @click="onCabinetEditInfo(record.id)"
              v-if="auth.edit && channel === 'manage'"
            >
              编辑
            </a>
            <a
              @click="onCabinetEditStatus(record)"
              v-if="auth.edit && channel === 'use'"
            >
              编辑
            </a>
            <a @click="onCabinetShowRecord(record.id)" v-if="channel === 'use'">
              使用记录
            </a>
            <a @click="onCabinetOpen(record)" v-if="channel === 'use'">
              远程开柜
            </a>
          </st-table-actions>
        </div>
      </st-table>
    </div>
    <div :class="b('list')" v-else>
      <st-table
        rowKey="id"
        :loading="loading"
        :dataSource="list"
        :columns="columns"
        :scroll="{ x: 1200 }"
        @change="onTableChange"
        :page="page"
      >
        <template slot="cabinet_type" slot-scope="text">
          {{ text | enumFilter('cabinet.cabinet_type') }}
        </template>
        <template slot="action_type" slot-scope="text">
          {{ text | enumFilter('cabinet.action_type') }}
        </template>
      </st-table>
    </div>
  </div>
</template>
<script>
import { ListService } from './list.service'
import { MessageService } from '@/services/message.service'
import tableMixin from '@/mixins/table.mixin'
import { CABINET, CABINET_BUSINESS_TYPE } from '@/constants/reception/cabinet'
import { Temporarycolumns, LongTermcolumns, Recordcolumns } from './list.config'
import StStatus from '@/views/biz-components/status/status'
import ShopCabinetEditPrice from '@/views/biz-modals/shop/cabinet/edit-price'
import ShopCabinetAddLongTerm from '@/views/biz-modals/shop/cabinet/add-long-term'
import ShopCabinetAddTemporary from '@/views/biz-modals/shop/cabinet/add-temporary'
import ShopCabinetEditLongTerm from '@/views/biz-modals/shop/cabinet/edit-long-term'
import ShopCabinetEditTemporary from '@/views/biz-modals/shop/cabinet/edit-temporary'
import ShopCabinetUseRecord from '@/views/biz-modals/shop/cabinet/use-record'
import ShopCabinetEditStatus from '@/views/biz-modals/shop/cabinet/edit-status'
import ShopCabinetOpen from '@/views/biz-modals/shop/cabinet/open'
import ShopCabinetBatch from '@/views/biz-modals/shop/cabinet/batch'
export default {
  bem: {
    b: 'st-cabinet-list',
    bBattrey: 'st-cabinet-list-battery-status'
  },
  mixins: [tableMixin],
  components: { StStatus },
  modals: {
    ShopCabinetEditPrice,
    ShopCabinetAddLongTerm,
    ShopCabinetAddTemporary,
    ShopCabinetEditLongTerm,
    ShopCabinetEditTemporary,
    ShopCabinetEditStatus,
    ShopCabinetUseRecord,
    ShopCabinetOpen,
    ShopCabinetBatch
  },
  serviceInject() {
    return {
      messageService: MessageService,
      cabinetService: ListService
    }
  },
  rxState() {
    const cabinetService = this.cabinetService
    return {
      auth: cabinetService.auth$,
      cabinetTypeOption: cabinetService.cabinetTypeOption$,
      cabinetBusinessOption: cabinetService.cabinetBusinessOption$,
      actionTypeOption: cabinetService.actionTypeOption$
    }
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    },
    page: {
      type: Object,
      default: () => {}
    },
    areaName: {
      type: String,
      default: ''
    },
    channel: {
      type: String,
      default: 'use'
    }
  },
  data() {
    return { CABINET_BUSINESS_TYPE }
  },
  computed: {
    Temporarycolumns,
    LongTermcolumns,
    Recordcolumns,
    columns() {
      const Map = {
        temporary: this.Temporarycolumns,
        'long-term': this.LongTermcolumns,
        record: this.Recordcolumns
      }
      return Map[this.type]
    },
    type() {
      return this.$searchQuery.type || 'temporary'
    }
  },
  methods: {
    onDateOk(date, str) {
      this.$searchQuery.date_start = date[0].format('YYYY-MM-DD HH:mm')
      this.$searchQuery.date_end = date[1].format('YYYY-MM-DD HH:mm')
      this.refresh()
    },
    disabledDate(current) {
      if (!current) return false
      return (
        moment().subtract(6, 'M') > current || moment().add(6, 'M') < current
      )
    },
    refresh() {
      this.onSelectionReset()
      this.$emit('refresh')
    },
    /**
     * 批量新增储物柜
     */
    onCabinetBatchAdd() {
      const { id, type } = this.$searchQuery
      const areaName = this.areaName
      if (!+id) {
        this.messageService.error({
          content: '请先新增区域'
        })
        return
      }
      this.$modalRouter.push({
        name: `shop-cabinet-add-${type}`,
        props: {
          id,
          type,
          areaName
        },
        on: {
          change: this.refresh
        }
      })
    },
    /**
     * 批量删除储物柜
     */
    onCabinetBatchDel() {
      // 判断是否有智能柜
      const flagText = this.onGetCabinetType()
      if (flagText === 'smart') {
        this.$error({
          title: '当前选中柜子有智能储物柜，若需删除，请联系三体工作人员',
          okText: '知道了'
        })
        return
      }
      // 判断是否有使用中的柜子
      if (flagText === 'using') {
        this.$error({
          title: '选择的储物柜正在使用中，无法删除',
          okText: '知道了'
        })
        return
      }
      this.$modalRouter.push({
        name: 'shop-cabinet-batch',
        props: {
          title: '批量删除储物柜',
          ids: this.selectedRowKeys,
          total: this.page.total_counts,
          useType: 'del',
          searchQuery: {
            cabinet_type: this.$searchQuery.type === 'temporary' ? 2 : 1,
            cabinet_area_id: this.$searchQuery.id,
            keywords: this.$searchQuery.keywords,
            battery: this.$searchQuery.battery,
            cabinet_business_type: this.$searchQuery.cabinet_business_type
          }
        },
        on: {
          success: this.refresh
        }
      })
    },
    /**
     * 批量清柜
     */
    onCabinetBatchClean() {
      let OfflineCabinetNum = this.getSmartOfflineNum()
      if (OfflineCabinetNum > 0) {
        this.messageService.error({
          content: '已离线的储物柜无法清柜，请重新选择'
        })
        return
      }
      this.$modalRouter.push({
        name: 'shop-cabinet-batch',
        props: {
          title: '批量清柜',
          ids: this.selectedRowKeys,
          total: this.page.total_counts,
          useType: 'clear',
          searchQuery: {
            cabinet_area_id: this.$searchQuery.id,
            cabinet_type: this.$searchQuery.type === 'temporary' ? 2 : 1,
            keywords: this.$searchQuery.keywords,
            battery: this.$searchQuery.battery,
            cabinet_business_type: this.$searchQuery.cabinet_business_type
          }
        },
        on: {
          success: this.refresh
        }
      })
    },
    /**
     * 批量改价
     */
    onCabinetBatchChangePrice() {
      this.$modalRouter.push({
        name: 'shop-cabinet-edit-price',
        props: {
          ids: this.selectedRowKeys,
          cabinet_area_id: this.$searchQuery.id,
          keywords: this.$searchQuery.keywords,
          battery: this.$searchQuery.battery,
          cabinet_type: this.$searchQuery.type === 'temporary' ? 2 : 1,
          cabinet_business_type: this.$searchQuery.cabinet_business_type,
          total: this.page.total_counts
        },
        on: {
          change: this.refresh
        }
      })
    },
    /**
     * 开启储物柜
     */
    onCabinetOpen(cabinet) {
      // 选择的柜子中有维修状态的智能柜
      this.$modalRouter.push({
        name: 'shop-cabinet-open',
        props: {
          id: cabinet.id,
          userName: cabinet.user_name,
          userMobile: cabinet.mobile
        },
        on: {
          success: this.refresh
        }
      })
    },
    /**
     * 修改储物柜信息
     */
    onCabinetEditInfo(id) {
      this.$modalRouter.push({
        name: `shop-cabinet-edit-${this.$searchQuery.type}`,
        props: {
          id,
          areaName: this.areaName
        },
        on: {
          change: this.refresh
        }
      })
    },
    /**
     * 修改储物柜状态
     */
    onCabinetEditStatus(record) {
      let cabinet = this.getCabinetUsingItem(record)
      let id = cabinet.id
      let useStatus = cabinet.cabinet_business_type
      this.$modalRouter.push({
        name: 'shop-cabinet-edit-status',
        props: {
          id,
          useStatus
        },
        on: {
          success: this.refresh
        }
      })
    },
    /**
     * 查看储物柜使用记录
     */
    onCabinetShowRecord(cabinet_id) {
      this.$modalRouter.push({
        name: 'shop-cabinet-use-record',
        props: {
          cabinet_id
        }
      })
    },
    /**
     * 获取储物柜类型
     */
    onGetCabinetType() {
      const type = this.$searchQuery.type
      for (let i = 0; i < this.selectedRows.length; i++) {
        const temp = this.selectedRows[i]
        if (temp.is_smart) {
          return 'smart'
        }
        // 使用中的柜子无法删除
        if (type === 'long-term' && temp.sale_status === 1) {
          return 'using'
        }
        // 损坏的柜子无法删除
        if (type === 'temporary' && temp.cabinet_business_type === 2) {
          return 'using'
        }
      }
      return 'none'
    },
    /**
     * 获取选中储物柜中离线的数量
     */
    getSmartOfflineNum() {
      const checkedOfflineCabinets = this.selectedRows.filter(
        item => item.is_smart && !item.is_online
      )
      return checkedOfflineCabinets.length
    },
    /**
     * 获取选中储物柜中已使用的数量
     */
    getUsingCabinetNum() {
      const checkedUsingCabinets = this.selectedRows.filter(
        item => item.cabinet_business_type === this.CABINET_BUSINESS_TYPE.USING
      )
      return checkedUsingCabinets.length
    },
    /**
     * 获取选中储物柜中已使用的数量
     */
    getSmartCabinetNum() {
      const checkedSmartCabinets = this.selectRows.filter(item => item.is_smart)
      return checkedSmartCabinets.length
    },
    getCabinetUsingItem(item) {
      if (this.type === 'long-term' && item.sale_status === 1) {
        item.cabinet_business_type = 2
      }
      return item
    }
  }
}
</script>
