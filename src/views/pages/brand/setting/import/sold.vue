<template>
  <st-panel app>
    <import-tip></import-tip>
    <div :class="bHeader()">
      <st-t2>
        导入售出
      </st-t2>
      <label :class="bHeader('desc')">售出的卡、课记录</label>
    </div>
    <div>
      请选择需要导入的门店:
      <a-select
        placeholder="请选择门店"
        class="select"
        v-model="shopId"
        :allowClear="true"
      >
        <a-select-option
          v-for="(item, index) in shopList"
          :value="+item.shop_id"
          :key="index"
        >
          {{ item.shop_name }}
        </a-select-option>
      </a-select>
    </div>
    <p class="page-tip">
      请选择一项需要导入的内容，下载对应模板
    </p>
    <a-radio-group v-model="selectedValue">
      <div :class="bTable()">
        <div :class="bTable('left')">{{ $c('member_card') }}</div>
        <div :class="bTable('right')">
          <div :class="bTable('content')">
            <a-radio :value="IMPORT.SOLD_MEMBER_CARD">
              {{ $c('member_card') }}
            </a-radio>
            <label :class="bTable('desc')">
              包含期卡和次卡——默认不限制入场时间
            </label>
          </div>
          <div :class="bTable('content')">
            <a-radio :value="IMPORT.FAMILY_CARD">
              多人{{ $c('member_card') }}
            </a-radio>
            <label :class="bTable('desc')">
              包含期卡和次卡——默认不限制入场时间
            </label>
          </div>
          <div :class="bTable('content')">
            <a-radio :value="IMPORT.SOLD_MEMBER_CARD_ENTER_TIME">
              <span>{{ $c('member_card') }}入场时间</span>
            </a-radio>
            <label :class="bTable('desc')">
              售出的{{ $c('member_card') }}限制入场时间，请批量导入入场时间
            </label>
          </div>
        </div>
      </div>
      <a-row :class="bTable()">
        <div :class="bTable('left')">储值卡</div>
        <div :class="bTable('content')">
          <a-radio :value="IMPORT.SOLD_DEPOSIT">储值卡</a-radio>
          <label :class="bTable('desc')">
            全部售出信息
          </label>
        </div>
      </a-row>
      <a-row :class="bTable()">
        <div :class="bTable('left')">私教课</div>
        <div :class="bTable('content')">
          <a-radio :value="IMPORT.SOLD_PERSONAL_COURSE">私教课</a-radio>
        </div>
      </a-row>
      <a-row :class="bTable()">
        <div :class="bTable('left')">课程包</div>
        <div :class="bTable('right')">
          <div :class="bTable('content')">
            <a-radio :value="IMPORT.SOLD_PACKAGE">限定范围课程包</a-radio>
            <label :class="bTable('desc')">
              仅限：团课X次，私教课X次的课程包
            </label>
          </div>
          <div :class="bTable('content')">
            <a-radio :value="IMPORT.SOLD_RANGE_PACKAGE">
              范围课程包
            </a-radio>
            <label :class="bTable('desc')">
              仅限：团课&私教课共X次的课程包&不限次课程包
            </label>
          </div>
        </div>
      </a-row>
      <a-row :class="[bTable(), ' bottom-line']">
        <div :class="bTable('left')">租赁柜</div>
        <div :class="bTable('content')">
          <a-radio :value="IMPORT.SOLD_LEASE">租赁柜</a-radio>
          <label :class="bTable('desc')">
            导入前请预先设置柜子所在区域和柜号
            <!-- TODO: 现在不支持跳转 -->
            <!-- <router-link
              :to="{
                path: `/shop/setting/cabinet?id=${shopId}`
              }"
            >
              设置{{ shopId }}
            </router-link> -->
          </label>
        </div>
      </a-row>
    </a-radio-group>
    <div class="page-footer">
      <st-button type="primary" class="download" @click="fetchDownloadFileInfo">
        下载模板
      </st-button>
      <st-button @click="uploadFile">上传文件</st-button>
    </div>
  </st-panel>
</template>
<script>
import { IMPORT } from '@/constants/setting/import'
import { ImportService } from '../import.service'
import BrandSettingImport from '@/views/biz-modals/brand/setting/import.vue'
import { UserService } from '@/services/user.service'
import ImportTip from './components#/import-tip'
import { MessageService } from '@/services/message.service'

export default {
  bem: {
    bHeader: 'page-header',
    bTable: 'page-table-row'
  },
  modals: {
    BrandSettingImport
  },
  serviceInject() {
    return {
      importService: ImportService,
      messageService: MessageService,
      userService: UserService
    }
  },
  rxState() {
    return {
      shopList: this.userService.shopList$
    }
  },
  components: {
    ImportTip
  },
  data() {
    return {
      IMPORT,
      selectedValue: IMPORT.SOLD_MEMBER_CARD,
      shopId: undefined
    }
  },
  methods: {
    fetchDownloadFileInfo() {
      this.importService
        .fetchDownloadFileInfo(this.selectedValue)
        .subscribe(res => {
          window.open(res.url)
        })
    },
    uploadFile() {
      if (!this.shopId) {
        this.messageService.error({
          content: '请选择门店'
        })
        return
      }
      this.$modalRouter.push({
        name: 'brand-setting-import',
        props: {
          type: this.selectedValue,
          shopId: this.shopId
        },
        on: {
          success: () => {
            this.$router.push({
              path: '/brand/setting/import/record'
            })
          }
        }
      })
    }
  }
}
</script>
