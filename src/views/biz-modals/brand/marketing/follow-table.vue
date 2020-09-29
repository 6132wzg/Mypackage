<template>
  <st-modal
    :title="title"
    v-model="show"
    :footer="null"
    wrapClassName="scroll-modal"
  >
    <st-table
      rowKey="key"
      :loading="loading.getFollowList"
      :dataSource="stList"
      :columns="columns"
      :scroll="{ y: 230 }"
      @change="onPageChange"
      :page="page"
    />
  </st-modal>
</template>
<script>
import { FollowTableService } from './follow-table.service'
import tableMixin from '@/mixins/table.mixin'
const columns = () => {
  return [
    {
      title: '姓名',
      width: '25%',
      dataIndex: 'member_name'
    },
    {
      title: '手机号',
      width: '25%',
      dataIndex: 'mobile'
    },
    {
      title: '用户等级',
      width: '25%',
      dataIndex: 'member_level'
    },
    {
      title: '扫码时间',
      width: '25%',
      dataIndex: 'scan_code_time'
    }
  ]
}
export default {
  name: 'ModalBrandMarkingFollowTable',
  mixins: [tableMixin],
  serviceInject() {
    return {
      followTableService: FollowTableService
    }
  },
  rxState() {
    return {
      loading: this.followTableService.loading$,
      list: this.followTableService.list$,
      page: this.followTableService.page$
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
      this.followTableService
        .getFollowList({ ...query, activity_qrcode_id: this.id })
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
