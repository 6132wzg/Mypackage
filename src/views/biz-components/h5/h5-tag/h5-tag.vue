<template>
  <div :class="h5()">
    <img
      v-if="type === '1'"
      :class="h5('default')"
      :src="tagList[tag] && imgFilter(tagList[tag].url, { w: 76, h: 32 })"
    />
    <div
      class="h5-tag__activity"
      :class="`h5-tag__activity-${tag}`"
      v-if="type === '2'"
    >
      {{ activityStatus[tag] }}
    </div>
  </div>
</template>
<script>
import { imgFilter } from '@/filters/resource.filters'
import { tagList } from './h5-tag.config'
import { H5TagService } from './h5-tag.service'
export default {
  bem: {
    h5: 'h5-tag'
  },
  data() {
    return {
      tagList
    }
  },
  props: {
    type: {
      type: String,
      default: '1' // 1: 卡/课标签 2: 活动标签
    },
    tag: {
      type: [String, Number]
    }
  },
  serviceInject() {
    return {
      h5TagService: H5TagService
    }
  },
  rxState() {
    return {
      activityStatus: this.h5TagService.activityStatus$
    }
  },
  methods: {
    imgFilter
  }
}
</script>
