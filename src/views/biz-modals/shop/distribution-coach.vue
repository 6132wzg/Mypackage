<template>
  <st-modal
    :title="`分配${$c('coach')}`"
    @ok="save"
    v-model="show"
    size="small"
  >
    <a-row :gutter="8">
      <a-col :lg="24" style="padding: 0;">
        <a-input-search
          size="large"
          :placeholder="`搜索${$c('coach')}昵称`"
          style="width: 100%;"
          @search="onSearch"
        />
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :lg="24" class="distribution-container">
        <st-table
          :rowSelection="{
            columnTitle: '分配',
            type: 'radio',
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange
          }"
          :columns="columns"
          :dataSource="list"
          rowKey="id"
          @change="handleTableChange"
          :pagination="false"
        >
          <template slot="custom_title">
            私教消课数（近30天）
            <st-help-tooltip id="TSYHFP002" />
          </template>
        </st-table>
      </a-col>
    </a-row>
  </st-modal>
</template>
<script>
import { DistributionCoachService } from './distribution-coach.service'
import { MessageService } from '@/services/message.service'
const columns = vm => [
  {
    title: `私教${vm.$c('coach')}姓名`,
    dataIndex: 'coach_name',
    key: 'coach_name'
  },
  {
    dataIndex: 'personal_sales',
    key: 'personal_sales',
    slots: { title: 'custom_title' },
    scopedSlots: { customRender: 'personal_sales' }
  }
]
export default {
  name: 'distributionCoach',
  serviceInject() {
    return {
      service: DistributionCoachService,
      messageService: MessageService
    }
  },
  props: {
    memberIds: {
      type: Array,
      default() {
        return []
      }
    },
    coachId: Number
  },
  data() {
    return {
      show: false,
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 10
      },
      list: [],
      coach_id: ''
    }
  },
  computed: {
    columns
  },
  mounted() {
    this.service.getSaleList().subscribe(res => {
      this.list = res.list
      this.selectedRowKeys = [this.coachId]
    })
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination)
    },
    onSelectChange(e, item) {
      console.log(this.selectedRowKeys)
      this.selectedRowKeys = e
      this.coach_id = item[0].id
    },
    onSearch(e) {
      this.service
        .getSaleList({
          retrieve: e
        })
        .subscribe(res => {
          console.log(res)
          this.list = res.list
        })
    },
    save(e) {
      this.service
        .addSale({
          member_ids: this.memberIds,
          coach_id: this.coach_id
        })
        .subscribe(res => {
          this.show = false
          this.$emit('success')
          this.messageService.success({ content: '分配成功' })
        })
    }
  },
  created() {
    this.coach_id = this.coachId
  }
}
</script>
