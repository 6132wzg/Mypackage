<template>
  <div :class="module()">
    <div :class="module('title')">
      <div :class="module('title-text')">{{ moduleName }}</div>
    </div>
    <div :class="module('content-desc')">最多添加{{ maxNum }}个课程包</div>
    <div :class="module('direction')">
      <div :class="module('direction-label')">显示方式</div>
      <a-radio-group
        :options="directionOptions"
        v-model="show_direction"
        @change="onChange"
      ></a-radio-group>
    </div>
    <div :class="module('rule')">
      <div :class="module('rule-label')">显示规则</div>
      <a-radio-group
        :options="recommendRuleOptions"
        v-model="data_source"
        @change="onRecommendRuleChange"
      ></a-radio-group>
    </div>
    <product-select
      v-if="isShowCustom"
      fieldName="package_name"
      title="选择课程包"
      desc="拖动课程包可进行排序"
      placeholder="选择课程包"
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
import RecommendPackageTableSelect from '@/views/biz-modals/package/recommend-package-table-select'
import { H5FormPackageComponentService } from './h5-form.package.component.service'
import { imgFilter } from '@/filters/resource.filters'
import ProductSelect from './product-select'

export default {
  name: 'h5FormPackageComponent',
  mixins: [mixin],
  modals: {
    RecommendPackageTableSelect
  },
  bem: {
    module: 'h5-form-component'
  },
  components: {
    ProductSelect
  },
  serviceInject() {
    return {
      packageService: H5FormPackageComponentService
    }
  },
  rxState() {
    const { directionOptions$, recommendRuleOptions$ } = this.packageService
    return {
      directionOptions: directionOptions$,
      recommendRuleOptions: recommendRuleOptions$
    }
  },
  data() {
    return {
      modalConfig: {
        title: '选择课程包',
        max: this.maxNum
      },
      show_direction: 1,
      data_source: null
    }
  },
  methods: {
    imgFilter,
    adaptor(selectedRows) {
      return selectedRows.map(item => {
        return {
          id: item.id,
          package_name: item.course_name,
          times: item.quota_times,
          price: item.price,
          tag: item.tag,
          image_url: item.image_url
        }
      })
    },
    onRecommendRuleChange() {
      this.getPreview()
      this.onChange()
    },
    getPreview() {
      if (this.isShowCustom) {
        return
      }
      const query = {
        shop_id: this.shopId,
        module_type: this.moduleType,
        data_source: this.data_source
      }
      this.packageService.getPreview(query).subscribe(res => {
        this.value.list = res.list
      })
    },
    onModalOpen() {
      const { title, max } = this.modalConfig
      this.$modalRouter.push({
        name: 'recommend-package-table-select',
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
