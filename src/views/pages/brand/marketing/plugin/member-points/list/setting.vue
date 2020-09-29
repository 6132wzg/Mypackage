<template>
  <div :class="b()">
    <st-form>
      <st-form-item label="积分应用">
        <div :class="b('tip')">
          <div
            :class="b('tip-item')"
            v-for="link in linkPoints$"
            :key="link.id"
            @click="onPush(link.link, link.query)"
            class="mg-r64"
          >
            <st-icon :type="link.icon" size="22px" class="mg-r8"></st-icon>
            <span>{{ link.text }}</span>
          </div>
        </div>
      </st-form-item>
      <st-form-item label="功能开关">
        <st-switch v-model="isOpen" :disabled="!auth$.open"></st-switch>
        <div :class="b('switch-btn')" @click="onOffChange"></div>
      </st-form-item>
      <st-form-item label="积分有效期">
        <st-input-number
          style="width: 140px"
          placeholder="请输入"
          v-model="validateNum"
          @change="onTermChange"
        >
          <a-select
            slot="addonAfter"
            v-model="validateUnit"
            :default-value="1"
            :options="validateUnitTypeOptions$"
            @change="onTermChange"
          />
        </st-input-number>
        <span class="mg-l16 tip">
          例：本{{ validateUnitType$[validateUnit] }}获取的积分，将在{{
            termDate
          }}到期
        </span>
      </st-form-item>
      <st-form-item label="积分获取规则">
        <div :class="b('rule')">
          <div :class="b('rule-item')">
            <div class="title">按会员行为送积分</div>
            <div :class="b('rule-item-action')">
              <a-checkbox-group
                :class="b('rule-item-action')"
                v-model="actionCheckList"
                @change="onChange"
              >
                <a-checkbox
                  class="mg-t16"
                  v-for="item in actionList"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.label }}
                  <st-input-number
                    style="width: 141px"
                    placeholder="请输入"
                    v-model="item.points"
                    :min="0"
                    :max="99999"
                    @change="onChange"
                  >
                    <template slot="addonAfter">
                      积分/次
                    </template>
                  </st-input-number>
                  <span class="mg-l16 tip">{{ item.text }}</span>
                </a-checkbox>
              </a-checkbox-group>
            </div>
          </div>
          <div class="mg-t16" :class="b('rule-item')">
            <div class="title">
              按会员消费送积分
              <span class="tip">发生退款时，可扣除对应积分</span>
            </div>
            <div>
              <a-checkbox-group v-model="consumeCheckList">
                <a-checkbox
                  class="mg-t16"
                  v-for="item in consumeList"
                  :key="item.id"
                  :value="item.id"
                  @change="onChange"
                >
                  <div class="checkbox-content">
                    <span class="checkbox-content__text">
                      {{ item.label }}
                    </span>
                    <span class="mg-r8">单次消费每满</span>
                    <st-input-number
                      style="width: 106px"
                      placeholder="请输入"
                      v-model="item.price"
                      :min="0"
                      :max="999999"
                      @change="onChange"
                    >
                      <template slot="addonAfter">
                        元
                      </template>
                    </st-input-number>
                    <span class="mg-l8">赠送</span>
                    <st-input-number
                      class="mg-l8"
                      style="width: 120px"
                      placeholder="请输入"
                      v-model="item.points"
                      :min="0"
                      :max="99999"
                      @change="onChange"
                    >
                      <template slot="addonAfter">
                        积分
                      </template>
                    </st-input-number>
                  </div>
                </a-checkbox>
              </a-checkbox-group>
            </div>
          </div>
        </div>
      </st-form-item>
      <!-- 每日积分上线功能暂时关闭 -->
      <!-- <st-form-item label="积分上限">
        <span class="mg-r8">每个客户每天最多获得</span>
        <st-input-number
          style="width: 120px"
          v-model="setting.points_limit"
          :min="0"
          @change="onChange"
        >
          <template slot="addonAfter">
            积分
          </template>
        </st-input-number>
        <span class="tip mg-l16">员工录入积分不受此限制</span>
      </st-form-item> -->
      <st-form-item labelFix>
        <st-button
          type="primary"
          :disabled="!isEdit"
          :loading="loading$.setPoiontsSetting"
          @click="onSubmit"
        >
          保存
        </st-button>
      </st-form-item>
    </st-form>
  </div>
</template>

<script>
import { SettingService } from './setting.service'
import moment from 'moment'

