<template>
  <section>
    <st-table
      :pagination="{
        current: $searchQuery.page,
        total: page.total_counts,
        pageSize: $searchQuery.size
      }"
      :columns="columns"
      @change="onPageChange"
      rowKey="key"
      :dataSource="stList"
    >
      <template slot="consume_time" slot-scope="text">
        {{ moment(text * 1000).format('YYYY-MM-DD HH:mm') }}
      </template>
    </st-table>
  </section>
</template>
<script>
import moment from 'moment'
import { ConsumptionRecordService } from './consumption-record.service'
const columns = [
  {
    title: '消费时间',
    dataIndex: 'consume_time',
    scopedSlots: { customRender: 'consume_time' }
  },
  {
    title: '消费内容',
    dataIndex: 'consume_content',
    scopedSlots: { customRender: 'consume_content' }
  },
  {
    title: '消费课时',
    dataIndex: 'consume_course',
    scopedSlots: { customRender: 'consume_course' }
  },
  {
    title: '剩余课时',
    dataIndex: 'course_remain',
    scopedSlots: { customRender: 'course_remain' }
  },
  {
    title: '备注',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  }
]
export default {
  name: 'PageShopSoldCoursePackageInfoConsumption',
  bem: {
    basic: 'page-shop-sold'
  },
  serviceInject() {
    return {
      consumptionRecordService: ConsumptionRecordService
    }
  },
  rxState() {
    return {
      page: this.consumptionRecordService.page$,
      list: this.consumptionRecordService.list$
    }
  },
  computed: {
    stList() {
      let array = []
      this.list.forEach(i => {
        let key = parseInt(Math.random() * 999999).toString()
        array.push({ ...i, key: key })
      })
      return array
    }
  },
  data() {
    return {
      columns
    }
  },
  methods: {
    moment,
    onPageChange(data) {
      this.$router.push({
        query: { ...this.$searchQuery, page: data.current, size: data.pageSize }
      })
    }
  }
}
</script>
