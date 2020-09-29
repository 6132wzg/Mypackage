<template>
  <st-modal
    :class="b()"
    wrapClassName="modal-stat-team-reserve"
    :title="title"
    width="1070px"
    v-model="show"
    :loading="loading.getReserveList"
    :footer="false"
  >
    <st-table
      rowKey="id"
      :scroll="{ y: 345 }"
      :loading="loading.getReserveList"
      :columns="columns"
      :dataSource="list"
      :page="page"
      :stripe="false"
      :expandedRowKeys="expendKeys"
      @change="onModalTableChange"
      @expand="expandChange"
    >
      <!-- <span slot="course_time" slot-scope="text">
        {{ moment(text).format('YYYY-MM-DD hh:mm:ss') }}
      </span> -->
      <span slot="remarks" slot-scope="text">
        <st-overflow-text
          :value="text || '--'"
          maxWidth="96px"
        ></st-overflow-text>
      </span>
      <div slot="expandedRowRender" slot-scope="record">
        <st-table
          :rowKey="(record, idx) => idx"
          :scroll="{ x: 960 }"
          :columns="childColumns"
          :dataSource="childListMap[record.id].list"
          :pagination="{ simple: true }"
          :stripe="false"
          emptyText="暂无数据"
        ></st-table>
      </div>
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
import { columns, childColumns } from './team-reserve.config'
import tableMixin from '@/mixins/table.mixin'
import { TeamlService } from './team-reserve.service'
import moment from 'moment'

export default {
  name: 'TeamReserve',
  mixins: [tableMixin],
  bem: {
    b: 'modal-stat-team-reserve'
  },
  components: {},
  serviceInject() {
    return {
      service: TeamlService
    }
  },
  rxState() {
    let {
      list$,
      page$,
      childListMap$,
      expendKeys$,
      auth$,
      loading$
    } = this.service
    return {
      list: list$,
      page: page$,
      childListMap: childListMap$,
      expendKeys: expendKeys$,
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
      },
      emptyRender: '暂无数据'
    }
  },
  computed: {
    columns,
    childColumns,
    authExport() {
      return this.auth[this.type]
    },
    exportParams() {
      const exportUrlMap = {
        'brand-team-coach': 'brand/team_coach/effective_reserve_export',
        'shop-team-coach': 'shop/team_coach/effective_reserve_export',
        'brand-team-course': 'brand/team_course/effective_reserve_export',
        'shop-team-course': 'shop/team_course/effective_reserve_export'
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
    moment,
    getList() {
      this.service.getReserveList(this.searchQuery, this.type).subscribe()
    },
    onModalTableChange(pagination, ...ret) {
      this.modalQuery = {
        ...this.modalQuery,
        ...this.getTableQuery(pagination, ...ret)
      }
      this.getList()
    },
    expandChange(isExpend, record) {
      !isExpend
        ? this.service.DEL_EXPENDKEY(record.id.toString())
        : this.service.ADD_EXPENDKEY(record.id.toString())
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
