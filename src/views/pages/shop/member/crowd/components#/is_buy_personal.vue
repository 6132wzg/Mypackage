<template>
  <div>
    <title-info v-model="titleData"></title-info>
    <div class="mg-b8">
      <span class="mg-r16" style="visibility:hidden">时间范围</span>
      <st-button
        :style="{
          width: '120px',
          marginBottom: '14px',
          marginRight: '8px'
        }"
        v-for="(item, index) in isBuyPersonal"
        :key="index"
        @click="selectIsBuy(item)"
        :class="
          item.value === value.getData.personal_course_purchase.type
            ? 'active'
            : ''
        "
      >
        {{ item.label }}
      </st-button>
    </div>
    <span class="mg-r16">时间范围</span>
    <time-day
      v-model="value.getData.personal_course_purchase.select_time"
    ></time-day>
  </div>
</template>
<script>
import timeDay from './time-day'
import titleInfo from './title-info.vue'
import { IsBuyPersonalService } from './is-buy-personal.service'
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
      isBuyPersonalService: IsBuyPersonalService
    }
  },
  rxState() {
    return {
      isBuyPersonal: this.isBuyPersonalService.buyPersonalCourse$
    }
  },
  data() {
    return {
      titleData: {
        title: '是否购买私教课',
        info: '选择自然日内，私教课购买情况'
      }
    }
  },
  methods: {
    selectIsBuy(item) {
      this.value.getData.personal_course_purchase.type = item.value
    }
  },
  mounted() {}
}
</script>
