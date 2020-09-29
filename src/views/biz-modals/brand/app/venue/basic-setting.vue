<template>
  <st-modal
    title="场地预约设置"
    class="modal-personal-order-setting"
    v-model="show"
    @ok="onClickSubmit"
    @cancel="cancel"
    :confirmLoading="loading.update"
  >
    <div>
      <st-form :form="form" labelWidth="56px">
        <!-- 预约范围 -->
        <st-form-item label="预约范围">
          <span>用户可预约</span>
          <a-select
            class="mg-l8"
            style="width: 100px"
            v-decorator="decorators.venues_reserve_start"
          >
            <a-select-option
              v-for="(item, index) in reserveStarts"
              :key="+index"
              :value="+item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <span class="mg-l8">到</span>
          <a-select
            class="mg-l8"
            style="width: 70px"
            v-decorator="decorators.venues_reserve_end"
          >
            <a-select-option
              v-for="(item, index) in reserveRanges"
              :key="+index"
              :value="+item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <span class="mg-l8">以内的场地，员工代预约不受此限制</span>
        </st-form-item>
        <!-- 取消预约 -->
        <st-form-item label="取消预约">
          <span>允许用户在场地预约开始前</span>
          <a-select
            class="mg-l8"
            style="width: 100px"
            v-decorator="decorators.venues_cancel_limit"
          >
            <a-select-option
              v-for="(item, index) in cancelReserves"
              :key="+index"
              :value="+item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <span class="mg-l8">取消预约，员工代取消不受此限制</span>
        </st-form-item>
        <!-- 爽约惩罚 -->
        <st-form-item label="爽约惩罚">
          <st-form-item>
            <a-checkbox
              v-decorator="decorators.venues_is_miss_punish"
              @change="onCheckboxChange"
            >
              开启爽约惩罚
            </a-checkbox>
          </st-form-item>
          <a-row>
            <a-col span="14">
              <st-form-item>
                <a-input-number
                  :min="1"
                  :max="999"
                  :disabled="!form.getFieldValue('venues_is_miss_punish')"
                  v-decorator="decorators.miss_punish_day"
                />
                <span class="mg-l8">天内，取消场地预约次数超过</span>
              </st-form-item>
            </a-col>
            <a-col span="10">
              <st-form-item>
                <a-input-number
                  :min="1"
                  :max="999"
                  :disabled="!form.getFieldValue('venues_is_miss_punish')"
                  v-decorator="decorators.miss_punish_number"
                />
                <span class="mg-l8">次后，</span>
              </st-form-item>
            </a-col>
          </a-row>
          <st-form-item>
            <a-input-number
              :min="1"
              :max="999"
              :disabled="!form.getFieldValue('venues_is_miss_punish')"
              v-decorator="decorators.miss_punish_limit"
            />
            <span class="mg-l8">天内不可再预约场地，员工代预约不受此限制</span>
          </st-form-item>
        </st-form-item>
      </st-form>
    </div>
  </st-modal>
</template>
<script>
import { MessageService } from '@/services/message.service'
import { BasicSettingService } from './basic-setting.service'
import { ruleOptions } from './basic-setting.config'
import { APP_TYPE } from '@/constants/venue'
export default {
  serviceInject() {
    return {
      messageService: MessageService,
      settingService: BasicSettingService
    }
  },
  rxState() {
    return {
      loading: this.settingService.loading$,
      reserveStarts: this.settingService.reserveStarts$,
      reserveRanges: this.settingService.reserveRanges$,
      cancelReserves: this.settingService.cancelReserves$,
      signTimes: this.settingService.signTimes$,
      autoSignLimits: this.settingService.autoSignLimits$
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      show: false,
      form,
      decorators
    }
  },
  created() {
    this.settingService
      .getInfo({ application_type: APP_TYPE.VENUES })
      .subscribe(res => {
        const info = {
          ...res.info,
          venues_is_miss_punish: !!res.info.venues_is_miss_punish
        }
        this.form.setFieldsValue({
          venues_reserve_start: info.venues_reserve_start,
          venues_reserve_end: info.venues_reserve_end,
          venues_cancel_limit: info.venues_cancel_limit,
          venues_is_miss_punish: info.venues_is_miss_punish,
          miss_punish_day: info.miss_punish_day,
          miss_punish_number: info.miss_punish_number,
          miss_punish_limit: info.miss_punish_limit
        })
      })
  },
  methods: {
    onCheckboxChange() {
      this.form.setFieldsValue({
        miss_punish_day: '',
        miss_punish_number: '',
        miss_punish_limit: ''
      })
    },
    cancel() {
      this.show = false
    },
    onClickSubmit(e) {
      e.preventDefault()
      this.form.validate().then(values => {
        const data = { ...values }
        data.venues_is_miss_punish = data.venues_is_miss_punish ? 1 : 0
        this.settingService
          .update({ ...data, application_type: APP_TYPE.VENUES })
          .subscribe(() => {
            this.messageService.success({
              content: '提交成功'
            })
            this.show = false
            this.$emit('change')
          })
      })
    },
    save() {
      const data = { ...this.info }
      data.venues_is_miss_punish = data.venues_is_miss_punish ? 1 : 0
      this.settingService
        .update({ ...data, application_type: APP_TYPE.VENUES })
        .subscribe(() => {
          this.messageService.success({
            content: '提交成功'
          })
          this.show = false
          this.$emit('change')
        })
    }
  }
}
</script>
