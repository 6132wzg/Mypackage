<template>
  <st-table
    class="mg-t16"
    rowKey="course_id"
    :columns="columns"
    :page="page"
    :dataSource="list"
    :loading="loading.getList"
    @change="onTableChange"
  >
    <div slot="shops" slot-scope="shops, record">
      <a
        v-if="record.shop_setting === 2"
        v-modal-link="{
          name: 'course-support-course-shops',
          props: { courseId: record.course_id }
        }"
      >
        共{{ shops }}家门店
      </a>
      <span v-else>
        {{ record.shop_setting | enumFilter('personal_course.shop_setting') }}
      </span>
    </div>

    <div slot="coaches" slot-scope="coaches, record">
      <a
        v-modal-link="{
          name: 'course-support-course-coaches',
          props: { course: record }
        }"
      >
        {{ coaches }}
      </a>
    </div>

    <div slot="course_name" slot-scope="course_name, record">
      <router-link
        v-if="record.auth['shop:product:personal_course|get']"
        class="mg-r8"
        :to="{
          name: 'shop-product-course-manage-personal-info',
          query: { id: record.course_id }
        }"
      >
        {{ course_name }}
      </router-link>
      <span v-else></span>
    </div>

    <div slot="price_setting" slot-scope="price_setting">
      {{ price_setting | enumFilter('personal_course.price_setting') }}
    </div>

    <div slot="sell_price" slot-scope="sell_price, record">
      <a
        href="javascript:;"
        v-if="sell_price.is_click === 1"
        @click="onCLickCoursePrice(record)"
      >
        {{ sell_price.course_price }}
      </a>
      <span v-else>{{ sell_price.course_price }}</span>
    </div>
    <!-- <div slot="is_available" slot-scope="is_available">
      <span>
        <a-badge :status="is_available === 1 ? 'success' : 'error'" />
        {{ is_available | enumFilter('personal_course.is_available') }}
      </span>
    </div> -->
    <div slot="action" slot-scope="text, record">
      <st-table-actions>
        <router-link
          class="mg-r8"
          v-if="record.auth['shop:product:personal_course|get']"
          :to="{
            name: 'shop-product-course-manage-personal-info',
            query: { id: record.course_id }
          }"
        >
          详情
        </router-link>
        <router-link
          v-if="record.auth['shop:product:personal_course|edit']"
          :to="{
            name: 'shop-product-course-manage-personal-edit',
            query: { id: record.course_id }
          }"
        >
          编辑
        </router-link>
        <a
          href="javascript:;"
          v-if="record.auth['shop:product:personal_course|del']"
        >
          <st-popconfirm
            :title="'一旦删除则无法恢复，确认删除' + record.course_name + '？'"
            @confirm="onConfirmDeleteCourse(record)"
          >
            删除
          </st-popconfirm>
        </a>
      </st-table-actions>
    </div>
  </st-table>
</template>

<script>
import tableMixin from '@/mixins/table.mixin'
import { columns } from './list.config'
import { ListService } from '../list.service'
import CoursePriceSettingShopUpdate from '@/views/biz-modals/course/price-setting-shop-update'
import CoursePriceSettingShop from '@/views/biz-modals/course/price-setting-shop'
import CourseSupportCourseCoaches from '@/views/biz-modals/course/support-course-coaches'
import CourseSupportCourseShops from '@/views/biz-modals/course/support-course-shops'
export default {
  name: 'ShopSaleListTable',
  mixins: [tableMixin],
  modals: {
    CoursePriceSettingShopUpdate,
    CoursePriceSettingShop,
    CourseSupportCourseCoaches,
    CourseSupportCourseShops
  },
  computed: {
    columns
  },
  serviceInject() {
    return {
      service: ListService
    }
  },
  rxState() {
    return {
      list: this.service.list$,
      page: this.service.page$,
      loading: this.service.loading$
    }
  },
  methods: {
    onConfirmDeleteCourse(record) {
      this.$emit('delete-course', record.course_id)
    },
    onCLickCoursePrice(record) {
      if (record.sell_price.course_price === '设置定价') {
        this.$modalRouter.push({
          name: 'course-price-setting-shop-update',
          props: { id: record.course_id }
        })
      } else {
        this.$modalRouter.push({
          name: 'course-price-setting-shop',
          props: { course: record }
        })
      }
    },
    onConfirmSetAvailable(record) {
      this.$emit('set-available', record)
    }
  }
}
</script>
