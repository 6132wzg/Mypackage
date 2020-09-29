<template>
  <st-modal
    title="有效期修改"
    v-model="show"
    wrapClassName="modal-sold-course-extend"
  >
    <div :class="extend('content')">
      <a-row>
        <a-col :span="12">
          <st-info>
            <st-info-item label="购课人">
              {{ packageInfo$.member_name }}
            </st-info-item>
            <st-info-item label="生效状态">
              {{ packageInfo$.is_valid.name }}
            </st-info-item>
            <st-info-item label="到期时间">{{ expirationDate }}</st-info-item>
          </st-info>
        </a-col>
        <a-col :span="12">
          <st-info>
            <st-info-item
              :label="packageInfo$.is_children ? '家长手机号' : '手机号'"
            >
              {{ packageInfo$.phone }}
            </st-info-item>
            <st-info-item label="生效日期">
              {{ packageInfo$.valid_time }}
            </st-info-item>
          </st-info>
        </a-col>
      </a-row>

      <st-form :form="form" labelWidth="88px">
        <div :class="extend('extend')">
          <st-form-item class="mg-b16" required>
            <template slot="label">
              到期时间
            </template>
            <a-date-picker
              placeholder="请输入到期时间"
              @change="onChangeDate"
              v-decorator="decorators.valid_end_time"
              :disabledDate="disabledDate"
            ></a-date-picker>
          </st-form-item>
          <st-form-item label="备注" class="mg-b0">
            <st-textarea
              v-decorator="decorators.content"
              :autosize="{ minRows: 4, maxRows: 6 }"
              :maxlength="200"
            />
          </st-form-item>
        </div>
      </st-form>
    </div>
    <template slot="footer">
      <st-button @click="onSubmit" type="primary">
        确认提交
      </st-button>
    </template>
  </st-modal>
</template>

<script>
import moment from 'moment'
import { UpdateExpirationDateService } from './update-expiration-date.service.ts'
import { ruleOptions } from './update-expiration-date.config'
import { get } from 'lodash'
export default {
  name: 'ModalSoldCourseExtend',
  bem: {
    extend: 'modal-sold-course-extend'
  },
  serviceInject() {
    return {
      service: UpdateExpirationDateService
    }
  },
  rxState() {
    const { packageInfo$, loading$ } = this.service
    return { packageInfo$, loading$ }
  },
  props: ['id'],
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      date: void 0,
      show: false
    }
  },
  computed: {
    expirationDate() {
      const time = get(this.packageInfo$, 'end_time')
      return time
    }
  },
  created() {
    this.service.getPackageInfo(this.id).subscribe()
  },
  methods: {
    moment,
    disabledDate(current) {
      if (moment(get(this.packageInfo$, 'end_time')) < moment()) return true
      return (
        moment(get(this.packageInfo$, 'end_time')) < current ||
        current < moment()
      )
    },
    onChangeDate(value) {
      this.date = value
    },
    onSubmit() {
      this.form.validate().then(values => {
        values.valid_end_time = moment(values.valid_end_time).format(
          'YYYY-MM-DD'
        )
        this.service
          .setValidTime({
            id: this.id,
            ...values
          })
          .subscribe(res => {
            this.$emit('success')
            this.show = false
          })
      })
    }
  }
}
</script>
