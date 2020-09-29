<template>
  <div :class="module()">
    <div :class="module('title')">
      <div :class="module('title-text')">{{ moduleName }}</div>
    </div>
    <div :class="module('content-desc')">最多添加{{ maxNum }}个卡项</div>
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
      fieldName="card_name"
      title="选择卡项"
      desc="拖动卡片可进行排序"
      placeholder="选择卡项"
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
import RecommendCardTableSelect from '@/views/biz-modals/card/recommend-card-table-select'
import { H5FormCardComponentService } from './h5-form.card.component.service'
import { imgFilter } from '@/filters/resource.filters'
import ProductSelect from './product-select'

export default {
  name: 'h5FormCardComponent',
  mixins: [mixin],
  modals: {
    RecommendCardTableSelect
  },
  bem: {
    module: 'h5-form-component'
  },
  components: {
    ProductSelect
  },
  serviceInject() {
    return {
      cardService: H5FormCardComponentService
    }
  },
  rxState() {
    const { directionOptions$, recommendRuleOptions$ } = this.cardService
    return {
      directionOptions: directionOptions$,
      recommendRuleOptions: recommendRuleOptions$
    }
  },
  data() {
    return {
      modalConfig: {
        title: '选择卡项',
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
          card_name: item.card_name,
          card_type: item.card_type,
          card_spec: item.time_gradient,
          price: typeof item.price === 'object' ? item.price.name : item.price,
          image_url: item.image_url,
          tag: item.tag
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
      this.cardService.getPreview(query).subscribe(res => {
        this.value.list = res.list
      })
    },
    onModalOpen() {
      const { title, max } = this.modalConfig
      this.$modalRouter.push({
        name: 'recommend-card-table-select',
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
