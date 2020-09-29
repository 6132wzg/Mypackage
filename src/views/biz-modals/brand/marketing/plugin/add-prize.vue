<template>
  <st-modal title="奖品设置" v-model="show" @ok="onSubmit">
    <st-form :form="form" labelGutter="0" labelWidth="84px">
      <st-form-item label="奖品名称" required>
        <a-input
          placeholder="请输入奖品名称"
          :disabled="id && status === 1"
          v-decorator="decorators.prize_name"
        ></a-input>
      </st-form-item>
      <st-form-item label="奖品类型" required>
        <a-radio-group
          v-decorator="decorators.prize_type"
          @change="getCurPrizeType"
        >
          <template v-for="(item, index) in prizeType">
            <a-radio
              :key="index"
              :value="item.value"
              :disabled="
                item.value === 4 && pluginStatus.pointActivityAtatus !== 1
              "
            >
              {{ item.label }}
              <template
                v-if="
                  item.value === 4 && pluginStatus.pointActivityAtatus !== 1
                "
              >
                <span :class="basic('point-condition-tips')">
                  请先开启会员积分功能，
                </span>
                <st-link
                  _blank
                  :class="basic('integral-condition-link')"
                  value="去开启"
                  :to="{
                    path: '/brand/marketing/plugin/member-points/list/setting'
                  }"
                ></st-link>
              </template>
            </a-radio>
          </template>
        </a-radio-group>
        <div class="mg-t12">
          <a-select
            @select="getCurCouponShops"
            v-if="curPrizeType === PRIZE_TYPE.DEFAULT"
            placeholder="请选择优惠券"
            v-decorator="decorators.coupon_id"
          >
            <a-select-option
              v-for="(item, index) in couponList"
              :key="index"
              :value="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
          <span v-else-if="curPrizeType === PRIZE_TYPE.POINTS">
            获得
            <st-input-number
              type="number"
              :min="1"
              :max="99999"
              :step="1"
              :precision="0"
              style="width: 150px"
              placeholder="请输入"
              v-decorator="decorators.prize_points"
            >
              <template slot="addonAfter">
                积分
              </template>
            </st-input-number>
          </span>
          <span v-else>
            获得当日起
            <a-input-number
              :min="1"
              :max="999"
              :step="1"
              :precision="0"
              class="width100px"
              placeholder="输入天数"
              v-decorator="decorators.valid_days"
            ></a-input-number>

            天内有效
          </span>
        </div>
      </st-form-item>
      <st-form-item
        label="兑换门店"
        v-if="curPrizeType === PRIZE_TYPE.CUSTOM"
        required
      >
        <a-radio-group
          v-decorator="decorators.is_shop_range"
          @change="getCurShopType"
        >
          <a-radio v-for="item in shops" :key="item.value" :value="item.value">
            {{ item.label }}
          </a-radio>
        </a-radio-group>
        <select-shop
          :shopIds="shopIds"
          v-if="curShopType === 2"
          @change="onChangeShopSetting"
        ></select-shop>
      </st-form-item>
      <st-form-item label="奖品数量" required>
        <st-input-number
          :min="1"
          :max="999999"
          :step="1"
          :precision="0"
          placeholder="请输入奖品数量"
          v-decorator="decorators.number"
        >
          <span slot="addonAfter">个</span>
        </st-input-number>
      </st-form-item>
      <st-form-item label="中奖概率" required>
        <st-input-number
          :min="0"
          :max="100"
          :float="true"
          placeholder="请输入中奖概率"
          v-decorator="decorators.rate"
        >
          <span slot="addonAfter">%</span>
        </st-input-number>
      </st-form-item>
      <st-form-item label="奖品图片">
        <a-radio-group
          v-decorator="decorators.image_default"
          @change="getCurImgType"
        >
          <a-radio
            v-for="(item, index) in imgType"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
        <div v-if="curImgType === 2" class="prize-upload">
          <st-image-upload
            :list="fileList"
            width="96px"
            height="96px"
            @change="onChangeGetAvatar"
            :sizeLimit="2"
            placeholder="上传图片"
          ></st-image-upload>
          <div class="prize-upload-text">请上传jpg、png格式的图片</div>
        </div>
        <div v-else>
          <img
            :src="defaultPrizeImg.image_url"
            alt="默认图片"
            class="default-img"
          />
        </div>
      </st-form-item>
    </st-form>
  </st-modal>
