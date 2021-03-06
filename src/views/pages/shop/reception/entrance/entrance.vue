<template>
  <div :class="entrance()">
    <portal to="SHOP_RECEPTION_ENTRANCE_KEYWORDS_SEARCH">
      <st-input-search
        v-model="$searchQuery.keyword"
        @search="onKeywordsSearch('keyword', $event)"
        placeholder="请输入姓名或手机号查找"
        maxlength="50"
      />
    </portal>
    <div :class="entrance('search')" class="mg-b16">
      <st-button
        type="primary"
        :disabled="!selectedRowKeys.length || !auth.batchCheckout"
        @click="onLeaveBatch"
      >
        批量离场
      </st-button>
      <div>
        <a-select
          style="width: 160px"
          v-model="$searchQuery.entry_type"
          @change="onSingleSearch('entry_type', $event)"
          :options="entryTypeList"
        ></a-select>
      </div>
    </div>
    <st-table
      :scroll="{ x: 800 }"
      :page="page"
      :alertSelection="{ onReset: onSelectionReset }"
      @change="onTableChange"
      :rowSelection="{ selectedRowKeys, onChange: onSelectionChange }"
      :loading="loading.getList"
      :columns="columns"
      :dataSource="list"
      rowKey="member_id"
    >
      <!-- 姓名 -->
      <template slot="member_name" slot-scope="text">
        {{ text }}
      </template>
      <!-- 手机号 -->
      <template slot="mobile" slot-scope="text">
        {{ text }}
      </template>
      <!-- 入场类型 -->
      <template slot="entry_type" slot-scope="text">
        {{ text }}
      </template>
      <!-- 入场时间 -->
      <template slot="entry_time" slot-scope="text, record">
        {{ record.entry_time
        }}{{ record.leave_time ? `&nbsp;~&nbsp;${record.leave_time}` : '' }}
      </template>
      <!-- 操作 -->
      <div slot="action" slot-scope="text, record">
        <st-table-actions>
          <a @click="onLeaveConfirm(record)" v-if="auth.checkout">离场</a>
        </st-table-actions>
      </div>
    </st-table>
  </div>
</template>
<script>
import { EntranceService } from './entrance.service'
import { columns } from './entrance.config.ts'
import tableMixin from '@/mixins/table.mixin'

export default {
  mixins: [tableMixin],
  name: 'PageShopReceptionEntrance',
  bem: {
    entrance: 'page-shop-reception-entrance'
  },
  serviceInject() {
    return {
      entranceService: EntranceService
    }
  },
  rxState() {
    return {
      auth: this.entranceService.auth$,
      entryTypeList: this.entranceService.entryTypeList$,
      list: this.entranceService.list$,
      page: this.entranceService.page$,
      loading: this.entranceService.loading$
    }
  },
  computed: {
    columns
  },
  methods: {
    // 离场之前的确认
    onLeaveConfirm(record) {
      this.entranceService.getCabinetInfo(record.member_id).subscribe(res => {
        if (res.info.is_smart) {
          this.$error({
            title: `当前会员有储物柜「${res.info.cabinet_area_name}」「${res.info.serial_num}」尚未归还，请先归还！`,
            okText: '知道了'
          })
        } else {
          this.onLeave(record)
        }
      })
    },
    // 离场
    onLeave(record) {
      this.$confirm({
        title: '离场',
        content: `确定离场吗？`,
        onOk: () => {
          return this.entranceService
            .setEntranceLeave(record.member_id)
            .toPromise()
            .then(() => {
              this.onSelectionReset()
              this.$router.reload()
            })
        }
      })
    },
    // 批量离场
    onLeaveBatch() {
      let ids = []
      this.selectedRows.forEach(i => {
        ids.push(i.member_id)
      })
      this.$confirm({
        title: '批量离场',
        content: `确定离场吗？`,
        onOk: () => {
          return this.entranceService
            .setEntranceLeaveBatch({
              ids
            })
            .toPromise()
            .then(() => {
              this.onSelectionReset()
              this.$router.reload()
            })
        }
      })
    }
  }
}
</script>
