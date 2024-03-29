<template>
  <st-form :form="form" class="page-set-sell-price" labelWidth="100px">
    <a-row :gutter="8">
      <a-col :lg="14" :offset="1">
        <!-- 课程名称 -->
        <st-form-item label="课程名称">
          <a-input
            placeholder="课程名称"
            disabled
            v-decorator="ruleConfig.courseName"
          />
        </st-form-item>
        <!-- 售卖方式 -->
        <st-form-item label="售卖方式">
          <a-checkbox-group
            :options="sellTypeOptions"
            v-decorator="ruleConfig.sellType"
          ></a-checkbox-group>
        </st-form-item>
        <!-- 课程有效期 -->
        <st-form-item label="单节课有效期">
          <st-input-number
            v-decorator="ruleConfig.effectiveUnit"
            :min="0"
            :max="9999"
            style="width: 150px"
          >
            <template slot="addonAfter">天</template>
          </st-input-number>
          <div class="st-des">
            设置单节课程的有效天数，用户购买私教课程的有效期=节数*单节课有效期
          </div>
        </st-form-item>
        <!-- 单节预约 -->
        <st-form-item>
          <template slot="label">
            单节预约
            <st-help-tooltip id="TBCPC005" />
          </template>
          <a-checkbox
            :checked="!!singleReserve"
            @change="onSingleReserveChange"
          >
            支持单节课预约
          </a-checkbox>
          <template v-if="singleReserve">
            <st-input-number
              v-model="singlePrice"
              :float="true"
              style="width: 100px;"
            />
            <span class="mg-l8">元/节</span>
          </template>
        </st-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="8">
      <a-col :lg="22" :offset="1">
        <st-form-item labelFix>
          <set-price :value="priceGradient" @change="onPriceGradientChange" />
        </st-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="8">
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item labelFix>
          <st-button
            type="primary"
            @click="save"
            :loading="loading.setPrice"
            :disabled="!courseId"
          >
            完成
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
import { RuleConfig } from '@/constants/course/rule'
import SetPrice from '@/views/fragments/course/set-price'
import { GradientService } from '@/views/fragments/course/personal#/gradient.service'

export default {
  name: 'SetSellPrice',
  serviceInject() {
    return {
      addService: AddService,
      messageService: MessageService,
      userService: UserService,
      ruleConfig: RuleConfig,
      gradientService: GradientService
    }
  },
  rxState() {
    const user = this.userService
    return {
      loading: this.addService.loading$,
      sell_types: user.getOptions$('personal_course.sell_type')
    }
  },
  components: {
    SetPrice
  },
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
  data() {
    return {
      form: this.$stForm.create(),
      priceGradient: [],
      singleReserve: 0,
      singlePrice: ''
    }
  },
  computed: {
    sellTypeOptions() {
      const sellType = this.sell_types
      const options = []
      for (let i in sellType) {
        options.push({
          label: sellType[i].label,
          value: sellType[i].value,
          disabled: sellType[i].value === 2
        })
      }
      return options
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
    this.$nextTick(() => {
      this.form.setFieldsValue({
        course_name: this.course_name
      })
    })
  },
  methods: {
    save(e) {
      e.preventDefault()
      const data = this.getData()
      this.form.validate().then(() => {
        if (!this.inputCheck()) {
          return
        }
        this.addService.setPrice(data).subscribe(this.onSaveSuccess)
      })
    },
    onSaveSuccess() {
      this.messageService.success({
        content: '提交成功'
      })
      this.$router.push({
        name: 'shop-product-course-manage-personal-list'
      })
    },
    inputCheck() {
      if (this.singleReserve) {
        if (!this.singlePrice.length) {
          this.messageService.error({
            content: '请输入单节预约价格'
          })
          return
        }
      }
      if (!this.gradientService.check(this.priceGradient)) {
        return false
      }
      return true
    },
    getData() {
      const data = this.form.getFieldsValue()
      data.course_id = this.courseId
      data.price_gradient = this.priceGradient
      data.single_reserve = +this.singleReserve
      if (data.single_reserve) {
        data.single_price = this.singlePrice
      }
      return data
    },
    onPriceGradientChange(priceGradient) {
      this.priceGradient = priceGradient
    },
    onSingleReserveChange() {
      this.singleReserve = +!this.singleReserve
    }
  }
}
</script>
