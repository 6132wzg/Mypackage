<template>
  <div>
    <span v-if="userRange === SHOP_RANGE.SINGLE_STORE">
      {{ record.use_shop_name }}
    </span>
    <a v-else-if="userRange === SHOP_RANGE.SPECIFIED_STORE" @click="onGetShop">
      共{{ record.use_shop_num }}家
    </a>
    <span v-else-if="userRange === SHOP_RANGE.ALL_STORE">
      全门店
    </span>
  </div>
</template>

<script>
import { SHOP_RANGE } from '@/constants/course/package.ts'
import SupportCourseShops from '@/views/biz-modals/member/shop-table.vue'
export default {
  name: 'userRange',
  modals: {
    SupportCourseShops
  },
  props: {
    userRange: {
      type: [String, Number],
      default: ''
    },
    record: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      SHOP_RANGE
    }
  },
  methods: {
    onGetShop() {
      this.$modalRouter.push({
        name: 'support-course-shops',
        props: {
          shopList: this.record.use_shop_list
        }
      })
    }
  }
}
</script>

<style></style>
