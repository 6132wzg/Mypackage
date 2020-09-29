<template>
  <div
    :class="{
      [b()]: true,
      [b('row')]: direction === 'row',
      [b('column')]: direction === 'column'
    }"
  >
    <template>
      <div :class="b('image')">
        <img
          :class="b('image-bg')"
          :width="direction === 'column' ? 200 : 300"
          :height="direction === 'column' ? 150 : 225"
          :src="
            imgFilter(
              image,
              direction === 'column' ? { w: 200, h: 150 } : { w: 300, h: 225 }
            )
          "
          alt=""
        />
        <h5-tag :class="b('image-tag')" :tag="tag"></h5-tag>
      </div>
      <div :class="b('info')">
        <div :class="b('info-name')">{{ name }}</div>
        <div
          :class="b('info-desc')"
          v-if="item.product_type !== MINA_PRODUCT_TYPE.PERSONAL_COURSE"
        >
          {{ item.spec_desc }}
        </div>
        <div
          :class="b('info-tags')"
          v-if="item.product_type === MINA_PRODUCT_TYPE.PERSONAL_COURSE"
        >
          <span
            class="text-line1"
            :class="b('info-tag')"
            v-for="(tag, index) in tags"
            :key="index"
          >
            {{ tag.name || tag }}
          </span>
        </div>
        <div :class="b('info-bottom')">
          <div>
            <span
              :class="b('info-bottom-line-price')"
              v-if="item.product_type !== MINA_PRODUCT_TYPE.PERSONAL_COURSE"
            >
              ¥{{ item.original_price }}
            </span>
            <span
              :class="b('info-bottom-tag')"
              v-if="item.product_type === MINA_PRODUCT_TYPE.PERSONAL_COURSE"
            >
              限定{{ item.init_course_num }}节
            </span>
          </div>
          <div>
            <span :class="b('info-bottom-price')">{{ item.price }}</span>
            <span :class="b('info-bottom-mark')">
              {{ item.activity_status === 1 ? '即将结束' : '马上开始' }}
            </span>
          </div>
          <img
            :class="b('info-bottom-image-bg')"
            width="348"
            height="76"
            :src="imgFilter(itemInfoBg, { w: 348, h: 76 })"
            alt=""
          />
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { MINA_PRODUCT_TYPE } from '@/constants/brand/app/plugin/discount'
import { imgFilter } from '@/filters/resource.filters'
import H5Tag from '@/views/biz-components/h5/h5-tag/h5-tag'
export default {
  name: 'h5PhoneRecommendItemComponent',
  bem: {
    b: 'h5-phone-discount-item-component'
  },
  props: {
    item: {
      type: Object,
      default: () => ({
        tags: []
      })
    },
    image: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    tags: {
      type: Array,
      default: function() {
        return []
      }
    },
    price: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: 'row'
    },
    tag: {
      type: Number
    }
  },
  computed: {
    selfItemData: function() {
      return this.itemData
    }
  },
  components: {
    H5Tag
  },
  data() {
    return {
      MINA_PRODUCT_TYPE,
      banner2Options: {
        freeMode: true,
        slidesPerView: 'auto',
        spaceBetween: 24
      },
      itemInfoBg:
        'https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/index-discount-price-bg.png'
    }
  },
  methods: {
    imgFilter
  }
}
</script>
