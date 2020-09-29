<template>
  <st-modal
    v-model="show"
    title="生成课表"
    :class="b()"
    width="864px"
    :footer="null"
  >
    <div :class="b('content')">
      <div :class="b('left')">
        <st-form :form="form">
          <st-form-item label="课表时间">
            <st-switch-week
              :limitWeeks="25"
              @pre="onChangeDate"
              @next="onChangeDate"
            ></st-switch-week>
          </st-form-item>
          <st-form-item label="课表标题" required>
            <a-input
              placeholder="请输入课表名称，不超过10个字"
              required
              :maxLength="10"
              v-decorator="decorators.title"
              @change="changeTitle"
            ></a-input>
          </st-form-item>
          <st-form-item required>
            <template slot="label">
              选择场地
              <st-help-tooltip id="TSKB001"></st-help-tooltip>
            </template>
            <a-select
              mode="multiple"
              placeholder="请选择场地"
              v-decorator="decorators.selected_court"
            >
              <a-select-option
                v-for="court in courtList"
                :key="court.id"
                :value="court.id"
              >
                {{ court.name }}
              </a-select-option>
              <a-select-option :value="0">未关联场地</a-select-option>
            </a-select>
          </st-form-item>
          <st-form-item label="内容展示">
            <a-row :gutter="24">
              <a-col :lg="12">
                门店名称
                <st-switch
                  v-model="tableData.is_show_shop"
                  class="mg-l8"
                ></st-switch>
              </a-col>
              <a-col :lg="12">
                教练昵称
                <st-switch
                  v-model="tableData.is_show_nickname"
                  class="mg-l8"
                ></st-switch>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :lg="12">
                场地名称
                <st-switch
                  v-model="tableData.is_show_court"
                  class="mg-l8"
                ></st-switch>
              </a-col>
              <a-col :lg="12">
                难度等级
                <st-switch
                  v-model="tableData.is_show_strength_level"
                  class="mg-l8"
                ></st-switch>
              </a-col>
            </a-row>
          </st-form-item>
          <st-form-item label="背景图">
            <a-radio-group
              v-model="tableData.is_bgimage"
              @change="changeBgType"
            >
              <a-radio :value="0">默认样式</a-radio>
              <a-radio :value="1">自定义</a-radio>
            </a-radio-group>
          </st-form-item>
          <st-form-item
            class="image-upload"
            label=""
            required
            v-if="tableData.is_bgimage"
            validateStatus="error"
            :help="bgErrorText"
          >
            <st-image-upload
              :sizeLimit="5"
              :list="bgFileList"
              @change="bgFileChange"
              width="240px"
              height="135px"
              placeholder="上传图片"
              description="建议尺寸 16:9，大小不超过5M"
              :cropperModal="{
                title: '门店图片裁切',
                cropper: { aspectRatio: 16 / 9 }
              }"
            ></st-image-upload>
          </st-form-item>
          <st-form-item label="二维码">
            <a-radio-group
              v-model="tableData.is_qrcode"
              @change="changeCodeType"
            >
              <a-radio
                :value="0"
                v-if="tableData.def_qrcode && tableData.def_qrcode.image_url"
              >
                小程序二维码
              </a-radio>
              <a-radio :value="1">自定义</a-radio>
            </a-radio-group>
          </st-form-item>
          <st-form-item
            class="flex-style image-upload"
            label=""
            required
            v-if="tableData.is_qrcode"
            validateStatus="error"
            :help="codeErrorText"
          >
            <a-row :gutter="24">
              <a-col :lg="11">
                <st-image-upload
                  :sizeLimit="2"
                  :list="codeFileList"
                  @change="codeFileChange"
                  width="114px"
                  height="114px"
                  placeholder="上传图片"
                  :cropperModal="{
                    title: '图片裁切',
                    cropper: { aspectRatio: 1 / 1 }
                  }"
                ></st-image-upload>
              </a-col>
              <a-col :lg="13" class="image-tips mg-t24">
                <div class="mg-b8">建议尺寸 1:1</div>
                <div class="st-des">支持jpg、png、bmp格式，大小不超过2M</div>
              </a-col>
            </a-row>
          </st-form-item>
          <st-form-item label="温馨提示">
            <st-textarea
              :autosize="{ minRows: 4, maxRows: 8 }"
              v-model="tableData.prompt_message"
              maxlength="100"
            ></st-textarea>
          </st-form-item>
        </st-form>
      </div>
      <div :class="b('right')">
        <time-table
          :title="title"
          :bgUrl="bgUrl"
          :codeUrl="codeUrl"
          :rangeTime="rangeTime"
          :tableData="tableData"
        ></time-table>
        <div :class="b('footer')" class="mg-t8">
          <st-button
            class="mg-r16"
            @click="saveTimeTable"
            :loading="saveLoading"
          >
            保存设置
          </st-button>
          <st-button
            type="primary"
            @click="downloadTimeTable"
            :loading="loading.getTimeTableList || downLoadLoading"
          >
            下载课表
          </st-button>
        </div>
      </div>
    </div>
  </st-modal>
