<template>
  <st-modal
    class="modal-support-course-shops"
    title="查看店详情"
    :footer="null"
    v-model="show"
  >
    <st-container>
      <st-table
        :columns="columnsShops"
        :page="false"
        :rowKey="record => record.shop_name"
        :dataSource="supportShopList"
      ></st-table>
    </st-container>
  </st-modal>
</template>
<script>
import { columnsShops } from './shop-table.config'
export default {
  name: 'SupportCourseShops',
  serviceInject() {
    return {
      brandService: BrandService
    }
  },
  data() {
    return {
      columnsShops,
      show: false,
      supportShopList: []
    }
  },
  props: {
    shopList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    getShops() {
      this.supportShopList = this.shopList
    }
  },
  mounted() {
    this.getShops()
  }
}
</script>
