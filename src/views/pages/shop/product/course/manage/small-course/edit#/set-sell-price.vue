<template>
  <st-form :form="form" class="page-set-sell-price" labelWidth="130px">
    <a-row :gutter="8">
      <a-col :lg="11">
        <st-form-item>
          <template slot="label">{{ $c('small_course') }}名称</template>
          <a-input
            placeholder="课程名称"
            disabled
            v-decorator="decorators.course_name"
          />
        </st-form-item>
        <st-form-item label="转让设置" type="text">
          <st-checkbox
            style="display:inline"
            @change="transferChange"
            v-decorator="decorators.is_allow_transfer"
          ></st-checkbox>
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
        </st-form-item>
        <st-form-item label="售卖方式" type="text">
          <a-checkbox-group
            v-decorator="decorators.sell_type"
            :disabled="isDisabled"
          >
            <a-checkbox
              v-for="(item, index) in sellType"
              :value="item.value"
              class="mg-r16"
              :key="index"
            >
              {{ item.label }}
            </a-checkbox>
          </a-checkbox-group>
        </st-form-item>
        <st-form-item label="报名时间" required>
          <a-range-picker
            :disabled="isDisabled"
            :showTime="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            style="width:100%"
            :disabledDate="disabledDate"
            v-decorator="decorators.apply_date"
          ></a-range-picker>
        </st-form-item>
        <st-form-item label="售卖价格" required>
          <st-input-number
            v-decorator="decorators.sales_price"
            :min="0"
            :disabled="isDisabled"
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
      <a-col :lg="11" :xs="10">
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
import { EditService } from '../edit.service'
import { MessageService } from '@/services/message.service'
import { UserService } from '@/services/user.service'
import { cloneDeep } from 'lodash-es'
import { ruleOptions } from '../form.config'
import { GradientService } from '@/views/fragments/course/personal#/gradient.service'
import { PatternService } from '@/services/pattern.service'
import { CLASS_STATUS } from '@/constants/course/small-course'
export default {
  name: 'SetSellPrice',
  serviceInject() {
    return {
      editService: EditService,
      messageService: MessageService,
      userService: UserService,
      gradientService: GradientService,
      pattern: PatternService
    }
  },
  rxState() {
    return {
      loading: this.editService.loading$,
      unitList: this.editService.unitList$,
      sellType: this.editService.sellType$
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
    },
    info: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data(vm) {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      isShowTransfer: false,
      CLASS_STATUS
    }
  },
  computed: {
    isDisabled() {
      return (
        this.CLASS_STATUS.SIGNING_UNCLASSED === this.info.info.class_status ||
        this.CLASS_STATUS.SIGNING_CLASSED === this.info.info.class_status ||
        this.CLASS_STATUS.CLASSED === this.info.info.class_status
      )
    }
  },
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
  mounted() {
    const curTime = moment()
    let start = cloneDeep(curTime)
    let end = cloneDeep(curTime)
    this.form.setFieldsValue({
      apply_date: [start.add('30', 'minutes'), end.add('31', 'minutes')]
    })
    this.setFieldsValue()
  },
  methods: {
    setFieldsValue() {
      const info = this.info.price
      this.form.setFieldsValue({
        course_name: info.course_name,
        is_allow_transfer: info.is_allow_transfer,
        transfer_num: info.transfer_num,
        sell_type: info.sell_type,
        transfer_type: info.transfer_type,
        sales_price: info.sales_price
      })
      if (info.apply_begin_time) {
        this.form.setFieldsValue({
          apply_date: [
            moment(info.apply_begin_time),
            moment(info.apply_end_time)
          ]
        })
      }
      this.isShowTransfer = info.is_allow_transfer
    },
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
        this.editService.setPrice(values).subscribe(this.onSaveSuccess)
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
    transferChange(val) {
      this.isShowTransfer = val
    },
    disabledDate(current) {
      return (
        current && current.format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')
      )
    }
  }
}
</script>