export default {
  name: 'Setting',
  bem: {
    b: 'brand-plagin-member-points-setting'
  },
  watch: {
    setting$: {
      handler: function(newVal) {
        this.initData(newVal)
      },
      deep: true
    }
  },
  data() {
    return {
      isEdit: false,
      setting: { validate_num: 0, validate_unit: 0 },
      validateNum: 0,
      validateUnit: 0,
      isOpen: 1,
      actionList: [],
      actionCheckList: [],
      consumeList: [],
      consumeCheckList: [],
      termDate: moment()
        .endOf(this.setting$.validate_unit === 1 ? 'month' : 'year')
        .format('YYYY年MM月DD日')
    }
  },
  serviceInject() {
    return {
      service: SettingService
    }
  },
  rxState() {
    let {
      loading$,
      setting$,
      defalutOptions$,
      linkPoints$,
      sourceTypeOptions$,
      payPointsOptions$,
      actionPointsOptions$,
      validateUnitTypeOptions$,
      validateUnitType$,
      auth$
    } = this.service
    return {
      loading$,
      setting$,
      defalutOptions$,
      linkPoints$,
      sourceTypeOptions$,
      payPointsOptions$,
      actionPointsOptions$,
      validateUnitTypeOptions$,
      validateUnitType$,
      auth$
    }
  },
  computed: {
    getRules() {
      let listMap = {}
      let list = []
      this.actionList.map(item => {
        listMap[item.id] = item
      })
      this.actionCheckList.map(id => {
        list.push(listMap[id])
      })
      return list
    },
    supportCategory() {
      let listMap = {}
      let list = []
      this.consumeList.map(item => {
        listMap[item.id] = item
      })
      this.consumeCheckList.map(id => {
        list.push(listMap[id])
      })
      return list
    }
  },
  created() {
    this.initData(this.setting$)
  },
  methods: {
    initData(newVal) {
      this.setting = newVal || { validate_num: 0, validate_unit: 0 }
      this.validateNum = newVal.validate_num
      this.validateUnit = newVal.validate_unit
      this.termDate = moment()
        .add(
          newVal.validate_num,
          newVal.validate_unit === 1 ? 'months' : 'years'
        )
        .endOf(newVal.validate_unit === 1 ? 'month' : 'year')
        .format('YYYY年MM月DD日')
      this.isOpen = newVal.activity_status === 1 ? 1 : 0
      const actionObj = this.SET_ACTION(newVal.get_rules)
      this.actionList = actionObj.list
      this.actionCheckList = actionObj.checkList
      const consumeObj = this.SET_CONSUME(newVal.support_category)
      this.consumeList = consumeObj.list
      this.consumeCheckList = consumeObj.checkList
    },
    onChange() {
      this.isEdit = true
    },
    onTermChange(e) {
      this.isEdit = true
      this.$nextTick(() => {
        this.termDate = moment()
          .add(this.validateNum, this.validateUnit === 1 ? 'months' : 'years')
          .endOf(this.validateUnit === 1 ? 'month' : 'year')
          .format('YYYY年MM月DD日')
      })
    },
    onOffChange() {
      if (!this.auth$.open) return
      this.isEdit = true
      this.$confirm({
        title: '提示',
        content: !this.isOpen
          ? '请确定以下积分规则设置无误，开启后，会员将在个人中心看到积分相关功能，并可按规则赚取积分。'
          : '关闭积分后会员将看不到积分入口，无法获取、消耗积分，可能会引发会员投诉，对品牌公信度带来不好的影响，请谨慎操作。',
        onOk: () => {
          console.log('OK')
          this.isOpen = this.isOpen === 1 ? 0 : 1
        },
        onCancel: () => {
          console.log('Cancel')
        }
      })
    },
    onSubmit() {
      const get_rules = this.getRules.map(item => ({
        ...item,
        points: +item.points
      }))
      const support_category = this.supportCategory.map(item => ({
        ...item,
        price: +item.price,
        points: +item.points
      }))
      this.service
        .setPoiontsSetting({
          ...this.setting,
          activity_status: this.isOpen === 1 ? 1 : 2,
          validate_num: +this.validateNum,
          validate_unit: +this.validateUnit,
          get_rules,
          support_category
        })
        .subscribe(() => {
          this.isEdit = false
          this.service.refreshUserInfo().subscribe()
          this.$router.push({
            path: './member-points'
          })
        })
    },
    onPush(name) {
      const routeUrl = this.$router.resolve({
        name
      })
      window.open(routeUrl.href, '_blank')
    },
    SET_ACTION(data = []) {
      let list = []
      let checkList = []
      let dataValusMap = {}
      let actionOptionsMap = {}
      let defalutActionRules = this.defalutOptions$.get_rules
      this.actionPointsOptions$.map(item => {
        actionOptionsMap[item.id] = item
      })
      data.map(item => {
        dataValusMap[item.id] = item
        checkList.push(item.id)
      })
      list = defalutActionRules.map(item => ({
        ...item,
        points:
          (dataValusMap[item.id] && dataValusMap[item.id].points) ||
          item.points,
        label: actionOptionsMap[item.id] && actionOptionsMap[item.id].text,
        text: actionOptionsMap[item.id] && actionOptionsMap[item.id].desc
      }))
      this.actionList = list
      this.actionCheckList = checkList
      return {
        list,
        checkList
      }
    },
    SET_CONSUME(data = []) {
      let list = []
      let checkList = []
      let dataValusMap = {}
      let consumeOptionsMap = this.payPointsOptions$
      let defalutConsumeRules = this.defalutOptions$.support_category

      data.map(item => {
        dataValusMap[item.id] = item
        checkList.push(item.id)
      })
      list = defalutConsumeRules.map(item => ({
        ...item,
        points:
          (dataValusMap[item.id] && dataValusMap[item.id].points) ||
          item.points,
        price:
          (dataValusMap[item.id] && dataValusMap[item.id].price) || item.price,
        label: consumeOptionsMap[item.id]
      }))
      this.consumeList = list
      this.consumeCheckList = checkList
      return {
        list,
        checkList
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    // this.targetName = to.name  // 提示框点击确认后跳转的 路由
    if (this.isEdit) {
      this.$confirm({
        title: '提示',
        content: '您的设置还未保存，是否继续离开页面？',
        onOk: () => {
          console.log('OK')
          this.isEdit = false
          next()
        },
        onCancel: () => {
          console.log('Cancel')
          next(false)
        }
      })
      // next(false)
    } else {
      next()
    }
  }
}
</script>

<style></style>
