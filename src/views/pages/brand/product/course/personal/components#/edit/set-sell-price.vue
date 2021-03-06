<template>
  <st-form :form="form" class="page-set-sell-price" labelWidth="100px">
    <a-row :gutter="8">
      <a-col :lg="10" :offset="1">
        <!-- 课程名称 -->
        <st-form-item label="课程名称">
          <a-input
            placeholder="课程名称"
            disabled
            v-decorator="decorators.course_name"
          />
        </st-form-item>
        <!-- 售卖方式 -->
        <st-form-item label="售卖方式">
          <a-checkbox-group
            :options="sellTypeOptions"
            v-decorator="decorators.sell_type"
          >
            <a-checkbox
              v-for="(item, index) in sellType"
              :key="index"
              :value="item.value"
            >
              {{ item.label }}
            </a-checkbox>
          </a-checkbox-group>
        </st-form-item>
        <!-- 课程有效期 -->
        <st-form-item label="单节课有效期">
          <st-input-number
            v-decorator="decorators.effective_unit"
            style="width: 150px"
            :max="9999"
          >
            <template slot="addonAfter">天</template>
          </st-input-number>
          <div class="st-des">
            设置单节课程的有效天数，用户购买私教课程的有效期=节数*单节课有效期
          </div>
        </st-form-item>
        <!-- 定价权限 -->
        <st-form-item label="定价权限" required>
          <a-radio-group
            @change="onChange"
            v-decorator="decorators.price_setting"
          >
            <a-radio :value="PRICE_SETTING.UNIFORM_PRICE">品牌统一定价</a-radio>
            <a-radio :value="PRICE_SETTING.SHOP_PRICE">
              售卖场馆自主定价
            </a-radio>
          </a-radio-group>
        </st-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :lg="22" :offset="1">
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
        <st-form-item v-if="isShowUnitSet" labelFix>
          <set-price :value="priceGradient" @change="onPriceGradientChange" />
        </st-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item labelFix>
          <st-button type="primary" @click="save" :loading="loading.setPrice">
            完成
          </st-button>
        </st-form-item>
      </a-col>
    </a-row>
  </st-form>
</template>
<script>
import { AddService } from '../../add.service'
import { MessageService } from '@/services/message.service'
import SetPrice from '@/views/fragments/course/set-price'
import { GradientService } from '@/views/fragments/course/personal#/gradient.service'
import { ruleOptions } from '../set-sell-price.config'
import { SELL_TYPE, PRICE_SETTING } from '@/constants/course/personal'
export default {
  name: 'SetSellPrice',
  serviceInject() {
    return {
      addService: AddService,
      messageService: MessageService,
      gradientService: GradientService
    }
  },
  rxState() {
    return {
      loading: this.addService.loading$,
      sellType: this.addService.sellType$
    }
  },
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    SetPrice
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      PRICE_SETTING,
      priceSetting: PRICE_SETTING.UNIFORM_PRICE,
      priceGradient: [],
      singleReserve: 0,
      singlePrice: ''
    }
  },
  computed: {
    isShowUnitSet() {
      return this.priceSetting === PRICE_SETTING.UNIFORM_PRICE
    },
    sellTypeOptions() {
      const sellType = this.sellType
      const options = []
      sellType.forEach(item => {
        options.push({
          label: item.label,
          value: item.value,
          disabled: item.value === SELL_TYPE.OFFLINE
        })
      })
      return options
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setFieldsValue()
    })
  },
  methods: {
    save(e) {
      e.preventDefault()
      this.form.validateFields().then(() => {
        if (!this.inputCheck()) {
          return
        }
        const data = this.getData()
        this.addService.setPrice(data).subscribe(this.onSaveSuccess)
      })
    },
    onSaveSuccess() {
      this.messageService.success({
        content: '提交成功'
      })
      this.$router.push({
        name: 'brand-product-course-personal-list-brand'
      })
    },
    getPriceGradient() {
      const ret = []
      const { tableData } = this
      tableData.forEach(item => {
        ret.push({
          level_id: item.level_id,
          min_sale: item.min_sale,
          max_sale: item.max_sale,
          price: item.price,
          transfer_num: item.transfer_num,
          transfer_unit: item.transfer_unit
        })
      })
      return ret
    },
    onChange(e) {
      this.priceSetting = e.target.value
    },
    setFieldsValue() {
      const info = this.info
      this.form.setFieldsValue({
        course_name: info.course_name,
        price_setting: info.price_setting,
        sell_type: info.sell_type,
        effective_unit: info.effective_unit
      })
      this.priceSetting = info.price_setting
      this.singleReserve = info.single_reserve
      this.singlePrice = info.single_price
      this.priceGradient = info.price_gradient
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
      const priceSetting = this.form.getFieldValue('price_setting')

      /**
       * 自主定价直接过校验
       */
      if (priceSetting === PRICE_SETTING.SHOP_PRICE) {
        return true
      }
      if (priceSetting === PRICE_SETTING.UNIFORM_PRICE) {
        return this.gradientService.check(this.priceGradient)
      }
    },
    getData() {
      const data = this.form.getFieldsValue()
      data.course_id = +this.$searchQuery.id
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
