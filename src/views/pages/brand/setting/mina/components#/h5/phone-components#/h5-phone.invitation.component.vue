<template>
  <div :class="module({ active: isActive })">
    <div
      v-if="!info.list.length || info.is_open === 0"
      :class="module('header')"
      class="module-title"
    >
      {{ moduleName }}
    </div>
    <img
      v-if="info.is_open === 1 && info.list.length"
      :src="imgFilter(info.list[0].image.image_url, { w: 750, h: 200 })"
      width="750"
      height="200"
      alt
    />
    <slot name="empty"></slot>
  </div>
</template>
<script>
import { imgFilter } from '@/filters/resource.filters'

export default {
  name: 'h5PhoneTurntableComponent',
  bem: {
    module: 'h5-phone-turntable-component'
  },
  props: {
    info: {
      type: Object,
      default: function() {
        return {}
      }
    },
    isActive: {
      type: Boolean,
      default: false
    },
    moduleName: {
      type: String
    }
  },
  computed: {},
  methods: {
    imgFilter
  }
}
</script>
