<template>
  <st-panel app>
    <import-tip></import-tip>
    <div :class="bHeader()">
      <st-t2>
        导入商品
      </st-t2>
      <label :class="bHeader('desc')">卡、课都属于商品</label>
    </div>
    <p class="page-tip">
      请选择一项需要导入的内容，下载对应模板
    </p>
    <a-radio-group v-model="selectedValue">
      <div :class="bTable()">
        <div :class="bTable('left')">{{ $c('member_card') }}</div>
        <div :class="bTable('right')">
          <div :class="bTable('content')">
            <a-radio :value="IMPORT.MEMBER_CARD_BASIC">基础信息</a-radio>
            <label :class="bTable('desc')">
              仅导入{{ $c('member_card') }}基础信息，不导入价格，默认{{
                $c('member_card')
              }}支持单店入场，全门店售卖
            </label>
          </div>
          <div :class="bTable('content')">
            <a-radio :value="IMPORT.MEMBER_CARD_PRICE">价格信息</a-radio>
            <label :class="bTable('desc')">
              {{ $c('member_card') }}的价格信息，请在录入卡基础信息后进行导入
            </label>
          </div>
        </div>
      </div>
      <div :class="bTable()">
        <div :class="bTable('left')">储值卡</div>
        <div :class="bTable('content')">
          <a-radio :value="IMPORT.DEPOSIT">储值卡信息</a-radio>
          <label :class="bTable('desc')">
            默认储值卡卡支持单店消费，全门店售卖
          </label>
        </div>
      </div>
      <div :class="bTable()">
        <div :class="bTable('left')">团体课</div>
        <div :class="bTable('content')">
          <a-radio :value="IMPORT.TEAM_COURSE">团体课信息</a-radio>
          <label :class="bTable('desc')">
            包含团体课所有信息，其中课程类型和目的仅支持导入已设置选项，请预先进行
            <!-- <a :class="bTable('btn')">设置</a> -->
            <router-link
              class="btn"
              :to="{
                path: `/brand/setting/app/course/category`
              }"
              target="_blank"
            >
              设置
            </router-link>
            <st-help-tooltip id="ISS001" />
          </label>
        </div>
      </div>
      <div :class="bTable()">
        <div :class="bTable('left')">私教课</div>
        <div :class="bTable('right')">
          <div :class="bTable('content')">
            <a-radio :value="IMPORT.PERSONAL_BASIC">基础信息</a-radio>
            <label :class="bTable('desc')">
              包含课程名称、课程类型、课程目的、时长等基础信息，其中课程类型和目的仅支持导入已设置选项，请预先进行
              <router-link
                :to="{
                  path: `/brand/setting/app/course/category`
                }"
                target="_blank"
              >
                设置
              </router-link>
            </label>
          </div>
          <div :class="bTable('content')">
            <a-radio :value="IMPORT.PERSONAL_PRICE">价格信息</a-radio>
            <label :class="bTable('desc')">
              私教课的价格信息，请在录入课程基础信息后导入。
            </label>
          </div>
        </div>
      </div>
      <div :class="bTable()">
        <div :class="bTable('left')">课程包</div>
        <div :class="bTable('right')">
          <div :class="bTable('content')">
            <a-radio :value="IMPORT.PACKAGE">课程包信息</a-radio>
            <label :class="bTable('desc')">
              仅限：范围课程-团课&私教课共X次的课程包和不限次课程包
            </label>
          </div>
        </div>
      </div>
      <div :class="[bTable(), ' bottom-line']">
        <div :class="bTable('left')">
          与门店关系
        </div>
        <div :class="bTable('right')">
          <div :class="bTable('content')">
            <a-radio :value="IMPORT.SUPPORT_CONSUME_SHOP">
              <span>支持消费的门店</span>
            </a-radio>
            <label :class="bTable('desc')">
              若{{
                $c('member_card')
              }}、储值卡支持多店消费，或者团体课支持上课门店为多店，请导入卡课支持消费的门店
            </label>
          </div>
          <div :class="bTable('content')">
            <a-radio :value="IMPORT.SUPPORT_SOLD_SHOP">支持售卖的门店</a-radio>
            <label :class="bTable('desc')">
              若{{
                $c('member_card')
              }}、储值卡不支持全门店售卖，或者私教课不支持全门店售卖，请导入卡课支持售卖的门店
            </label>
          </div>
        </div>
      </div>
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
import ImportTip from './components#/import-tip'
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
      importService: ImportService
    }
  },
  rxState() {
    return {}
  },
  data() {
    return {
      IMPORT,
      selectedValue: IMPORT.MEMBER_CARD_BASIC
    }
  },
  components: {
    ImportTip
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
      this.$modalRouter.push({
        name: 'brand-setting-import',
        props: {
          type: this.selectedValue
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
