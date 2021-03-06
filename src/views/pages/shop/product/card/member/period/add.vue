<template>
  <st-mina-panel class="page-shop-basic-card page-shop-add-period-card">
    <h5-container slot="preview" fixed>
      <template v-slot:title>
        购卡
      </template>
      <template v-slot:default>
        <member-card
          :data="h5CardInfo"
          :cardType="MEMBER_CARD.PERIOD_CARD"
          :isAdd="true"
        ></member-card>
      </template>
    </h5-container>

    <div slot="actions">
      <st-button
        :loading="addLoading.addCard"
        type="primary"
        @click="onHandleSubmit"
      >
        保 存
      </st-button>
    </div>

    <div class="page-content">
      <st-form :form="form" labelWidth="118px">
        <st-form-item
          class="page-content-card-line"
          label="期限卡名称"
          required
        >
          <a-input
            v-decorator="decorators.card_name"
            maxlength="30"
            class="page-content-card-input"
            placeholder="请输入期限卡名称"
            @change="syncName"
          ></a-input>
        </st-form-item>
        <st-form-item class="page-content-card-line" label="特别说明">
          <a-input
            class="page-content-card-input"
            maxlength="20"
            v-decorator="decorators.special_note"
            placeholder="最多显示20个字符"
            @change="syncSpecialNote"
          ></a-input>
        </st-form-item>
        <st-hr class="mg-y32"></st-hr>
        <a-row :gutter="8" v-if="isFamilyCard">
          <a-col :lg="23">
            <st-form-item
              class="page-content-card-admission-range mg-t4"
              required
            >
              <template slot="label">
                支持入场人数
                <st-help-tooltip id="TBMCDC003" />
              </template>
              <a-select
                v-decorator="decorators.support_member_num"
                placeholder="请选择入场人数"
                class="page-content-card-input"
              >
                <a-select-option
                  v-for="(item, index) in supportMemberNums"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :lg="23">
            <st-form-item class="mg-b16" label="支持入场门店">
              {{ shopName.name }}
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :lg="23">
            <st-form-item
              class="page-content-card-price-setting"
              label="价格设置"
              required
              :help="rallyPriceValidText"
            >
              <div
                class="page-price-setting-set"
                :class="{
                  'page-price-setting-set-error':
                    priceValidateStatus === 'error'
                }"
              >
                {{ rallyPriceValidText }}
                <st-table
                  :columns="priceColumns"
                  :dataSource="rallyPriceList"
                  rowKey="key"
                  :pagination="false"
                >
                  <template slot="time" slot-scope="text, record, index">
                    <st-input-number
                      :min="1"
                      :max="99999"
                      :value="text.num"
                      @change="
                        e =>
                          brandPriceSettingHandleChange({
                            value: e,
                            key: index,
                            col: 'time',
                            prop: 'num'
                          })
                      "
                    >
                      <a-select
                        slot="addonAfter"
                        :value="text.unit"
                        @change="
                          e =>
                            brandPriceSettingHandleChange({
                              value: e,
                              key: index,
                              col: 'time',
                              prop: 'unit'
                            })
                        "
                        style="width: 50px"
                      >
                        <a-select-option
                          v-for="(item, index) in nuit_list"
                          :value="item.value"
                          :key="index"
                        >
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </st-input-number>
                  </template>
                  <template slot="rally_price" slot-scope="text, record, index">
                    <st-input-number
                      :float="true"
                      :min="0"
                      :max="999999.9"
                      @change="
                        e =>
                          brandPriceSettingHandleChange({
                            value: e,
                            key: index,
                            col: 'rally_price'
                          })
                      "
                    >
                      <span slot="addonAfter">元</span>
                    </st-input-number>
                  </template>
                  <template slot="frozen_day" slot-scope="text, record, index">
                    <st-input-number
                      :min="0"
                      :max="99999"
                      @change="
                        e =>
                          brandPriceSettingHandleChange({
                            value: e,
                            key: index,
                            col: 'frozen_day'
                          })
                      "
                    >
                      <span slot="addonAfter">天</span>
                    </st-input-number>
                  </template>
                  <template slot="gift_unit" slot-scope="text, record, index">
                    <st-input-number
                      :min="0"
                      :max="99999"
                      @change="
                        e =>
                          brandPriceSettingHandleChange({
                            value: e,
                            key: index,
                            col: 'gift_unit'
                          })
                      "
                    >
                      <span slot="addonAfter">天</span>
                    </st-input-number>
                  </template>
                  <a
                    slot="operation"
                    slot-scope="text, record, index"
                    href="javascript:;"
                    @click="brand_price_delete(index)"
                  >
                    删除
                  </a>
                </st-table>
                <st-button
                  :disabled="rallyPriceList.length >= 12"
                  type="dashed"
                  icon="add"
                  class="page-price-setting-set__add"
                  block
                  @click="brand_price_add"
                >
                  新增定价规格（{{ rallyPriceList.length }}/12）
                </st-button>
              </div>
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :lg="20">
            <st-form-item class="page-content-card-time" required>
              <span slot="label">
                支持售卖时间
                <a-popover
                  trigger="hover"
                  placement="bottomRight"
                  arrowPointAtCenter
                >
                  <div slot="content">
                    设置此{{ $c('member_card') }}可售卖的时间范围
                  </div>
                  <a-icon
                    class="page-content-card-time__icon"
                    type="info-circle"
                  ></a-icon>
                </a-popover>
              </span>
              <a-form-item class="page-a-form">
                <a-date-picker
                  :disabledDate="disabledStartDate"
                  v-decorator="decorators.start_time"
                  format="YYYY-MM-DD"
                  placeholder="开始时间"
                  :showToday="false"
                  @openChange="handleStartOpenChange"
                  @change="start_time_change"
                />
              </a-form-item>
              &nbsp;~&nbsp;
              <a-form-item class="page-a-form">
                <a-date-picker
                  :disabledDate="disabledEndDate"
                  v-decorator="decorators.end_time"
                  format="YYYY-MM-DD"
                  placeholder="结束时间"
                  :showToday="false"
                  :open="endOpen"
                  @openChange="handleEndOpenChange"
                  @change="end_time_change"
                />
              </a-form-item>
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :lg="20">
            <st-form-item class="page-content-card-transfer" label="转让设置">
              <div class="page-content-card-transfer-body">
                <a-checkbox class="page-checkbox" @change="transfer">
                  支持转让
                </a-checkbox>
                <st-input-number
                  v-decorator="decorators.transferNum"
                  class="page-input-group page-content-card-num-input"
                  :float="transferUnit === UNIT.RMB"
                  @change="transfter_change"
                  :disabled="!is_transfer"
                  :min="transferMin"
                  :max="transferMax"
                >
                  <a-select
                    slot="addonAfter"
                    v-model="transferUnit"
                    :disabled="!is_transfer"
                  >
                    <a-select-option
                      v-for="item in unit"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </st-input-number>
              </div>
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :lg="20">
            <st-form-item
              class="page-content-card-sell-type"
              label="售卖方式"
              required
            >
              <a-checkbox-group v-model="sell_type">
                <a-checkbox
                  v-for="item in sellTypeList"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-checkbox>
              </a-checkbox-group>
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :lg="20">
            <st-form-item
              class="page-content-card-bg"
              label="卡背景"
              required
              :help="cardBgValidatorText"
            >
              <card-bg-radio
                @change="onCardBgChange"
                v-model="cardBg"
                :isFamilyCard="isFamilyCard"
              />
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :lg="22">
            <st-form-item
              class="page-content-card-introduction "
              :label="`${$c('member_card')}介绍`"
            >
              <st-editor v-model="cardIntroduction"></st-editor>
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :lg="22">
            <st-form-item class="page-content-card-contents " label="内部备注">
              <st-textarea
                v-model="cardContents"
                maxlength="500"
                class="page-content-card-textarea"
                placeholder="请输入"
              />
            </st-form-item>
          </a-col>
        </a-row>
      </st-form>
    </div>
  </st-mina-panel>
