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
import { columnsShops } from './support-table.config'
import { BrandService } from '../../pages/brand/product/course/personal/list/brand.service'
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
    courseId: {
      type: Number,
      default: -1
    },
    shopList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    getShops() {
      if (this.courseId === -1) {
        this.supportShopList = this.shopList
        return
      }
      this.brandService
        .getCoursePersonalSupportShops({ course_id: this.courseId })
        .subscribe(state => {
          this.supportShopList = state.shops
        })
    }
  },
  mounted() {
    this.getShops()
  }
}
</script>
