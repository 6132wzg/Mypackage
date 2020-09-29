<template>
  <div>
    <title-info v-model="titleData"></title-info>
    <div class="mg-b8">
      <span style="margin-right:16px; visibility:hidden">时间范围</span>
      <st-button
        :style="{
          width: '120px',
          marginBottom: '14px',
          marginRight: '8px'
        }"
        :class="item.value === value.getData.user_renew.type ? 'active' : ''"
        v-for="(item, index) in renewProductType"
        :key="index"
        @click="selectType(item)"
      >
        {{ item.label }}
      </st-button>
    </div>
    <span style="margin-right:16px">时间范围</span>
    <time-day
      v-model="value.getData.user_renew.select_time"
      :timeList="timeList"
    ></time-day>
  </div>
</template>
<script>
import timeDay from './time-day'
import titleInfo from './title-info.vue'
import { UserRenewService } from './user-renew.service'
export default {
  props: {
    value: Object
  },
  components: {
    titleInfo,
    timeDay
  },
  serviceInject() {
    return {
      userRenewService: UserRenewService
    }
  },
  rxState() {
    return {
      renewProductType: this.userRenewService.renewProductType$
    }
  },
  data() {
    return {
      titleData: {
        title: '用户续购情况',
        info: ''
      },
      timeList: [
        { value: 7, name: ' 近7天' },
        { value: 15, name: '近15天' },
        { value: 30, name: '近30天' },
        { value: -1, name: '自定义' }
      ]
    }
  },
  methods: {
    selectType(item) {
      this.value.getData.user_renew.type = item.value
    }
  },
  mounted() {}
}
</script>
