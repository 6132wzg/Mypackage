<template>
  <div :class="module({ active: isActive })">
    <div
      v-if="!info.list.length"
      :class="module('header')"
      class="module-title"
    >
      {{ moduleName }}
    </div>
    <img
      v-if="info.list.length"
      :src="imgFilter(info.list[0].image.image_url, { w: 750, h: 200 })"
      width="750"
      height="200"
      alt=""
      srcset=""
    />
    <slot name="empty"></slot>
  </div>
</template>
<script>
import { imgFilter } from '@/filters/resource.filters'

export default {
  name: 'h5PhoneInvitationComponent',
  bem: {
    module: 'h5-phone-invitation-component'
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
