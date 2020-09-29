<template>
  <div :class="module()">
    <div :class="module('title')">
      <div :class="module('title-text')">{{ moduleName }}</div>
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
import GroupTableSelect from '@/views/biz-modals/plugin/group/group-table-select'
import { imgFilter } from '@/filters/resource.filters'
import ProductSelect from './product-select'
export default {
  name: 'h5FormGroupComponent',
  mixins: [mixin],
  modals: {
    GroupTableSelect
  },
  bem: {
    module: 'h5-form-component'
  },
  components: {
    ProductSelect
  },
  data() {
    return {
      idKeyName: 'activity_id',
      modalConfig: {
        title: '选择拼团活动',
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
          tag: item.tag,
          activity_name: item.activity_name,
          image_url: item.image_url
        }
      })
    },
    onModalOpen() {
      const { title, max } = this.modalConfig
      this.$modalRouter.push({
        name: 'group-table-select',
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
