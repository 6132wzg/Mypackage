<template>
  <div
    :class="{
      [b()]: true,
      [b('row')]: direction === 'row',
      [b('column')]: direction === 'column'
    }"
  >
    <template>
      <div :class="b('header')" v-if="direction === 'column'">
        <span>
          {{ item.activity_status !== 1 ? '距秒杀开始' : '距秒杀结束' }}
        </span>
        <span class="clock-timer">
          <st-clock
            :value="
              item.activity_status !== 1
                ? item.start_time * 1000
                : item.end_time * 1000
            "
            format="[DD天]hh:mm:ss"
          ></st-clock>
        </span>
      </div>
      <div :class="b('content')">
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
            <div :class="b('info-bottom-side')">
              <span :class="b('info-bottom-price')">{{ item.price }}</span>
              <!-- MINA_PRODUCT_TYPE.PERSONAL_COURSE 私教课类型 -->
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
            <div :class="b('info-bottom-side')">
              <span
                :class="{
                  [b('info-bottom-mark')]: true,
                  [b('info-bottom-mark--nostart')]: item.activity_status === 2,
                  [b('info-bottom-mark--runing')]: item.activity_status === 1,
                  [b('info-bottom-mark--complete')]: item.activity_status === 3
                }"
              >
                <span class="clock-timer" v-if="direction === 'row'">
                  <st-clock
                    :value="
                      item.activity_status !== 1
                        ? item.start_time * 1000
                        : item.end_time * 1000
                    "
                    format="[DD天]hh:mm:ss"
                  ></st-clock>
                </span>
                <span>{{ statusTextMap[item.activity_status] }}</span>
              </span>
            </div>
          </div>
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
    b: 'h5-phone-seckill-item-component'
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
      statusTextMap: {
        1: '马上抢',
        2: '未开始',
        3: '已抢完'
      }
    }
  },
  methods: {
    imgFilter
  }
}
</script>
