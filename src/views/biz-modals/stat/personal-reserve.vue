<template>
  <st-modal
    :class="b()"
    wrapClassName="modal-stat-personal-reserve"
    :title="title"
    width="1150px"
    v-model="show"
    :loading="loading.getReserveList"
    :footer="false"
  >
    <st-table
      :rowKey="(record, idx) => idx"
      :scroll="{ x: 1450, y: 345 }"
      :columns="columns"
      :loading="loading.getReserveList"
      :dataSource="list"
      :pagination="{ simple: true }"
      :page="page"
      @change="onModalTableChange"
    >
      <span slot="sign_personal" slot-scope="text">
        {{ text || '--' }}
      </span>
    </st-table>
    <st-button
      style="position: absolute; bottom: 0; left: 0;"
      :disabled="!list.length"
      type="primary"
      v-if="authExport"
      v-export-excel="exportParams"
    >
      全部导出
    </st-button>
  </st-modal>
</template>
<script>
import { coachColumns, memberColumns } from './personal-reserve.config'
import tableMixin from '@/mixins/table.mixin'
import { PersonalService } from './personal-reserve.service'
export default {
  name: 'PersonalReserve',
  mixins: [tableMixin],
  bem: {
    b: 'modal-stat-personal-reserve'
  },
  serviceInject() {
    return {
      personalService: PersonalService
    }
  },
  rxState() {
    let { list$, page$, auth$, loading$ } = this.personalService
    return {
      list: list$,
      page: page$,
      auth: auth$,
      loading: loading$
    }
  },
  props: {
    query: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: String,
    type: String
  },
  data() {
    return {
      show: false,
      modalQuery: {
        current_page: 1,
        size: 10
      }
    }
  },
  computed: {
    columns() {
      return memberColumns(this) //this.type.includes('coach') ? coachColumns() : memberColumns()
    },
    authExport() {
      return this.auth[this.type]
    },
    exportParams() {
      const exportUrlMap = {
        'brand-personal-coach': 'brand/personal_coach/effective_reserve_export',
        'brand-personal-member': 'personal-member/brand/export-reserve',
        'shop-personal-coach': 'shop/personal_coach/effective_reserve_export',
        'shop-personal-member': 'personal-member/shop/export-reserve'
      }
      const type = exportUrlMap[this.type]
      return { type, query: this.query }
    },
    searchQuery() {
      return {
        ...this.query,
        ...this.modalQuery
      }
    }
  },
  methods: {
    getList() {
      this.personalService
        .getReserveList(this.searchQuery, this.type)
        .subscribe()
    },
    onModalTableChange(pagination, ...ret) {
      this.modalQuery = {
        ...this.modalQuery,
        ...this.getTableQuery(pagination, ...ret)
      }
      this.getList()
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
