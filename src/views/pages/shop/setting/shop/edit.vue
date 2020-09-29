<template>
  <st-panel app initial :class="edit()">
    <div :class="edit('head')">
      <p>
        <st-tag class="mg-r8" :type="flagList[info.shop_status]" />
        <st-t2>{{ info.shop_name }}</st-t2>
      </p>
      <p>
        {{ info.shop_position.address_detail }}
        <a class="mg-l12" @click="location">查看定位</a>
      </p>
    </div>
    <st-form labelWidth="117px" :form="form" :class="edit('body')">
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
              :list="shopPhones"
              @change="onShopPhoneChange"
              placeholder="请输入门店电话"
            ></more-input>
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col :lg="10" :xs="22" :offset="1">
          <st-form-item label="邮箱">
            <a-input
              v-decorator="decorators.email"
              placeholder="请输入门店邮箱"
            />
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col offset="1" :lg="23">
          <st-form-item label="服务设施" class="mg-b0">
            <checkbox-facility-group v-model="serviceIds">
              <checkbox-facility-item
                style="margin-right:24px"
                v-for="item in serviceList"
                :label="item.service_name"
                :icon="serviceIconIconList[item.service_id]"
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
            label="门店图片"
            class="st-preview-item"
            v-viewer="{ url: 'data-src', toolbar: false }"
            required
          >
            <ul :class="edit('img-box')">
              <li
                :class="edit('img')"
                class="mg-r12 mg-t12"
                v-for="(item, index) in imgList"
                :key="index"
              >
                <img
                  :data-src="item.image_url | imgFilter({ w: 1000 })"
                  :src="item.image_url | imgFilter({ w: 240, h: 135 })"
                  width="240"
                  height="135"
                  alt="门店图片"
                />
                <st-tag
                  v-if="item.is_cover"
                  class="shop-edit-img-tag"
                  type="shop-sign"
                />
                <p class="shop-edit-img-button mg-b0" v-else>
                  <span class="cursor-pointer" @click="onSetCover(index)">
                    设为店招
                  </span>
                  <span class="cursor-pointer" @click="onDelete(index)">
                    删除
                  </span>
                </p>
              </li>
              <li class="mg-t12" v-if="imgList.length < 20">
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
                <p class="st-des ta-c">可新增20张门店图片</p>
              </li>
            </ul>
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col offset="1" :lg="22">
          <st-form-item label="营业时间">
            <shop-hour-picker v-model="weekTime"></shop-hour-picker>
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col offset="1" :lg="22">
          <st-form-item label=" ">
            <st-button type="primary" :loading="loading.edit" @click="onSubmit">
              提交
            </st-button>
          </st-form-item>
        </a-col>
      </a-row>
    </st-form>
  </st-panel>
</template>
<script>
import { PatternService } from '@/services/pattern.service'
import { EditService } from './edit.service'
import { cloneDeep } from 'lodash-es'
import ShopMapLocation from '@/views/biz-modals/shop/map-location'
import CheckboxFacilityGroup from '@/views/biz-components/checkbox-facility/checkbox-facility-group'
import CheckboxFacilityItem from '@/views/biz-components/checkbox-facility/checkbox-facility-item'
import ShopHourPicker from '@/views/components/hour-picker#/hour-picker'
import StImageUpload from '@/views/components/image-upload#/image-upload'
import MoreInput from '@/views/components/more-input#/more-input.vue'
import { ruleOptions } from './edit.config'

export default {
  name: 'PageShopSettingShopEdit',
  components: {
    CheckboxFacilityGroup,
    CheckboxFacilityItem,
    ShopHourPicker,
    StImageUpload,
    MoreInput
  },
  bem: {
    edit: 'page-shop-setting-shop-edit'
  },
  modals: {
    ShopMapLocation
  },
  serviceInject() {
    return {
      pattern: PatternService,
      editService: EditService
    }
  },
  rxState() {
    return {
      loading: this.editService.loading$,
      serviceList: this.editService.serviceList$,
      info: this.editService.info$
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      flagList: [
        '',
        'shop-trial',
        'shop-opening',
        'shop-stop',
        'shop-close',
        'shop-holiday'
      ],
      shopPhones: [],
      // 服务设施
      serviceIds: [],
      serviceIconIconList: {
        1: 'WIFI',
        2: 'park',
        3: 'shower',
        4: 'medical',
        5: 'heating',
        6: 'snow',
        7: 'nosmoking',
        8: 'energy'
      },
      // 图片
      fileList: [],
      imgList: [],
      cropperModal: {},
      weekTime: [],
      shopPhoneValidateText: ''
    }
  },
  computed: {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.form.setFieldsValue({
        email: this.info.email
      })
      // 电话
      this.shopPhones = cloneDeep(this.info.shop_phones)
      // 服务设施
      this.info.shop_services.forEach(i => {
        this.serviceIds.push(i.service_id)
      })
      // 图片
      this.imgList = cloneDeep(this.info.shop_images)
      // 营业时间
      this.weekTime = cloneDeep(this.info.business_time)
    },
    // 查看定位
    location() {
      this.$modalRouter.push({
        name: 'shop-map-location',
        props: {
          lat: this.info.lat,
          lng: this.info.lng
        }
      })
    },
    // 校验门店电话是否输入
    shopPhoneValidator() {
      const length = this.shopPhones.filter(i => i).length
      this.shopPhoneValidateText = length ? '' : '请输入门店电话'
      return this.shopPhoneValidateText
    },
    onShopPhoneChange(list) {
      this.shopPhones = list
      this.shopPhoneValidator()
    },
    // 图片
    fileChange(data) {
      this.imgList.push({
        image_id: data[0].image_id,
        image_key: data[0].image_key,
        image_url: data[0].image_url,
        is_cover: 0
      })
      this.fileList = []
    },
    // 设为店招
    onSetCover(index) {
      this.imgList.forEach(i => {
        i.is_cover = 0
      })
      this.imgList[index].is_cover = 1
      this.imgList.unshift(...this.imgList.splice(index, 1))
    },
    // 删除图片
    onDelete(index) {
      this.imgList.splice(index, 1)
    },
    // 提交
    onSubmit() {
      // 确认为提交表单校验
      this.form.resetFields(['shopPhone'])
      this.form.validate().then(values => {
        if (this.shopPhoneValidator()) {
          return
        }
        // 过滤空数据
        this.shopPhones = this.shopPhones.filter(i => i)
        this.editService
          .edit({
            shop_phones: this.shopPhones,
            service_ids: this.serviceIds,
            business_time: this.weekTime,
            email: values.email,
            shop_images: this.imgList
          })
          .subscribe(() => {
            this.$router.push({ path: '/shop/setting/shop/info' })
          })
      })
    }
  }
}
</script>
