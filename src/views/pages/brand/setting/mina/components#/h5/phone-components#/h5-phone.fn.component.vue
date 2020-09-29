<template>
  <div :class="module({ [info.row_num]: true, active: isActive })">
    <div v-if="!info.list.length" :class="module('no-data')">
      <div :class="module('title')">功能入口</div>
      <slot name="empty"></slot>
    </div>
    <div
      v-else
      :class="module('item')"
      v-for="(item, index) in info.list"
      :key="index"
    >
      <template>
        <img
          :src="imgFilter(item.image.image_url, { w: 96, h: 96 })"
          width="96"
          height="96"
          alt=""
          :class="module('item-img')"
          srcset=""
        />
        <div :class="module('item-title')">{{ item.title }}</div>
      </template>
    </div>
  </div>
</template>
<script>
import { imgFilter } from '@/filters/resource.filters'
import { chunk, concat, fill, cloneDeep } from 'lodash-es'

export default {
  name: 'h5PhoneFnComponent',
  bem: {
    module: 'h5-phone-fn-component'
  },
  props: {
    info: {
      type: Object
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // selfInfo: function() {
    //   console.log(1111, this.info)
    //   let _info = cloneDeep(this.info)
    //   let fnList = cloneDeep(_info.list)
    //   fnList.map(i => {
    //     i.id = 'key_' + parseInt(`${Math.random() * 999999}`).toString()
    //     return i
    //   })
    //   let concatList = Array(_info.row_num)
    //     .fill(null)
    //     .map(i => new Object())
    //   concatList.forEach((i, index) => {
    //     i.id = 'key_' + index + parseInt(`${Math.random() * 999999}`).toString()
    //   })
    //   _info.list = chunk(concat(fnList, concatList), _info.row_num)
    //   _info.list.pop()
    //   return _info
    // }
  },
  data() {
    return {}
  },
  methods: {
    imgFilter
  }
}
</script>
