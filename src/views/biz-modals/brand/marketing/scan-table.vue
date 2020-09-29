<template>
  <st-modal
    :title="title"
    v-model="show"
    :footer="null"
    wrapClassName="scroll-modal"
  >
    <st-table
      rowKey="key"
      :loading="loading.getScanList"
      :dataSource="stList"
      :columns="columns"
      :scroll="{ y: 230 }"
      @change="onPageChange"
      :page="page"
    />
  </st-modal>
</template>
<script>
import { ScanTableService } from './scan-table.service'
import tableMixin from '@/mixins/table.mixin'
const columns = () => {
  return [
    {
      title: '姓名',
      width: '30%',
      dataIndex: 'member_name'
    },
    {
      title: '页面',
      width: '40%',
      dataIndex: 'product_name'
    },
    {
      title: '扫码时间',
      width: '30%',
      dataIndex: 'scan_code_time'
    }
  ]
}
export default {
  name: 'ModalBrandMarkingScanTable',
  mixins: [tableMixin],
  serviceInject() {
    return {
      scanTableService: ScanTableService
    }
  },
  rxState() {
    return {
      loading: this.scanTableService.loading$,
      list: this.scanTableService.list$,
      page: this.scanTableService.page$
    }
  },
  computed: {
    stList() {
      let array = []
      this.list.forEach(o => {
        let key = parseInt(Math.random() * 999999).toString()
        array.push({ ...o, key })
      })
      return array
    },
    columns
  },
  props: ['id', 'title'],
  data() {
    return {
      show: false
    }
  },
  created() {
    this.getList({
      size: 20,
      current_page: 1
    })
  },
  methods: {
    getList(query) {
      this.scanTableService
        .getScanList({ ...query, activity_qrcode_id: this.id })
        .subscribe()
    },
    onPageChange(data) {
      this.getList({
        size: data.pageSize,
        current_page: data.current
      })
    }
  }
}
</script>
