<template>
  <div :class="b()">
    <st-form-item required labelWidth="70px" label="支付金额">
      <div :class="b('wrapper')">
        <div :class="b('input')">
          <div v-if="isValueCanEdit" :class="b('input-row-item')">
            <div :class="b('input-row-item-value')">{{ _price }}</div>
            <div :class="b('input-row-item-unit')">
              元
            </div>
          </div>
          <div v-else :class="b('row-item')">
            <st-input-number
              :float="true"
              :max="max"
              useType="pay"
              v-model="_price"
              style="width: 210px"
            >
              <template slot="addonAfter">
                元
              </template>
            </st-input-number>
          </div>
        </div>
        <div :class="b('content')" v-if="showList.length">
          <div
            :class="
              'st-input-pay__content-item' +
                `${item.type === 1 ? '--active' : ''}`
            "
            v-for="(item, index) in showList"
            :key="index"
          >
            <div :class="b('content-item-label')">
              {{ item.label }}
            </div>
            <div :class="b('content-item-value')">
              {{ item.value }}
            </div>
          </div>
        </div>
      </div>
    </st-form-item>
  </div>
</template>
<script>
export default {
  name: 'InputPay',
  bem: {
    b: 'st-input-pay'
  },
  props: {
    placeholder: {
      type: String,
      default() {
        return ''
      }
    },
    disabled: {
      type: Boolean,
      default() {
        return false
      }
    },
    value: {
      type: [String, Number]
    },
    max: {
      type: [String, Number],
      default() {
        return 999999999999
      }
    },
    isValueCanEdit: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'large'
    },
    unit: {
      type: String,
      default: '元'
    },
    showList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    _price: {
      set(newValue, oldValue) {
        this.$emit('input', newValue)
        this.$emit('change', newValue)
      },
      get() {
        return this.value
      }
    }
  },
  methods: {}
}
</script>
