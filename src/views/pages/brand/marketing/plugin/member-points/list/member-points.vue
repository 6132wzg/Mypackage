<template>
  <div :class="b()">
    <portal to="BRAND_PLUGIN_POINTS_MALL_SEARCH">
      <st-input-search
        v-model="$searchQuery.keyword"
        @search="onKeywordsSearch('keyword', $event)"
        placeholder="搜索会员姓名或手机号"
        style="width:400px"
      />
    </portal>
    <div :class="b('total')">
      <div :class="b('total-item')">
        <span class="label">积分总额</span>
        <i-count-up class="value" :endVal="+total$.total_points"></i-count-up>
      </div>
      <div :class="b('total-item')">
        <span class="label">已用积分</span>
        <i-count-up class="value" :endVal="+total$.used_points"></i-count-up>
      </div>
      <div :class="b('total-item')">
        <span class="label">过期积分</span>
        <i-count-up class="value" :endVal="+total$.expired_points"></i-count-up>
      </div>
      <div :class="b('total-item')">
        <span class="label">剩余积分</span>
        <i-count-up class="value" :endVal="+total$.remain_points"></i-count-up>
      </div>
    </div>
    <div :class="b('button')" class="mg-t24">
      <st-button
        type="primary"
        class="mg-r16"
        :disabled="buttonDisable"
        @click="addPointsByBatch"
        v-if="auth$.batch_add"
      >
        批量增加
      </st-button>
      <st-button
        @click="minusPointsByBatch"
        :disabled="buttonDisable"
        v-if="auth$.batch_reduce"
      >
        批量扣减
      </st-button>
    </div>
    <div :class="b('content')" class="mg-t16">
      <st-table
        :page="page$"
        rowKey="member_id"
        :columns="columns"
        @change="onTableChange"
        :rowSelection="{ selectedRowKeys, onChange: onSelectionChange }"
        :scroll="{ x: 860 }"
        :alertSelection="{ onReset: onSelectionReset }"
        :dataSource="list$"
      >
        <div slot="action" slot-scope="text, record">
          <st-table-actions>
            <a
              @click="addPoints(record)"
              v-if="record.auth['brand:activity:points|add']"
            >
              增加
            </a>
            <a
              @click="miusPoints(record)"
              v-if="record.auth['brand:activity:points|reduce']"
            >
              扣减
            </a>
            <a
              @click="showPoints(record)"
              v-if="record.auth['brand:activity:points|get_flow']"
            >
              查看
            </a>
          </st-table-actions>
        </div>
      </st-table>
    </div>
  </div>
</template>

<script>
import tableMixin from '@/mixins/table.mixin'

import { columns, totalColumns } from './member-points.config'
import { MemberPointsService } from './member-points.service'
import PointsAddOrMinus from '@/views/biz-modals/brand/marketing/points/add-or-minus'
export default {
  name: 'BrandPlaginPointsMall',
  bem: {
    b: 'brand-plagin-member-points-member-points'
  },
  modals: {
    PointsAddOrMinus
  },
  serviceInject() {
    return {
      service: MemberPointsService
    }
  },
  rxState() {
    let { total$, list$, page$, auth$ } = this.service
    return {
      total$,
      list$,
      page$,
      auth$
    }
  },
  mixins: [tableMixin],
  computed: {
    columns,
    totalColumns,
    buttonDisable() {
      return !this.selectedRowKeys.length
    }
  },
  methods: {
    onClear() {
      console.log('onClear')
    },
    onSuccess() {
      this.selectedRowKeys = []
      this.$router.reload()
    },
    addPoints(record) {
      this.$modalRouter.push({
        name: 'points-add-or-minus',
        props: {
          type: 'add',
          query: {
            memberName: record.member_name,
            memberId: record.member_id
          }
        },
        on: {
          done: this.onSuccess
        }
      })
    },
    miusPoints(record) {
      this.$modalRouter.push({
        name: 'points-add-or-minus',
        props: {
          type: 'minus',
          query: {
            memberName: record.member_name,
            memberId: record.member_id
          }
        },
        on: {
          done: this.onSuccess
        }
      })
    },
    addPointsByBatch() {
      const ids = this.selectedRowKeys
      this.$modalRouter.push({
        name: 'points-add-or-minus',
        props: {
          type: 'add-by-batch',
          query: {
            member_ids: ids
          }
        },
        on: {
          done: this.onSuccess
        }
      })
    },
    minusPointsByBatch() {
      const ids = this.selectedRowKeys
      this.$modalRouter.push({
        name: 'points-add-or-minus',
        props: {
          type: 'minus-by-batch',
          query: {
            member_ids: ids
          }
        },
        on: {
          done: this.onSuccess
        }
      })
    },
    showPoints(record) {
      this.$router.push({
        name: 'brand-marketing-plugin-member-points-list-flow-record',
        query: {
          keyword: record.member_name
        }
      })
    }
  }
}
</script>

<style></style>
