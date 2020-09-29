<template>
  <div :class="module()">
    <div :class="module('main')">
      <div :class="module('wrap')" class="mg-t32 mg-b24">
        <div :class="module('main-title')">设置打卡时间范围</div>
        <div
          :class="module('main-icon')"
          v-if="auth['authSetting'] && !isEdit"
          @click="editHandle"
        >
          <st-icon type="edit" size="16px" color="#3F66F6" />
          编辑
        </div>
      </div>
      <div :class="module('main-time-frame-wrap')">
        <div :class="module('main-time-frame')">
          <span :class="module('main-time-frame-label')">最早上班时间</span>
          <a-select
            allowClear
            :value="list.rules.start"
            style="width: 212px;"
            :disabled="!isEdit"
            @change="onChange($event, 'start')"
          >
            <a-select-option v-for="setting in startTime" :key="setting.value">
              {{ setting.label }}
            </a-select-option>
          </a-select>
        </div>
        <div :class="module('main-time-frame')">
          <span :class="module('main-time-frame-label')">最晚下班时间</span>
          <a-select
            allowClear
            :value="list.rules.end"
            @change="onChange($event, 'end')"
            style="width: 212px"
            :disabled="!isEdit"
          >
            <a-select-option v-for="setting in endTime" :key="setting.value">
              {{ setting.label }}
            </a-select-option>
          </a-select>
        </div>
        <div :class="module('main-time-frame-desc')">
          最晚时间不能超过次日最早上班时间
        </div>
      </div>
      <div :class="module('main-rules')">
        打卡规则：在打卡时间范围内，员工默认第一次打卡时间，记录为上班打卡；最后一次打卡时间，记录为下班打卡，重复打卡会覆盖更新下班打卡时间
      </div>
      <div :class="module('main-title')" class="mg-y24">其他设置</div>
      <div :class="module('main-other')">
        <div :class="module('main-other-way')" class="mg-b24">
          <span class="mg-r16 other-title">支持方式</span>
          <st-checkbox v-model="list.rules.types_way[0]" :disabled="!isEdit">
            智慧前台
          </st-checkbox>
          <st-checkbox
            v-model="list.rules.types_way[1]"
            :disabled="!isEdit"
            class="mg-l16"
          >
            三体云管家
          </st-checkbox>
        </div>
        <div :class="module('main-other-range')">
          <div class="mg-r16 other-title">定位距离</div>
          <div :class="module('main-other-range-content')">
            距离门店地址位置
            <st-input
              width="65px"
              v-model="list.rules.range"
              :disabled="!isEdit"
            />
            米内，可进行范围内打卡，超出范围则无法打卡（仅作用于三体云管家）
            <span class="setting-shop-adress" @click="jumpShopList">
              去设置门店地址
            </span>
          </div>
        </div>
        <div :class="module('main-other-save')" class="mg-t24" v-if="isEdit">
          <st-button
            type="primary"
            class="mg-r8"
            :loading="loading.putAttendanceSettingHandle"
            @click="saveSetting"
          >
            保 存
          </st-button>
          <st-button @click="cancelSetting">取 消</st-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SettingService } from './setting.service'
import { cloneDeep, omit } from 'lodash-es'
import { BasicSettingService } from '@/views/biz-modals/brand/app/venue/basic-setting.service'
import { MessageService } from '@/services/message.service'
export default {
  name: 'brand-app-attendance-setting',
  bem: {
    module: 'brand-app-attendance-setting'
  },

  serviceInject() {
    return {
      messageService: MessageService,
      settingService: SettingService
    }
  },

  rxState() {
    return {
      auth: this.settingService.auth$,
      list: this.settingService.list$,
      loading: this.settingService.loading$,
      timeMap: this.settingService.timeMap$
    }
  },

  props: {},

  data() {
    return {
      startTime: [],
      // 用于记录开始时间
      startTimeTemp: '',
      endTime: [],
      placeholder: '最早上班时间',
      isEdit: false
    }
  },

  mounted() {
    // let startLocal = -1
    let endLocal = -1
    for (let i = 0; i < this.timeMap.length; i++) {
      if (this.timeMap[i].label === this.list.rules.start) {
        endLocal = i
      }
      if (this.timeMap[i].label === this.list.rules.start) {
        const timeMap = cloneDeep(this.timeMap)
        const startBeforeTime = timeMap.filter((v, index) => {
          return index < i
        })
        startBeforeTime.forEach(val => {
          val.label = '次日' + val.label
        })
        const startAfterTime = timeMap.filter((v, index) => {
          return index > i
        })
        this.endTime = [...startAfterTime, ...startBeforeTime]
      }
    }
    this.startTime = this.timeMap
  },
  computed: {},
  watch: {
    list: {
      handler(val) {
        if (this.startTimeTemp !== val.rules.start) {
          this.startTimeTemp = val.rules.start
          let endLocal = -1
          for (let i = 0; i < this.timeMap.length; i++) {
            if (this.timeMap[i].label === val.rules.start) {
              endLocal = i
            }
            if (this.timeMap[i].label === val.rules.start) {
              const timeMap = cloneDeep(this.timeMap)
              const startBeforeTime = timeMap.filter((v, index) => {
                return index < i
              })
              startBeforeTime.forEach(val => {
                val.label = '次日' + val.label
              })
              const startAfterTime = timeMap.filter((v, index) => {
                return index > i
              })
              this.endTime = [...startAfterTime, ...startBeforeTime]
            }
          }
          this.startTime = this.timeMap
        }
      },
      deep: true
    }
  },
  components: {},
  methods: {
    onChange(time, par) {
      console.log(time)
      if (par === 'start') {
        this.list.rules.start = time
        // 判断是否清除下班时间
        if (this.isStratMoreEnd(this.list.rules.start, this.list.rules.end)) {
          this.list.rules.end = ''
        }
      } else if (par === 'end') {
        this.list.rules.end = time
      }
    },
    isStratMoreEnd(start, end) {
      return end && end >= this.startTime[0].value && end <= start
    },
    editHandle() {
      this.isEdit = true
      console.log(this.isEdit)
    },
    cancelSetting() {
      this.isEdit = false
    },
    saveSetting() {
      // 处理支持方式数据用于接口入参
      const list = omit(this.list.rules, 'types')
      list.types = []
      list.types_way.forEach((val, i) => {
        if (val) {
          list.types.push(i + 1)
        }
      })
      const queryList = omit(list, 'types_way')
      console.log(queryList)
      if (!queryList.start) {
        this.messageService.warn({
          content: '请选择最早上班时间'
        })
        return
      }
      if (!queryList.end) {
        this.messageService.warn({
          content: '请选择最早下班时间'
        })
        return
      }
      if (isNaN(queryList.range)) {
        this.messageService.warn({
          content: '范围请输入数字'
        })
        return
      }
      if (queryList.range < 100) {
        this.messageService.warn({
          content: '范围不能小于100米'
        })
        return
      }
      if (queryList.range > 99999) {
        this.messageService.warn({
          content: '范围不能大于99999米'
        })
        return
      }
      this.settingService
        .putAttendanceSettingHandle(queryList)
        .subscribe(res => {
          this.isEdit = false
          this.messageService.success({
            content: '保存成功'
          })
        })
    },
    jumpShopList() {
      this.$router.push({
        name: 'brand-setting-shop-list'
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
