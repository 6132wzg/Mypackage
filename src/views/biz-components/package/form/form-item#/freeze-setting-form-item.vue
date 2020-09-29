<template>
  <!-- 转让设置 -->
  <div :class="form.b('freeze-item')">
    <st-form-item label="冻结设置" :required="isFreeze" labelWidth="148px">
      <a-checkbox-group
        v-decorator="decorators.is_allow_frozen"
        @change="onChange"
      >
        <a-checkbox :value="1">
          <span>支持冻结</span>
        </a-checkbox>
      </a-checkbox-group>
    </st-form-item>
    <st-form-item
      v-if="isReset"
      class="input-number"
      label=""
      :required="isFreeze"
    >
      <st-input-number
        :disabled="!isFreeze"
        v-decorator="decorators.frozen_days"
        style="width: 141px"
      >
        <span slot="addonAfter">天</span>
      </st-input-number>
    </st-form-item>
  </div>
</template>

<script>
import { FormService } from '../form.service'
export default {
  name: 'FreezeSettingFormItem',
  inject: ['form'],
  data() {
    return {
      isFreeze: false,
      isReset: true
    }
  },
  serviceInject() {
    return {
      service: FormService
    }
  },
  rxState() {
    let { freezeUnitOptions$ } = this.service
    return {
      freezeUnitOptions$
    }
  },
  computed: {
    decorators() {
      return this.form.decorators
    }
  },
  methods: {
    onChange(event) {
      this.isReset = false
      let timer = setTimeout(() => {
        this.isReset = true
        clearTimeout(timer)
      }, 100)
      this.isFreeze = !!event[0]
    }
  },
  mounted() {
    this.isFreeze = !!this.form.initInfo.is_allow_frozen
  }
}
</script>

<style></style>
