<template>
  <st-modal
    title="激活"
    v-model="show"
    wrapClassName="modal-sold-course-reactive"
  >
    <div :class="reactive('content')">
      <biz-sold-card-info :info="cardInfo$"></biz-sold-card-info>
      <st-form :form="form" labelWidth="88px">
        <div :class="reactive('reactive')">
          <st-form-item class="mg-b16" labelWidth="120px" required>
            <template slot="label">
              激活延期时间
            </template>
            <st-input-number
              :max="999"
              :min="1"
              placeholder="请输入延长天数"
              @change="onChangeDate"
              v-decorator="decorators.extend_days"
            >
              <span slot="addonAfter">
                天
              </span>
            </st-input-number>
          </st-form-item>
          <st-form-item label="到期时间" labelWidth="120px" required>
            {{ expirationDate }}
          </st-form-item>
          <st-form-item label="备注" labelWidth="120px" class="mg-b0">
            <st-textarea
              v-decorator="decorators.description"
              :autosize="{ minRows: 4, maxRows: 6 }"
              :maxlength="200"
            />
          </st-form-item>
        </div>
      </st-form>
    </div>
    <template slot="footer">
      <st-button
        @click="onSubmit"
        :loading="loading$.setReactive"
        type="primary"
      >
        确认提交
      </st-button>
    </template>
  </st-modal>
</template>

<script>
import moment from 'moment'
import { ReactiveService } from './reactive.service'
import BizSoldCardInfo from '@/views/biz-components/sold/card-info.vue'
import { ruleOptions } from './reactive.config'
import { get } from 'lodash-es'
export default {
  name: 'ModalSoldCourseReactive',
  bem: {
    reactive: 'modal-sold-course-reactive'
  },
  serviceInject() {
    return {
      reactiveService: ReactiveService
    }
  },
  rxState() {
    const { cardInfo$, loading$ } = this.reactiveService
    return { cardInfo$, loading$ }
  },
  props: ['id'],
  components: {
    BizSoldCardInfo
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false,
      addDate: 0
    }
  },
  computed: {
    expirationDate() {
      return moment()
        .add(this.addDate, 'days')
        .format('YYYY-MM-DD HH:mm')
    }
  },
  created() {
    this.reactiveService.getReactiveInfo(this.id).subscribe()
  },
  methods: {
    moment,
    onChangeDate(value) {
      this.addDate = value
    },
    onSubmit() {
      this.form.validate().then(values => {
        values.extend_days = +values.extend_days
        this.reactiveService
          .setReactive({
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
