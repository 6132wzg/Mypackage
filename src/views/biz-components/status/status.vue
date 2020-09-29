<template>
  <div class="st-status" :class="`st-status--${status}`">
    <span>{{ status_tip }}</span>
  </div>
</template>

<script>
import { CABINET_STATUS, CABINET_STATUS_TIP } from '@/constants/cabinet'
export default {
  name: '',

  bem: {
    b: 'st-status'
  },

  components: {},

  props: {
    type: {
      type: Number,
      default: 1
    }
  },

  data() {
    return { CABINET_STATUS, CABINET_STATUS_TIP }
  },

  computed: {
    status() {
      return this.CABINET_STATUS[this.type]
    },
    status_tip() {
      return this.CABINET_STATUS_TIP[this.status]
    }
  },

  async: {},

  mounted() {},

  methods: {}
}
</script>

<style lang="less" scoped></style>
