<template>
  <div :class="module()">
    <!-- 员工考勤说明 -->
    <MarkteingPluginTitle pathName="brand-app-attendance-list" />
    <st-panel app :tabs="authTabs">
      <portal-target slot="actions" name="BRAND_MARKETING_SHI"></portal-target>
      <router-view></router-view>
    </st-panel>
  </div>
</template>

<script>
import MarkteingPluginTitle from '@/views/pages/brand/marketing/components#/marketing-title'

import { AttendanceService } from './attendance.service'
import tableMixin from '@/mixins/table.mixin'
export default {
  name: 'brand-app-attendance',
  mixins: [tableMixin],
  bem: {
    module: 'brand-app-attendance'
  },
  serviceInject() {
    return {
      attendanceService: AttendanceService
    }
  },
  components: { MarkteingPluginTitle },
  rxState() {
    return {
      authTabs: this.attendanceService.authTabs$
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="less">
.brand-app-attendance {
  .st-panel__body {
    padding: 0 24px;
  }
  .st-panel__actions--tabs {
    align-items: stretch;
    margin-top: 16px;
  }
  .ant-select-search__field__placeholder,
  .ant-select-selection__placeholder {
    top: 54%;
  }
  .member-select .ant-select-selection {
    margin-left: 5px;
  }
}
</style>