</template>
<script>
import { UserService } from '@/services/user.service'
import moment from 'moment'
import { PatternService } from '@/services/pattern.service'
import { cloneDeep, remove } from 'lodash-es'
import { AddService } from './add.service'
import MemberCard from '@/views/biz-components/h5/pages/member-card'
import H5Container from '@/views/biz-components/h5/h5-container'
import { MEMBER_CARD } from '@/views/biz-components/h5/pages/member-card.config'
import h5mixin from './h5mixin'
import CardBgRadio from '@/views/biz-components/card-bg-radio/card-bg-radio'
import { SELL_TYPE, UNIT, CARD_TYPE } from '@/constants/card/member'
import { ruleOptions } from './period.config'
import StEditor from '@/views/components/editor#/editor.vue'
export default {
  name: 'PageShopPeriodCardAdd',
  mixins: [h5mixin],
  components: {
    StEditor,
    MemberCard,
    H5Container,
    CardBgRadio
  },
  serviceInject() {
    return {
      pattern: PatternService,
      addService: AddService,
      userService: UserService
    }
  },
  rxState() {
    return {
      addLoading: this.addService.loading$,
      shopName: this.userService.shop$,
      cardBgList: this.addService.cardBgList$,
      admissionRange: this.addService.admissionRange$,
      priceSetting: this.addService.priceSetting$,
      supportSales: this.addService.supportSales$,
      unit: this.addService.unit$,
      sellType: this.addService.sellType$,
      supportMemberNums: this.addService.supportMemberNums$
    }
  },
  bem: {
    b: 'st-help-popover'
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      cardType: MEMBER_CARD.PERIOD_CARD,
      SELL_TYPE,
      UNIT,
      MEMBER_CARD,
      // 结束时间面板是否显示
      endOpen: false,
      priceColumns: [
        {
          title: '期限',
          scopedSlots: { customRender: 'time' },
          dataIndex: 'time'
        },
        {
          title: '售价',
          scopedSlots: { customRender: 'rally_price' },
          dataIndex: 'rally_price'
        },
        {
          title: '允许冻结天数',
          scopedSlots: { customRender: 'frozen_day' },
          dataIndex: 'frozen_day'
        },
        {
          title: '赠送上限',
          scopedSlots: { customRender: 'gift_unit' },
          dataIndex: 'gift_unit'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '10%',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      // 价格梯度
      rallyPriceList: [],
      // 价格检验是否通过
      rallyPriceIsOk: true,
      // 价格是否未输入过
      rallyPriceIsNoInput: true,
      // 价格校验文案
      rallyPriceValidText: '',
      nuit_list: [
        {
          value: 2,
          label: '天'
        },
        {
          value: 3,
          label: '月'
        },
        {
          value: 4,
          label: '年'
        }
      ],
      // 售卖时间
      start_time: null,
      end_time: null,
      // 是否支持转让
      is_transfer: false,
      // 转让单位
      transferUnit: UNIT.RMB,
      // 转让手续费
      transferNum: 0,
      // 售卖方式
      sell_type: [SELL_TYPE.OFFLINE],
      // 卡背景
      cardBg: {
        image_id: 0,
        image_key: this.cardBgList[0].image_key,
        image_url: this.cardBgList[0].image_url,
        index: 1
      },
      // 卡背景的help文本
      cardBgValidatorText: '',
      // 卡介绍
      cardIntroduction: '',
      // 备注
      cardContents: '',
      // 是否配置了用户端
      appConfig: true
    }
  },
  methods: {
    // 保存
    onHandleSubmit(e) {
      this.form.validateFieldsAndScroll((err, values) => {
        this.validatePrice()
        this.cardBgValidator()
        if (!err && this.priceValidateStatus === 'success' && this.cardBgIsOk) {
          let unit = this.is_transfer ? this.transferUnit : undefined
          let num = this.is_transfer ? this.transferNum : undefined
          let price_gradient = []
          this.rallyPriceList.forEach(i => {
            price_gradient.push({
              id: 0,
              unit: +i.time.unit,
              num: +i.time.num,
              rally_price: +i.rally_price,
              frozen_day: +i.frozen_day,
              gift_unit: +i.gift_unit
            })
          })
          this.addService
            .addCard({
              card_type: this.isFamilyCard
                ? CARD_TYPE.MORE_PERIOD
                : CARD_TYPE.PERIOD,
              card_name: values.card_name,
              special_note: values.special_note,
              start_time: `${this.start_time.format('YYYY-MM-DD')}`,
              end_time: `${this.end_time.format('YYYY-MM-DD')}`,
              is_transfer: +this.is_transfer,
              unit,
              num,
              sell_type: this.sell_type,
              card_introduction: this.cardIntroduction,
              card_contents: this.cardContents,
              card_bg: this.cardBg,
              price_gradient,
              support_member_num: this.isFamilyCard
                ? values.support_member_num
                : 1
            })
            .subscribe(res => {
              // 新增成功
              this.$router.push({
                name: 'shop-product-card-member-list-all'
              })
            })
        }
      })
    },
    // 价格梯度
    brandPriceSettingHandleChange({ value, key, col, prop }) {
      this.rallyPriceIsNoInput = false
      if (prop !== undefined) {
        this.rallyPriceList[key][col][prop] = value
      } else {
        this.rallyPriceList[key][col] = value
      }
    },
    // 删除价格
    brand_price_delete(index) {
      this.rallyPriceList.splice(index, 1)
    },
    // 增加价格
    brand_price_add() {
      let key = parseInt(Math.random() * 999999).toString()
      this.rallyPriceList.push({
        key,
        time: {
          unit: 2,
          num: null
        },
        rally_price: null,
        frozen_day: null,
        gift_unit: null
      })
    },
    // 开始时间
    disabledStartDate(startValue) {
      const endValue = this.end_time
      if (!endValue) {
        // 结束时间未选择
        return (
          startValue.valueOf() <
          moment()
            .startOf('day')
            .valueOf()
        )
      }
      let start =
        endValue.valueOf() >
        moment()
          .add(30, 'y')
          .valueOf()
          ? moment(endValue)
              .subtract(30, 'y')
              .valueOf()
          : moment()
              .startOf('day')
              .valueOf()
      return (
        startValue.valueOf() < start ||
        startValue.valueOf() > moment(endValue).valueOf()
      )
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    start_time_change(data) {
      this.start_time = cloneDeep(data)
    },
    // 结束时间
    disabledEndDate(endValue) {
      const startValue = this.start_time
      if (!startValue) {
        // 开始时间未选择
        return (
          endValue.valueOf() <
          moment()
            .startOf('day')
            .valueOf()
        )
      }
      return (
        endValue.valueOf() >=
          moment(startValue)
            .add(30, 'y')
            .valueOf() ||
        endValue.valueOf() < moment(startValue).valueOf() ||
        endValue.valueOf() <
          moment()
            .startOf('day')
            .valueOf()
      )
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    },
    end_time_change(data) {
      this.end_time = cloneDeep(data)
    },
    // 转让
    transfer(e) {
      this.is_transfer = e.target.checked
      // 重置转让费用的校验
      this.form.resetFields(['transferNum'])
    },
    transfter_change(data) {
      this.transferNum = data
    },
    // moment
    moment,
    // 检验price
    validatePrice() {
      this.rallyPriceIsNoInput = false
      if (!this.priceValidateRuleText.length) {
        this.rallyPriceIsOk = false
      } else {
        this.rallyPriceIsOk = this.priceValidateRuleText.every(i => {
          return this.pattern.NUM_FLOAT(1).test(i)
        })
      }
    },
    onCardBgChange(e) {
      this.cardBgValidatorText = ''
    },
    // 卡背景校验
    cardBgValidator() {
      let validata = this.cardBg.image_key !== ''
      this.cardBgValidatorText = validata ? '' : '请上传卡背景'
    }
  },
  watch: {
    priceValidateStatus(newVal) {
      this.rallyPriceValidText = newVal === 'success' ? '' : '请输入正确的数值'
    },
    transferUnit: {
      deep: true,
      handler() {
        this.form.resetFields(['transferNum'])
      }
    }
  },
  computed: {
    priceValidateStatus() {
      if (this.rallyPriceIsNoInput) {
        return 'success'
      } else {
        return this.rallyPriceIsOk ? 'success' : 'error'
      }
    },
    priceValidateRuleText() {
      let text = []
      this.rallyPriceList.forEach(i => {
        Object.keys(i).forEach(o => {
          if (o !== 'key' && o !== 'time' && o !== '$_oddEvenKey') {
            text.push(i[o])
          } else if (o === 'time') {
            text.push(i[o].num)
          }
        })
      })
      return text
    },
    // 售卖方式
    sellTypeList() {
      let sell_type = cloneDeep(this.sellType)
      let arr = []
      sell_type.forEach(i => {
        arr.push({
          value: i.value,
          label: i.label
        })
      })
      if (!this.appConfig) {
        remove(arr, i => i.value === SELL_TYPE.CLIENT)
      }
      return arr
    },
    // 卡背景是否校验通过
    cardBgIsOk() {
      return this.cardBgValidatorText === ''
    },
    // 转让设置的min
    transferMin() {
      return 0
    },
    // 转让设置的max
    transferMax() {
      return this.transferUnit === UNIT.PERCENT ? 100 : 999999.9
    },
    // 是否是多人卡
    isFamilyCard() {
      return this.$searchQuery.type === 'family-card'
    }
  }
}
</script>