</template>
<script>
import StImageUpload from '@/views/components/image-upload#/image-upload.vue'
import { ruleOptions } from './time-table.config'
import TimeTable from './time-table/table'
import { TeamTimeTableService } from './time-table.service'
import { TeamScheduleCommonService } from '@/views/pages/shop/product/course/schedule/team/service#/common.service'
import { MessageService } from '@/services/message.service'
import { cloneDeep, omit, pick } from 'lodash-es'
import { ShsService } from '@/services/shs.service'
export default {
  bem: {
    b: 'schedule-team-time-table'
  },
  components: {
    StImageUpload,
    TimeTable
  },
  serviceInject() {
    return {
      teamScheduleCommomService: TeamScheduleCommonService,
      timeTableService: TeamTimeTableService,
      messageService: MessageService,
      shsService: ShsService
    }
  },
  rxState() {
    return {
      loading: this.timeTableService.loading$,
      courtList: this.teamScheduleCommomService.courtOptions$
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false,
      bgFileList: [],
      codeFileList: [],
      title: '', // 课表标题
      bgUrl: '', // 背景图
      codeUrl: '', // 二维码图片
      rangeTime: '', // 时间范围
      tableData: {},
      bgErrorText: '',
      codeErrorText: '',
      startDate: '',
      endDate: '',
      downLoadLoading: false,
      saveLoading: false
    }
  },
  created() {},
  mounted() {
    let weekOfday = moment().format('E') // 今天是本周第几天
    this.startDate = moment()
      .subtract(weekOfday - 1, 'days')
      .format('YYYY-MM-DD') // 周一日期
    this.endDate = moment(this.startDate)
      .add(6, 'days')
      .format('YYYY-MM-DD')
    this.getTimeTableTemplate()
  },
  computed: {
    ruleOptions
  },
  watch: {
    startDate() {
      let startTime = moment(this.startDate)
        .format('YYYY/MM/DD')
        .slice(5, this.startDate.length)
      let endDate = moment(this.startDate)
        .add(6, 'days')
        .format('YYYY/MM/DD')
      let endTime = endDate.slice(5, endDate.length)
      this.rangeTime = `${startTime}-${endTime}`
    }
  },
  methods: {
    getTimeTableTemplate() {
      this.timeTableService.getTimeTableTemplate().subscribe(res => {
        this.tableData = res.info
        this.title = this.tableData.title
        this.form.setFieldsValue({
          title: this.tableData.title,
          selected_court: this.tableData.selected_court
        })
        if (this.tableData.is_bgimage) {
          // 背景自定义
          this.bgFileList = [this.tableData.customize_bgimage]
          this.bgUrl = this.tableData.customize_bgimage.image_url
          this.tableData.bg_image = this.tableData.customize_bgimage.image_key
        } else {
          this.bgUrl = this.tableData.def_bgimage.image_url
          this.tableData.bg_image = ''
        }
        if (this.tableData.is_qrcode) {
          // 二维码自定义
          this.codeFileList = this.tableData.customize_qrcode.image_key
            ? [this.tableData.customize_qrcode]
            : []
          this.codeUrl = this.tableData.customize_qrcode.image_url
          this.tableData.qrcode = this.tableData.customize_qrcode.image_key
        } else {
          this.codeUrl = this.tableData.def_qrcode.image_url
          this.tableData.qrcode = ''
        }
      })
    },
    // 选择时间段
    onChangeDate(date) {
      this.startDate = date.start_date
      this.endDate = date.end_date
    },
    changeTitle(e) {
      this.title = e.target.value
    },
    changeBgType() {
      if (!this.tableData.is_bgimage) {
        this.bgUrl = this.tableData.def_bgimage.image_url
        this.tableData.bg_image = ''
      } else {
        this.bgUrl = this.bgFileList.length
          ? this.bgFileList[0].image_url
          : this.bgUrl
        this.tableData.bg_image = this.bgFileList.length
          ? this.bgFileList[0].image_key
          : ''
        this.bgImgValidate()
      }
    },
    changeCodeType() {
      if (!this.tableData.is_qrcode) {
        this.codeUrl = this.tableData.def_qrcode.image_url
        this.tableData.qrcode = ''
      } else {
        this.codeUrl = this.codeFileList.length
          ? this.codeFileList[0].image_url
          : ''
        this.tableData.qrcode = this.codeFileList.length
          ? this.codeFileList[0].image_key
          : ''
        this.codeImgValidate()
      }
    },
    bgFileChange(fileData) {
      if (fileData.length) {
        this.tableData.bg_image = fileData[0].image_key
        this.bgUrl = fileData[0].image_url
        this.bgFileList = fileData
      } else {
        this.tableData.bg_image = ''
      }
      this.bgImgValidate()
    },
    codeFileChange(fileData) {
      if (fileData.length) {
        this.tableData.qrcode = fileData[0].image_key
        this.codeUrl = fileData[0].image_url
        this.codeFileList = fileData
      } else {
        this.tableData.qrcode = ''
      }
      this.codeImgValidate()
    },
    saveTimeTable() {
      this.editTimeTable()
    },
    downloadTimeTable() {
      this.editTimeTable(true)
    },
    editTimeTable(isDownload = false) {
      this.bgImgValidate()
      this.codeImgValidate()
      this.form.validate().then(value => {
        if (!this.bgErrorText && !this.codeErrorText) {
          let tableData = omit(this.tableData, [
            'brand_log',
            'shop_name',
            'customize_bgimage',
            'customize_qrcode',
            'def_bgimage',
            'def_qrcode'
          ])
          let saveData = {
            ...tableData,
            title: value.title,
            selected_court: value.selected_court
          }
          console.log(saveData)

          if (isDownload) {
            this.downLoadLoading = true
          } else {
            this.saveLoading = true
          }
          this.timeTableService
            .saveTimeTableTemplate(saveData)
            .subscribe(res => {
              if (!isDownload) {
                this.saveLoading = false
                this.messageService.success({ content: '保存成功' })
              } else {
                this.timeTableService
                  .getTimeTableList({
                    start_date: this.startDate,
                    end_date: this.endDate
                  })
                  .subscribe(res => {
                    if (!res.list.length) {
                      this.downLoadLoading = false
                      this.messageService.error({ content: '当前时间段未排课' })
                    } else {
                      let pickData = pick(this.tableData, [
                        'is_bgimage',
                        'brand_log',
                        'prompt_message',
                        'is_show_nickname',
                        'is_show_strength_level'
                      ])
                      let shsData = {
                        ...pickData,
                        bgUrl: this.bgUrl,
                        qrcode_url: this.codeUrl,
                        shop_name: this.tableData.is_show_shop
                          ? this.tableData.shop_name
                          : '',
                        rangeTime: this.rangeTime,
                        title: this.title,
                        timeTableList: JSON.stringify(res.list),
                        isSaveFile: 1
                      }

                      this.shsService
                        .getShsImage(shsData, '/saas/time_table')
                        .subscribe(url => {
                          this.downLoadLoading = false
                          this.messageService.success({
                            content: '保存并下载成功'
                          })
                          console.log(url)
                          this.downloadFile(url, `${this.title}.png`)
                        })
                    }
                  })
              }
            })
        }
      })
    },
    downloadFile(url, filename = '') {
      fetch(url, {
        headers: new Headers({
          Origin: location.origin
        }),
        mode: 'cors'
      })
        .then(res => res.blob())
        .then(blob => {
          const blobUrl = window.URL.createObjectURL(blob)
          this.download(blobUrl, filename)
          window.URL.revokeObjectURL(blobUrl)
        })
    },
    download(blobUrl, filename) {
      const a = document.createElement('a')
      a.href = blobUrl
      a.target = '_blank'
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
    },
    bgImgValidate() {
      if (this.tableData.is_bgimage) {
        this.bgErrorText = !this.tableData.bg_image ? '请上传背景图' : ''
      } else {
        this.bgErrorText = ''
      }
    },
    codeImgValidate() {
      if (this.tableData.is_qrcode) {
        this.codeErrorText = !this.tableData.qrcode ? '请上传二维码图片' : ''
      } else {
        this.codeErrorText = ''
      }
    }
  }
}
</script>
