<template>
  <st-form :form="form" class="page-set-sell-price" labelWidth="130px">
    <a-row :gutter="8">
      <a-col :lg="12">
        <st-form-item>
          <template slot="label">{{ $c('small_course') }} 名称</template>
          <a-input
            placeholder="课程名称"
            disabled
            v-decorator="decorators.course_name"
          />
        </st-form-item>
        <st-form-item label="转让设置" type="text">
          <div>
            <a-checkbox
              v-decorator="decorators.is_allow_transfer"
              @change="transferChange"
            ></a-checkbox>
            <span class="mg-r16">支持转让</span>
            <st-input-number
              v-show="isShowTransfer"
              style="width:282px"
              placeholder="请输入"
              :min="0"
              :max="999999.9"
              :float="true"
              v-decorator="decorators.transfer_num"
            >
              <a-select
                v-decorator="decorators.transfer_type"
                slot="addonAfter"
                style="width: 60px"
              >
                <a-select-option
                  v-for="(item, index) in unitList"
                  :value="item.value"
                  :key="index"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </st-input-number>
          </div>
        </st-form-item>
        <st-form-item label="售卖方式" type="text">
          <a-checkbox-group v-decorator="decorators.sell_type">
            <a-checkbox
              v-for="(item, index) in sellType"
              :value="item.value"
              :key="index"
              class="mg-r16"
            >
              {{ item.label }}
            </a-checkbox>
          </a-checkbox-group>
        </st-form-item>
        <st-form-item label="报名时间" required>
          <a-range-picker
            :showTime="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            :disabledDate="disabledDate"
            style="width:100%"
            v-decorator="decorators.apply_date"
          ></a-range-picker>
        </st-form-item>
        <st-form-item label="售卖价格" required>
          <st-input-number
            v-decorator="decorators.sales_price"
            :min="0"
            placeholder="请输入售卖价格"
            :max="999999.9"
            float
          >
            <template slot="addonAfter">
              元
            </template>
          </st-input-number>
        </st-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="10">
      <a-col :lg="12" :xs="12">
        <st-form-item labelFix>
          <st-button
            class="mg-r16"
            @click="save(0)"
            :loading="loading.setPrice"
          >
            保存
          </st-button>
          <st-button
            type="primary"
            @click="save(1)"
            :loading="loading.setPrice"
          >
            保存并发布
          </st-button>
        </st-form-item>
      </a-col>
    </a-row>
  </st-form>
</template>
<script>
import { AddService } from '../add.service'
import { MessageService } from '@/services/message.service'
import { UserService } from '@/services/user.service'
import { remove } from 'lodash-es'
import { ruleOptions } from '../form.config'
import { GradientService } from '@/views/fragments/course/personal#/gradient.service'
import { PatternService } from '@/services/pattern.service'
import { cloneDeep } from 'lodash-es'

export default {
  name: 'SetSellPrice',
  serviceInject() {
    return {
      addService: AddService,
      messageService: MessageService,
      userService: UserService,
      gradientService: GradientService,
      pattern: PatternService
    }
  },
  rxState() {
    return {
      loading: this.addService.loading$,
      unitList: this.addService.unitList$,
      sellType: this.addService.sellType$
    }
  },
  components: {},
  props: {
    courseName: {
      type: String,
      default: ''
    },
    courseId: {
      type: Number,
      default: 0
    }
  },
  data(vm) {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      isShowTransfer: false
    }
  },
  computed: {},
  watch: {
    courseName(val) {
      this.form.setFieldsValue({
        course_name: val
      })
    },
    courseId(val) {
      this.form.setFieldsValue({
        course_id: val
      })
    }
  },
  created() {},
  mounted() {
    const curTime = moment()
    let start = cloneDeep(curTime)
    let end = cloneDeep(curTime)
    this.form.setFieldsValue({
      apply_date: [start.add('30', 'minutes'), end.add('31', 'minutes')]
    })
    this.$nextTick(() => {
      this.form.setFieldsValue({
        course_name: this.course_name
      })
    })
  },
  methods: {
    save(para) {
      this.form.validateFields().then(values => {
        values.course_id = this.courseId
        values.apply_begin_time = values.apply_date[0].format(
          'YYYY-MM-DD HH:mm'
        )
        values.apply_end_time = values.apply_date[1].format('YYYY-MM-DD HH:mm')
        values.is_allow_transfer = values.is_allow_transfer ? 1 : 0
        values.is_release = para
        if (values.is_allow_transfer === 0) {
          values.transfer_type = undefined
          values.transfer_num = undefined
        }
        delete values.apply_date
        this.addService.setPrice(values).subscribe(this.onSaveSuccess)
      })
    },
    onSaveSuccess() {
      this.messageService.success({
        content: '提交成功'
      })
      this.$router.push({
        name: 'shop-product-course-manage-small-course-list'
      })
    },

    transferChange(e) {
      this.isShowTransfer = e.target.checked
    },
    disabledDate(current) {
      return (
        current && current.format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')
      )
    }
  }
}
</script>
