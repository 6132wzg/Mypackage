<template>
  <div>
    <st-form-item
      :class="b()"
      :labelGutter="labelGutter"
      :labelWidth="labelWidth"
      :required="required"
    >
      <template slot="label">
        <slot v-if="$slots.label" name="label"></slot>
        <template>{{ label }}</template>
      </template>
      <a-radio-group
        v-model="currentType"
        :options="types"
        :disabled="disabled"
        @change="onTypeChange"
      ></a-radio-group>
      <st-container
        v-show="isShowShopList"
        class="mg-t16"
        :class="b('container')"
      >
        <a-checkbox-group
          v-decorator="decorators[formItemKey]"
          :disabled="disabled"
          @change="onShopIdsChange"
          class="full-width"
        >
          <a-row>
            <a-col
              :span="12"
              v-for="item in shopList"
              :key="item.value"
              :class="b('item')"
            >
              <a-checkbox :value="item.id">{{ item.shop_name }}</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </st-container>
    </st-form-item>
  </div>
</template>
<script>
import { AssignShopService } from './assign-shop.service'
import { ruleOptions } from './assign-shop.config'
export default {
  serviceInject() {
    return {
      assignShopService: AssignShopService
    }
  },
  rxState() {
    const { loading$, types$, shopList$ } = this.assignShopService
    return {
      loading: loading$,
      types: types$,
      shopList: shopList$
    }
  },
  bem: {
    b: 'biz-assign-shop'
  },
  props: {
    /**
     * 1当前门店/2多店/3全店
     */
    type: {
      type: Number,
      default: 1
    },
    shopIds: {
      type: Array,
      default() {
        return []
      }
    },
    formItemKey: {
      type: String,
      default: 'currentShopIds'
    },
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    label: {
      type: String,
      default: '入场场馆'
    },
    labelWidth: {
      type: String,
      default: '88px'
    },
    labelGutter: {
      type: String,
      default: '24px'
    },
    required: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentType: 1,
      /**
       * 多门店
       */
      MULTI_SHOP: 2
    }
  },
  computed: {
    ruleOptions,
    decorators() {
      return this.form.addDecorators(this.ruleOptions)
    },
    isShowShopList() {
      /**
       * 多店
       */
      return this.currentType === this.MULTI_SHOP
    }
  },
  watch: {
    type(newValue) {
      this.currentType = newValue
    },
    disabled() {
      this.form.validateFields([this.formItemKey], { force: true })
    }
  },
  created() {
    this.currentType = this.type
    this.assignShopService.getShopList().subscribe()
  },
  methods: {
    onShopIdsChange(currentShopIds) {
      this.onChange()
    },
    onTypeChange(e) {
      this.currentType = e.target.value
      this.$nextTick(() => {
        this.form.validateFields([this.formItemKey], { force: true })
      })
      this.onChange()
    },
    onChange() {
      this.$nextTick(() => {
        const { currentType } = this
        const currentShopIds = this.form.getFieldValue(this.formItemKey)
        this.$emit('change', currentType, currentShopIds)
      })
    }
  }
}
</script>
