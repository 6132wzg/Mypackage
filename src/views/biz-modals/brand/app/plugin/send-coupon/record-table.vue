<template>
  <st-modal
    :title="title"
    v-model="show"
    :footer="null"
    wrapClassName="scroll-modal"
  >
    <st-table
      rowKey="key"
      simplePage
      :loading="loading.getSendList"
      :dataSource="stList"
      :columns="columns"
      :scroll="{ y: 230 }"
      @change="onPageChange"
      :page="page"
    >
      <div slot="member_name" slot-scope="text, record">
        <span>{{ text }}</span>
        <st-icon
          v-if="record.is_minors"
          type="user-type"
          class="mg-l4"
          :color="record.sex === SEX.GIRL ? '#FF5E41' : '#3F66F6'"
        />
      </div>
    </st-table>
  </st-modal>
</template>
<script>
import { RecordTableService } from './record-table.service'
import tableMixin from '@/mixins/table.mixin'
import { SEX } from '@/constants/member/info'

const columns = () => {
  return [
    {
      title: '会员姓名',
      width: '30%',
      dataIndex: 'member_name',
      scopedSlots: { customRender: 'member_name' }
    },
    {
      title: '手机号',
      width: '40%',
      dataIndex: 'mobile'
    },
    {
      title: '是否使用',
      width: '30%',
      dataIndex: 'is_used'
    }
  ]
}
export default {
  name: 'ModalBrandAppPluginRecordTable',
  mixins: [tableMixin],
  serviceInject() {
    return {
      recordTableService: RecordTableService
    }
  },
  rxState() {
    return {
      loading: this.recordTableService.loading$,
      list: this.recordTableService.list$,
      page: this.recordTableService.page$
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
      SEX,
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
      this.recordTableService.getSendList({ ...query, id: this.id }).subscribe()
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
