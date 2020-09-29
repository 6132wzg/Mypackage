<template>
  <div>
    <div :class="module1()" v-if="direction === 'row'">
      <!-- direction: row -->
      <div :class="module1('image')">
        <img
          :class="module1('image-bg')"
          width="300"
          height="226"
          :src="imgFilter(image, { w: 180, h: 100 })"
          alt=""
          srcset=""
        />
        <h5-tag :class="module1('image-tag')" :tag="tag"></h5-tag>
      </div>
      <div :class="module1('name')">{{ name }}</div>
      <div :class="module1('desc')" v-if="desc">{{ desc }}</div>
      <div :class="module1('tags')" v-if="tags.length">
        <span :class="module1('tag')" v-for="(tag, index) in tags" :key="index">
          {{ tag }}
        </span>
      </div>
      <div v-if="price" :class="module1('price')">{{ price }}</div>
    </div>
    <div :class="module2()" v-if="direction === 'column'">
      <!-- direction: column -->
      <div :class="module2('image')">
        <img
          :class="module2('image-bg')"
          width="200"
          height="150"
          :src="imgFilter(image, { w: 180, h: 100 })"
          alt=""
        />
        <h5-tag :class="module2('image-tag')" :tag="tag"></h5-tag>
      </div>
      <div :class="module2('right')">
        <div :class="module2('name')">{{ name }}</div>
        <div :class="module2('desc')" v-if="desc">{{ desc }}</div>
        <div :class="module2('tags')" v-if="tags.length">
          <span
            :class="module2('tag')"
            v-for="(tag, index) in tags"
            :key="index"
          >
            {{ tag }}
          </span>
        </div>
        <div v-if="price" :class="module2('price')">{{ price }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { imgFilter } from '@/filters/resource.filters'
import H5Tag from '@/views/biz-components/h5/h5-tag/h5-tag'
export default {
  name: 'h5PhoneRecommendItemComponent',
  bem: {
    module1: 'h5-phone-recommend-item-component-1',
    module2: 'h5-phone-recommend-item-component-2'
  },
  props: {
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
      banner2Options: {
        freeMode: true,
        slidesPerView: 'auto',
        spaceBetween: 24
      }
    }
  },
  methods: {
    imgFilter
  }
}
</script>
