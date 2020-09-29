<template>
  <st-modal title="业绩拆分详情" v-model="show" :footer="null">
    <st-table
      :rowKey="record => record.staff_id"
      :columns="columns"
      :dataSource="info.list"
      :page="false"
    />
    <st-info class="mg-t8">
      <st-info-item label="备注">
        {{ info.description }}
      </st-info-item>
    </st-info>
  </st-modal>
</template>
<script>
import { columns } from './split-info.config'
export default {
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      show: false,
      info: {}
    }
  },
  computed: {
    columns
  },
  watch: {
    value: {
      handler(val) {
        this.info = val
      },
      deep: true
    }
  },
  created() {
    this.info = this.value
  }
}
</script>
