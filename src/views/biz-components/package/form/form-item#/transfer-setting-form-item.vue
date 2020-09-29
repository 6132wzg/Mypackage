<template>
  <!-- 转让设置 -->
  <div :class="form.b('transfer-item')">
    <st-form-item label="转让设置" :required="isTransfer" labelWidth="148px">
      <a-checkbox-group
        v-decorator="decorators.is_allow_transfer"
        @change="onChange"
      >
        <a-checkbox :value="1">
          <span>支持转让</span>
        </a-checkbox>
      </a-checkbox-group>
    </st-form-item>
    <st-form-item
      v-if="isReset"
      class="input-number"
      label=""
      :required="isTransfer"
    >
      <st-input-number
        v-decorator="decorators.transfer_rate"
        :min="range.min"
        :max="range.max"
        float
        :disabled="!isTransfer"
        style="width: 141px"
      >
        <a-select
          slot="addonAfter"
          @change="onchangeUnit"
          v-decorator="decorators.transfer_unit"
          :options="transferUnitOptions$"
        ></a-select>
      </st-input-number>
    </st-form-item>
  </div>
</template>

<script>
import { FormService } from '../form.service'
export default {
  name: 'TransferSettingFormSetting',
  inject: ['form'],
  data() {
    return {
      isTransfer: false,
      isReset: true,
      range: {
        min: 0,
        max: 99
      }
    }
  },
  serviceInject() {
    return {
      service: FormService
    }
  },
  rxState() {
    let { transferUnitOptions$ } = this.service
    return {
      transferUnitOptions$
    }
  },
  computed: {
    decorators() {
      return this.form.decorators
    }
  },
  methods: {
    onchangeUnit(value) {
      this.getRange(value)
    },
    onChange(event) {
      this.isReset = false
      let timer = setTimeout(() => {
        this.isReset = true
        clearTimeout(timer)
      }, 100)
      this.isTransfer = !!event[0]
      this.form.isTransfer = !!event[0]
    },
    getRange(unit) {
      let ranges = {
        1: {
          min: 0,
          max: 100
        },
        2: {
          min: 0,
          max: 999999
        }
      }
      this.$nextTick().then(() => {
        unit = unit ? unit : this.form.form.getFieldValue('transfer_unit')
        this.range = ranges[unit]
      })
    }
  },
  mounted() {
    this.isTransfer = !!this.form.initInfo.is_allow_transfer
    this.getRange()
  }
}
</script>

<style></style>
