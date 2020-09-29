<template>
  <st-panel app class="page-brand-shop-add">
    <st-form :form="form">
      <a-row :gutter="8" class="page-add-shop-name-row">
        <a-col :lg="10" :xs="22" :offset="1">
          <st-form-item label="门店名称" required>
            <a-input
              v-decorator="[
                'shop_name',
                { rules: [{ validator: shop_name_validator }] }
              ]"
              maxlength="20"
              placeholder="支持中英文、数字,不超过20个字"
            ></a-input>
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col :lg="10" :xs="22" :offset="1">
          <st-form-item
            label="门店电话"
            required
            :help="shopPhoneValidateText"
            :validateStatus="shopPhoneValidateText ? 'error' : ''"
          >
            <more-input
              :length="3"
              :list="shopData.shop_phones"
              @change="onShopPhoneChange"
              placeholder="请输入门店电话"
            ></more-input>
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col :lg="10" :xs="22" :offset="1">
          <st-form-item
            validateStatus="error"
            :help="shopMapValidateText"
            label="门店地址"
            required
          >
            <map-button
              :lat="addMap.lat"
              :lng="addMap.lng"
              :address="addMap.address"
              :province="addMap.province"
              :city="addMap.city"
              :district="addMap.district"
              @select="addMapChange"
            ></map-button>
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col :lg="10" :xs="22" :offset="1">
          <st-form-item label="邮箱">
            <a-input
              v-decorator="[
                'email',
                {
                  rules: [
                    {
                      type: 'email',
                      message: '输入的邮箱格式错误，请重新输入!'
                    }
                  ]
                }
              ]"
              placeholder="请输入门店邮箱"
            ></a-input>
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col offset="1" :lg="23">
          <st-form-item label="服务设施">
            <checkbox-facility-group v-model="shopData.service_ids">
              <checkbox-facility-item
                style="margin-right:24px"
                v-for="item in serviceList"
                :label="item.service_name"
                :icon="serviceIcon_icon_list[item.service_id]"
                :key="item.service_id"
                :value="item.service_id"
              ></checkbox-facility-item>
            </checkbox-facility-group>
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col offset="1" :lg="23">
          <st-form-item
            label="店招"
            required
            validateStatus="error"
            :help="shopCoverImageValidateText"
          >
            <st-image-upload
              :sizeLimit="5"
              :list="fileList"
              @change="fileChange"
              width="240px"
              height="135px"
              placeholder="上传门店照片"
              description="大小不超过5M，建议尺寸16:9"
              :cropperModal="{
                title: '门店图片裁切',
                cropper: { aspectRatio: 16 / 9 }
              }"
            ></st-image-upload>
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col offset="1" :lg="23">
          <st-form-item>
            <template slot="label">
              营业状态
              <st-help-tooltip id="TBCS001" />
            </template>
            <a-radio-group v-model="shopData.shop_status">
              <a-radio
                v-for="item in shop_status_add"
                :key="+item.value"
                :value="+item.value"
              >
                {{ item.label }}
              </a-radio>
            </a-radio-group>
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col offset="1" :lg="22">
          <st-form-item label="营业时间">
            <shop-hour-picker
              v-model="shopData.business_time"
            ></shop-hour-picker>
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col :lg="10" :xs="22" :offset="1">
          <st-form-item label="到期时间" required>
            <a-select
              placeholder="请选择到期时间"
              v-decorator="[
                'buy_shop_id',
                { rules: [{ required: true, message: '请选择到期时间' }] }
              ]"
            >
              <a-select-option
                v-for="(item, index) in unusedShops"
                :key="index"
                :value="item.buy_shop_id"
              >
                {{ item.expire_time }}
              </a-select-option>
            </a-select>
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col :lg="10" :xs="22" :offset="1">
          <st-form-item label=" ">
            <st-button
              type="primary"
              @click="onHandleSubmit"
              :loading="addLoading.save"
            >
              提交
            </st-button>
          </st-form-item>
        </a-col>
      </a-row>
    </st-form>
  </st-panel>
</template>
<script>
import { UserService } from '@/services/user.service'
import { AddService } from './add.service'
import { cloneDeep } from 'lodash-es'
import { PatternService } from '@/services/pattern.service'
import { MessageService } from '@/services/message.service'
import CheckboxFacilityGroup from '@/views/biz-components/checkbox-facility/checkbox-facility-group'
import CheckboxFacilityItem from '@/views/biz-components/checkbox-facility/checkbox-facility-item'
import MapButton from '@/views/components/map-button#/map-button'
import ShopHourPicker from '@/views/components/hour-picker#/hour-picker'
import StImageUpload from '@/views/components/image-upload#/image-upload.vue'
import MoreInput from '@/views/components/more-input#/more-input.vue'

