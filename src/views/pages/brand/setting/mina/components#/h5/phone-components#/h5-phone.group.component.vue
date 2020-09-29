<template>
  <div :class="module({ active: isActive })">
    <div :class="module('group')">
      <div :class="module('title')">
        <div :class="module('title-text')" class="module-title">
          {{ moduleName }}
        </div>
        <img
          :class="module('title-bg')"
          :src="imgFilter(titleBg, { w: 670, h: 80 })"
          width="670"
          height="80"
          alt=""
          srcset=""
        />
      </div>
      <div :class="module('content')">
        <div
          :class="module('item')"
          v-for="i in info.list"
          :key="i.activity_id"
        >
          <div :class="module('item-left')">
            <img
              :class="module('item-img')"
              :src="imgFilter(i.image_url, { w: 180, h: 100 })"
              width="200"
              height="150"
              alt=""
            />
            <h5-tag :class="module('item-tag')" :tag="i.tag"></h5-tag>
            <div :class="module('item-num')">-人团</div>
          </div>
          <div :class="module('item-right')">
            <div :class="module('item-name')">{{ i.activity_name }}</div>
            <div :class="module('item-description')">--</div>
            <div :class="module('item-price')">
              <div :class="module('item-price-group')">
                -
              </div>
              <del :class="module('item-price-original')">
                单独购买¥-
              </del>
            </div>
          </div>
          <div :class="module('item-button')">
            去拼团
          </div>
        </div>
        <slot name="empty"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import { imgFilter } from '@/filters/resource.filters'
import H5Tag from '@/views/biz-components/h5/h5-tag/h5-tag'
export default {
  name: 'h5PhoneGroupComponent',
  bem: {
    module: 'h5-phone-group-component'
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
      type: String,
      default: ''
    }
  },
  components: {
    H5Tag
  },
  data() {
    return {
      titleBg:
        'https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/index-group-bg.png'
    }
  },
  methods: {
    imgFilter
  }
}
</script>
