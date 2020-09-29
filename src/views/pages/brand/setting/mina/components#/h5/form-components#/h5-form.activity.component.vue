<template>
  <div :class="module()">
    <div :class="module('title')">
      <div :class="module('title-text')">{{ moduleName }}</div>
    </div>
    <div :class="module('direction')">
      <div :class="module('direction-label')">显示方式</div>
      <a-radio-group
        :options="directionOptions"
        v-model="show_direction"
        @change="onChange"
      ></a-radio-group>
    </div>
    <product-select
      fieldName="activity_name"
      title="选择活动"
      :desc="`最多添加${maxNum}个活动，拖动活动可进行排序`"
      placeholder="选择活动"
      :maxNum="maxNum"
      v-model="value"
      @delete="onDel"
      @drag="onChange"
      @open="onModalOpen"
    ></product-select>
    <!-- @open="onCustomAction" -->
  </div>
</template>
<script>
import mixin from './mixin'
import ActivityTableSelect from '@/views/biz-modals/plugin/activity/activity-table-select'
import { H5FormActivityComponentService } from './h5-form.activity.component.service'
import { imgFilter } from '@/filters/resource.filters'
import ProductSelect from './product-select'
export default {
  name: 'h5FormActivityComponent',
  mixins: [mixin],
  modals: {
    ActivityTableSelect
  },
  bem: {
    module: 'h5-form-component'
  },
  components: {
    ProductSelect
  },
  serviceInject() {
    return {
      activityService: H5FormActivityComponentService
    }
  },
  rxState() {
    const { directionOptions$ } = this.activityService
    return {
      directionOptions: directionOptions$
    }
  },
  data() {
    return {
      idKeyName: 'activity_id',
      modalConfig: {
        title: '选择活动报名',
        max: this.maxNum
      },
      show_direction: 1
    }
  },
  methods: {
    imgFilter,
    adaptor(selectedRows) {
      return selectedRows.map(item => {
        return {
          activity_id: item.activity_id,
          activity_name: item.activity_name,
          activity_status: item.activity_status,
          valid_days: item.valid_days,
          price: item.price,
          image_url: item.image_url
        }
      })
    },
    onModalOpen() {
      const { title, max } = this.modalConfig
      this.$modalRouter.push({
        name: 'activity-table-select',
        props: {
          defaultSelectedRowKeys: this.selectedRowKeys,
          defaultSelectedRows: this.value.list,
          rowMapKey: this.idKeyName,
          title,
          max,
          defalutQuery: {
            shop_id: this.shopId
          }
        },
        on: {
          complete: res => {
            if (typeof this.adaptor === 'function') {
              this.value.list = this.adaptor(res.selectedRows)
              this.onChange()
            }
          }
        }
      })
    }
  }
}
</script>
