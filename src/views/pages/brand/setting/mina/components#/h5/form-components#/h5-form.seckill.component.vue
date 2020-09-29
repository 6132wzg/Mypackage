<template>
  <div :class="module()">
    <div :class="module('title')">
      <div :class="module('title-text')">{{ moduleName }}</div>
    </div>
    <div :class="module('content-desc')">最多添加{{ maxNum }}个秒杀活动</div>
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
      fieldName="product_name"
      title="选择活动"
      :desc="`最多添加${maxNum}个活动，拖动活动可进行排序`"
      placeholder="选择活动"
      :maxNum="maxNum"
      v-model="value"
      @delete="onDel"
      @drag="onChange"
      @open="onModalOpen"
    ></product-select>
  </div>
</template>
<script>
import mixin from './mixin'
import { imgFilter } from '@/filters/resource.filters'
import ProductSelect from './product-select'
import SeckillTableSelect from '@/views/biz-modals/plugin/seckill/seckill-table-select'
import { H5FormSeckillComponentService } from './h5-form.seckill.component.service'

export default {
  name: 'h5FormGroupComponent',
  mixins: [mixin],
  modals: {
    SeckillTableSelect
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
        title: '选择秒杀活动',
        max: this.maxNum
      },
      show_direction: 1,
      data_source: null
    }
  },
  serviceInject() {
    return {
      service: H5FormSeckillComponentService
    }
  },
  rxState() {
    const { directionOptions$, recommendRuleOptions$ } = this.service
    return {
      directionOptions: directionOptions$,
      recommendRuleOptions: recommendRuleOptions$
    }
  },
  methods: {
    imgFilter,
    adaptor(selectedRows) {
      return selectedRows.map(item => {
        return {
          ...item
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
      this.service.getPreview(query).subscribe(res => {
        this.value.list = res.list
      })
    },
    onModalOpen() {
      const { title, max } = this.modalConfig
      console.log(22222)
      this.$modalRouter.push({
        name: 'seckill-table-select',
        props: {
          module_type: this.moduleType,
          defaultSelectedRowKeys: this.selectedRowKeys,
          defaultSelectedRows: this.value.list,
          rowMapKey: this.idKeyName,
          shopId: this.shopId,
          title,
          max,
          defalutQuery: {
            shop_id: this.shopId,
            activity_status: -1
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