</template>
<script>
import { AddPrizeService } from './add-prize.service'
import { ruleOptions } from './add-prize.config.ts'
import { PatternService } from '@/services/pattern.service'
import StImageUpload from '@/views/components/image-upload#/image-upload.vue'
import { cloneDeep } from 'lodash-es'
import SelectShop from '@/views/fragments/shop/select-shop.vue'
import { IMG_TYPE, SHOP_TYPE, PRIZE_TYPE } from '@/constants/marketing/lottery'
import { MessageService } from '@/services/message.service'
export default {
  name: 'BrandMarketingPoster',
  bem: {
    basic: 'brand-marketing-prize'
  },
  serviceInject() {
    return {
      addPrizeService: AddPrizeService,
      pattern: PatternService,
      messageService: MessageService
    }
  },

  rxState() {
    return {
      shops: this.addPrizeService.shops$,
      prizeType: this.addPrizeService.prizeType$,
      imgType: this.addPrizeService.imgType$,
      prize: this.addPrizeService.prize$,
      pluginStatus: this.addPrizeService.pluginStatus$
    }
  },
  props: {
    info: {
      type: Object
    },
    id: {
      type: String
    },
    status: {
      type: Number
    }
  },
  computed: {
    defaultPrizeImg() {
      if (
        this.curPrizeType === this.PRIZE_TYPE.POINTS &&
        this.prize[1] &&
        this.prize[1].image_url
      ) {
        return this.prize[1]
      }
      return this.prize[0]
    }
  },
  data(vm) {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      IMG_TYPE,
      PRIZE_TYPE,
      SHOP_TYPE,
      show: false,
      shopIds: [],
      shopNum: 0,
      fileList: [],
      couponList: [],
      curPrizeType: PRIZE_TYPE.CUSTOM,
      curImgType: IMG_TYPE.DEFAULT,
      curShopType: SHOP_TYPE.CUSTOM
    }
  },
  mounted() {
    if (this.info) {
      this.form.setFieldsValue({
        prize_name: this.info.prize_name,
        prize_type: this.info.prize_type,
        coupon_id: this.info.coupon_id,
        prize_id: this.info.prize_id,
        activity_prize_id: this.info.activity_prize_id,
        is_shop_range: this.info.is_shop_range,
        support_shop_ids: this.info.support_shop_ids,
        rate: this.info.rate,
        number: this.info.number,
        image: this.info.image,
        image_default: this.info.image_default
      })
    }
  },
  created() {
    this.getCouponList()
    if (this.info) {
      this.curImgType = this.info.image_default
      this.curPrizeType = this.info.prize_type
      this.fileList[0] = this.info.prize
      this.shopIds = this.info.support_shop_ids
    }
    this.addPrizeService.getPluginList().subscribe()
  },
  components: { SelectShop, StImageUpload },
  methods: {
    getCurCouponShops(e) {
      this.couponList.filter(item => {
        if (item.id === e) {
          this.shopNum = item.shop_num
        }
      })
    },
    onChangeShopSetting(val) {
      this.shopIds = val
    },
    getCouponList() {
      let coupon_id = this.info ? this.info.coupon_id : 0
      return this.addPrizeService.getCouponList(coupon_id).subscribe(res => {
        this.couponList = res.list
      })
    },
    onChangeGetAvatar(imageFiles) {
      this.fileList = cloneDeep(imageFiles)
    },
    getCurPrizeType(e) {
      this.curPrizeType = e.target.value
    },
    getCurShopType(e) {
      this.curShopType = e.target.value
    },
    getCurImgType(e) {
      this.curImgType = e.target.value
    },
    onSubmit() {
      if (
        this.curPrizeType === this.PRIZE_TYPE.CUSTOM &&
        this.shopIds.length === 0
      ) {
        this.messageService.warn({
          content: '请选择门店'
        })
        return
      }
      this.form.validate().then(value => {
        value.prize =
          this.curImgType === this.IMG_TYPE.CUSTOM
            ? this.fileList[0] || this.defaultPrizeImg
            : this.defaultPrizeImg
        value.support_shop_ids = this.shopIds
        value.shop_num = this.shopNum
        value.prize_id = this.info ? this.info.prize_id : 0
        value.activity_prize_id = this.info ? this.info.activity_prize_id : 0
        if (this.curPrizeType === this.PRIZE_TYPE.DEFAULT && !value.coupon_id) {
          this.messageService.warn({
            content: '请选择优惠券'
          })
          return
        }
        if (
          this.curPrizeType === this.PRIZE_TYPE.POINTS &&
          !value.prize_points
        ) {
          this.messageService.warn({
            content: '请输入积分数量'
          })
          return
        }
        this.$emit('change', value)
        this.show = false
      })
    }
  }
}
</script>