export default {
  components: {
    CheckboxFacilityGroup,
    CheckboxFacilityItem,
    MapButton,
    ShopHourPicker,
    StImageUpload,
    MoreInput
  },
  serviceInject() {
    return {
      pattern: PatternService,
      addService: AddService,
      userService: UserService,
      messageService: MessageService
    }
  },
  rxState() {
    return {
      serviceList: this.addService.serviceList$,
      addLoading: this.addService.loading$,
      shop_status_add: this.userService.getOptions$('shop.shop_status_add'),
      unusedShops: this.addService.unusedShops$
    }
  },
  data() {
    return {
      shopData: {
        shop_name: '',
        province_id: null,
        city_id: null,
        district_id: null,
        address: '',
        shop_phones: [],
        shop_status: 2,
        lat: '',
        lng: '',
        service_ids: [],
        business_time: [],
        email: '',
        shop_cover_image: '',
        buy_shop_id: -1
      },
      addMap: {
        lat: '',
        lng: '',
        address: '',
        province: {},
        city: {},
        district: {}
      },
      shopMapValidateText: '',
      // 服务
      serviceIcon_icon_list: {
        1: 'WIFI',
        2: 'park',
        3: 'shower',
        4: 'medical',
        5: 'heating',
        6: 'snow',
        7: 'nosmoking',
        8: 'energy'
      },
      fileList: [],
      shopCoverImageValidateText: '',
      shopPhoneValidateText: ''
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  computed: {
    shopCoverImageIsOk() {
      return this.shopCoverImageValidateText === ''
    },
    shopMapIsOk() {
      return this.shopMapValidateText === ''
    }
  },
  methods: {
    fileChange(data) {
      if (data.length) {
        this.shopData.shop_cover_image = data[0].image_key
      } else {
        this.shopData.shop_cover_image = ''
      }
      this.shopCoverImageValidator()
    },
    addMapChange(data) {
      this.addMap = cloneDeep(data)
      this.shopData.province_id = data.province.id
      this.shopData.province_name = data.province.name
      this.shopData.city_id = data.city.id
      this.shopData.city_name = data.city.name
      this.shopData.district_id = data.district.id
      this.shopData.district_name = data.district.name
      this.shopData.address = data.address
      this.shopData.lat = data.lat
      this.shopData.lng = data.lng
      this.shopMapValidator()
    },
    onShopPhoneChange(list) {
      this.shopData.shop_phones = list
      this.shopPhoneValidator()
    },
    // 校验门店电话是否输入
    shopPhoneValidator() {
      const length = this.shopData.shop_phones.filter(i => i).length
      this.shopPhoneValidateText = length ? '' : '请输入门店电话'
      return this.shopPhoneValidateText
    },
    // 表单提交
    onHandleSubmit(e) {
      // 确认为提交表单校验
      e.preventDefault()
      this.shopCoverImageValidator()
      this.shopMapValidator()
      this.form.validateFieldsAndScroll((err, values) => {
        if (this.shopPhoneValidator()) {
          return
        }
        if (!err && this.shopCoverImageIsOk && this.shopMapIsOk) {
          // 过滤空数据
          this.shopData.shop_phones = this.shopData.shop_phones.filter(i => i)
          this.shopData.shop_name = values.shop_name
          this.shopData.email = values.email
          this.shopData.buy_shop_id = values.buy_shop_id
          this.addService.save(this.shopData).subscribe(this.onSubmitSuccess)
        }
      })
    },
    onSubmitSuccess() {
      this.messageService.success({
        content: '新增成功'
      })
      this.$router.push({
        name: 'brand-setting-shop-list'
      })
    },
    // shop_name validatorFn
    shop_name_validator(rule, value, callback) {
      if (value === undefined || !value) {
        // eslint-disable-next-line
        callback('请填写门店名称')
      } else if (value && !this.pattern.CN_EN_NUM_SPACE('1-20').test(value)) {
        // eslint-disable-next-line
        callback('支持中英文、数字,不超过20个字')
      } else {
        // eslint-disable-next-line
        callback()
      }
    },
    // 校验店招是否已上传
    shopCoverImageValidator() {
      this.shopCoverImageValidateText = this.shopData.shop_cover_image
        ? ''
        : '请上传店招'
    },
    // 校验地址
    shopMapValidator() {
      this.shopMapValidateText = this.shopData.lat ? '' : '请选择门店地址'
    }
  }
}
</script>
