<template>
  <!-- 转让设置 -->
  <div class="biz-package-form__reserve-limit">
    <st-form-item label="约课限制" :required="isLimit" labelWidth="148px">
      <a-checkbox-group
        @change="onChange"
        v-decorator="decorators.reserve_is_limit"
      >
        <a-checkbox :value="1">
          限制最多上课节数
        </a-checkbox>
      </a-checkbox-group>
    </st-form-item>
    <st-form-item label="" class="input-number" required>
      <!-- <transtion name="fade"></transtion> -->
      <st-input-number
        v-decorator="decorators.reserve_limit_times"
        v-if="isReset"
        :min="1"
        :max="999"
        :disabled="!isLimit"
        @blur="onBlur"
        style="width: 236px"
      >
        <a-select
          v-decorator="decorators.reserve_limit_day"
          slot="addonBefore"
          :options="reserveLimitDayOptions$"
        ></a-select>
        <template slot="addonAfter">节</template>
      </st-input-number>
      <span class="tip mg-l20">该限制仅生效于小程序</span>
    </st-form-item>
  </div>
</template>

<script>
import { FormService } from '../form.service'
export default {
  name: 'ReserveIsLimitFormItem',
  inject: ['form'],
  data() {
    return {
      isLimit: false,
      isReset: true
    }
  },
  serviceInject() {
    return {
      service: FormService
    }
  },
  rxState() {
    let { reserveLimitDayOptions$ } = this.service
    return {
      reserveLimitDayOptions$
    }
  },
  mounted() {
    this.getIslimit()
  },
  computed: {
    decorators() {
      return this.form.decorators
    }
  },
  methods: {
    getIslimit() {
      this.isLimit = !!this.form.initInfo.reserve_is_limit
    },
    reset() {
      this.isReset = false
      let timer = setTimeout(() => {
        this.isReset = true
        clearTimeout(timer)
      })
    },
    onBlur() {
      if (this.isLimit) return
      this.reset()
    },
    onChange(event) {
      this.reset()
      this.isLimit = !!event[0]
    }
  }
}
</script>

<style></style>
