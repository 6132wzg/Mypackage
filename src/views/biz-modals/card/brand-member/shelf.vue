<template>
  <st-modal
    :title="title"
    v-model="show"
    wrapClassName="modal-card-batch-shelves"
    width="668px"
    :loading="firstLoading"
  >
    <section :class="shelves('content')">
      <div :class="shelves('info')" class="mg-b24">
        <img
          :class="shelves('card_bg')"
          v-if="info.bg_image"
          :src="info.bg_image | imgFilter({ w: 142, h: 80 })"
          width="142"
          height="80"
          alt="卡背景"
        />
        <div :class="shelves('detail')">
          <p :class="shelves('detail-title')" v-if="info.card_type">
            <st-tag
              :type="cardTypeTag[info.card_type]"
              style="margin-right:8px;"
            />
            {{ info.card_name }}
          </p>
          <p v-if="actionType === 'shelf'" :class="shelves('detail-cards')">
            本次共上架{{ shopList.length }}家门店，
            <a-popover
              placement="bottom"
              trigger="click"
              :getPopupContainer="trigger => trigger.parentNode"
              v-model="visible"
            >
              <span slot="title" :class="shelves('card-list-title')">
                上架门店
              </span>
              <st-table
                slot="content"
                rowKey="key"
                :dataSource="shopList"
                :columns="shopColumns"
                :pagination="false"
                :scroll="{ y: 270 }"
              />
              <span>查看明细</span>
            </a-popover>
          </p>
          <p :class="shelves('detail-saletype')" v-if="info.sell_type">
            <span v-for="(item, index) in info.sell_type" :key="index">
              {{ item | enumFilter('member_card.sell_type') }}
            </span>
          </p>
        </div>
      </div>
      <st-form :form="form" labelWidth="67px" :class="shelves('form')">
        <!-- 次卡，无价格范围 -->
        <div
          :class="shelves('price')"
          v-if="
            (info.publish_channel === BRAND_MEMBER.PUBLISH_CHANNEL_2 &&
              info.card_type === BRAND_MEMBER.CARD_TYPE_1) ||
              (info.price_setting === BRAND_MEMBER.PRICE_SETTING_1 &&
                info.card_type === BRAND_MEMBER.CARD_TYPE_1)
          "
          class="mg-b0"
        >
          <st-form-table>
            <colgroup>
              <col style="width:4%;" />
              <col style="width:16%;" />
              <col style="width:22%;" />
              <col style="width:22%;" />
              <col style="width:18%;" />
              <col style="width:18%;" />
            </colgroup>
            <tr>
              <th></th>
              <th>次数</th>
              <th>售卖价格</th>
              <th>有效期限</th>
              <th>允许冻结</th>
              <th>赠送上限</th>
            </tr>
            <tbody>
              <tr v-for="(item, index) in info.specs" :key="index">
                <td></td>
                <td>{{ item.validity_times }}次</td>
                <td>{{ item.rally_price }}元</td>
                <td>
                  {{ item.duration_num
                  }}{{
                    item.duration_unit | enumFilter('member_card.duration_unit')
                  }}
                </td>
                <td>{{ item.frozen_day }}天</td>
                <td>{{ item.gift_unit }}次</td>
              </tr>
            </tbody>
          </st-form-table>
        </div>
        <!-- 期卡，无价格范围 -->
        <div
          :class="shelves('price')"
          v-if="
            (info.publish_channel === BRAND_MEMBER.PUBLISH_CHANNEL_2 &&
              info.card_type === BRAND_MEMBER.CARD_TYPE_2) ||
              (info.price_setting === BRAND_MEMBER.PRICE_SETTING_1 &&
                info.card_type === BRAND_MEMBER.CARD_TYPE_2)
          "
          class="mg-b0"
        >
          <st-form-table>
            <colgroup>
              <col style="width:4%;" />
              <col style="width:26%;" />
              <col style="width:26%;" />
              <col style="width:22%;" />
              <col style="width:22%;" />
            </colgroup>
            <tr>
              <th></th>
              <th>有效期限</th>
              <th>售卖价格</th>
              <th>允许冻结</th>
              <th>赠送上限</th>
            </tr>
            <tbody>
              <tr v-for="(item, index) in info.specs" :key="index">
                <td></td>
                <td>
                  {{ item.duration_num
                  }}{{
                    item.duration_unit | enumFilter('member_card.duration_unit')
                  }}
                </td>
                <td>{{ item.rally_price }}元</td>
                <td>{{ item.frozen_day }}天</td>
                <td>{{ item.gift_unit }}天</td>
              </tr>
            </tbody>
          </st-form-table>
        </div>
        <!-- 次卡，有价格范围 -->
        <div
          :class="{
            'modal-card-batch-shelves__price-error': priceHelpText !== ''
          }"
          v-if="
            info.publish_channel === BRAND_MEMBER.PUBLISH_CHANNEL_1 &&
              info.price_setting === BRAND_MEMBER.PRICE_SETTING_2 &&
              info.card_type === BRAND_MEMBER.CARD_TYPE_1
          "
          class="modal-card-batch-shelves__price mg-b0"
        >
          <st-form-table>
            <colgroup>
              <col style="width:2%;" />
              <col style="width:10%;" />
              <col style="width:20%;" />
              <col style="width:17%;" />
              <col style="width:17%;" />
              <col style="width:17%;" />
              <col style="width:17%;" />
            </colgroup>
            <tr>
              <th></th>
              <th>次数</th>
              <th>售卖价格</th>
              <th></th>
              <th>有效期限</th>
              <th>允许冻结</th>
              <th>赠送上限</th>
            </tr>
            <tbody>
              <tr v-for="(item, index) in priceList" :key="index">
                <td></td>
                <td>{{ item.validity_times }}次</td>
                <td :class="shelves('price-input')">
                  <st-input-number
                    :float="true"
                    :value="item.select_price || undefined"
                    :max="+item.max_price || undefined"
                    :min="+item.min_price || undefined"
                    @change="
                      e =>
                        brandPriceSettingHandleChange({ value: e, key: index })
                    "
                    style="width:140px;"
                  >
                    <span slot="addonAfter">元</span>
                  </st-input-number>
                </td>
                <td>
                  &nbsp;{{ item.min_price }}&nbsp;~&nbsp;{{
                    item.max_price
                  }}&nbsp;
                </td>
                <td>
                  {{ item.duration_num
                  }}{{
                    item.duration_unit | enumFilter('member_card.duration_unit')
                  }}
                </td>
                <td>{{ item.frozen_day }}天</td>
                <td>{{ item.gift_unit }}次</td>
              </tr>
            </tbody>
          </st-form-table>
        </div>
        <!-- 期卡，有价格范围 -->
        <div
          :class="{
            'modal-card-batch-shelves__price-error': priceHelpText !== ''
          }"
          v-if="
            info.publish_channel === BRAND_MEMBER.PUBLISH_CHANNEL_1 &&
              info.price_setting === BRAND_MEMBER.PRICE_SETTING_2 &&
              info.card_type === BRAND_MEMBER.CARD_TYPE_2
          "
          class="modal-card-batch-shelves__price mg-b0"
        >
          <st-form-table>
            <colgroup>
              <col style="width:2%;" />
              <col style="width:19%;" />
              <col style="width:22%;" />
              <col style="width:19%;" />
              <col style="width:19%;" />
              <col style="width:19%;" />
            </colgroup>
            <tr>
              <th></th>
              <th>有效期限</th>
              <th>售卖价格</th>
              <th></th>
              <th>允许冻结</th>
              <th>赠送上限</th>
            </tr>
            <tbody>
              <tr v-for="(item, index) in priceList" :key="index">
                <td></td>
                <td>
                  {{ item.duration_num
                  }}{{
                    item.duration_unit | enumFilter('member_card.duration_unit')
                  }}
                </td>
                <td :class="shelves('price-input')">
                  <st-input-number
                    :float="true"
                    :value="item.select_price || undefined"
                    :max="+item.max_price || undefined"
                    :min="+item.min_price || undefined"
                    @change="
                      e =>
                        brandPriceSettingHandleChange({ value: e, key: index })
                    "
                    style="width:140px;"
                  >
                    <span slot="addonAfter">元</span>
                  </st-input-number>
                </td>
                <td>
                  &nbsp;{{ item.min_price }}&nbsp;~&nbsp;{{
                    item.max_price
                  }}&nbsp;
                </td>
                <td>{{ item.frozen_day }}天</td>
                <td>{{ item.gift_unit }}天</td>
              </tr>
            </tbody>
          </st-form-table>
        </div>
        <p :class="shelves('price-valid-text')">{{ priceHelpText }}</p>
        <st-form-item
          labelGutter="12px"
          class="mg-b0"
          label="开卡方式"
          required
        >
          <a-checkbox-group
            v-model="openTypeList"
            :class="shelves('open-type')"
          >
            <template
              v-for="(item, index) in activateTypes"
              :value="+item.value"
            >
              <span
                :class="shelves('day-input')"
                v-if="+item.value === 2"
                :key="index"
              >
                <a-checkbox :value="+item.value">{{ item.label }}</a-checkbox>
                <div class="autoplay-card-day" v-if="openTypeList.includes(2)">
                  <a-form-item class="page-a-form">
                    <st-input-number
                      v-decorator="decorators.openDay"
                      class="autoplay-card-day-input"
                    >
                      <span slot="addonAfter">天</span>
                    </st-input-number>
                    <span>内未开卡，则自动开卡</span>
                  </a-form-item>
                </div>
              </span>
              <a-checkbox v-else :key="index" :value="+item.value">
                {{ item.label }}
              </a-checkbox>
            </template>
          </a-checkbox-group>
        </st-form-item>
        <st-form-item labelGutter="12px" label="约课权益" required>
          <a-radio-group v-model="courseInterests" :class="shelves('course')">
            <a-radio
              v-for="(item, index) in course_interests"
              :value="+item.value"
              :key="index"
            >
              {{ item.label }}
            </a-radio>
          </a-radio-group>
          <a-select
            v-if="courseInterests === 3"
            mode="multiple"
            style="width: 419px;"
            v-decorator="decorators.courseList"
            placeholder="请输入课程名称搜索"
            :filterOption="false"
            @search="getCourseList"
            :notFoundContent="loading.getCourseList ? undefined : null"
          >
            <a-spin
              v-if="loading.getCourseList"
              slot="notFoundContent"
              size="small"
            />
            <a-select-option v-for="d in courseData" :key="d.id">
              {{ d.name }}
            </a-select-option>
          </a-select>
        </st-form-item>
        <div v-if="!moreIsShow" :class="shelves('show-more')" class="mg-b18">
          <span @click="moreIsShow = true">展开更多设置</span>
          <st-icon @click="moreIsShow = true" type="down-small" />
        </div>
        <st-form-item
          v-if="moreIsShow"
          labelGutter="12px"
          label="入场时段"
          class="mg-b16"
          required
        >
          <a-radio-group v-model="admissionTime">
            <a-radio
              v-for="(item, index) in admissionTimeList"
              :value="+item.value"
              :key="index"
            >
              {{ item.label }}
            </a-radio>
          </a-radio-group>
        </st-form-item>
        <shop-hour-picker
          v-if="admissionTime === BRAND_MEMBER.ADMISSION_TIME_2 && moreIsShow"
          v-model="timeList"
        ></shop-hour-picker>
        <p
          :class="shelves('admission-time-validata')"
          v-if="admissionTime === BRAND_MEMBER.ADMISSION_TIME_2 && moreIsShow"
        >
          {{ admissionTimeText }}
        </p>
        <st-form-item
          v-if="moreIsShow"
          labelGutter="12px"
          class="mg-t18 mg-b8"
          labelWidth="78px"
          label="VIP场地通行"
        >
          <span v-if="info.areas && !info.areas.length">无</span>
          <div v-else>
            <!-- 上架会员卡时展示的场地 -->
            <div v-if="actionType === 'shelf'" :class="shelves('tree')">
              <a-input-search
                class="mg-b16"
                :class="shelves('tree-search')"
                @search="onTreeSearch"
                placeholder="请输入场地名称查询"
              />
              <a-tree
                checkable
                @expand="onExpand"
                :autoExpandParent="autoExpandParent"
                :expandedKeys="expandedKeys"
                :treeData="vipTree"
                @check="onTreeSelect"
              >
                <template slot="title" slot-scope="{ title }">
                  <span v-if="title.indexOf(searchValue) > -1">
                    {{ title.substr(0, title.indexOf(searchValue)) }}
                    <span :class="shelves('tree-title-span')">
                      {{ searchValue }}
                    </span>
                    {{
                      title.substr(
                        title.indexOf(searchValue) + searchValue.length
                      )
                    }}
                  </span>
                  <span v-else>{{ title }}</span>
                </template>
              </a-tree>
            </div>
            <!-- 变更上架信息时展示的场地 -->
            <a-checkbox-group
              v-if="actionType === 'updateShelf'"
              v-model="shelfCardDetail.areas"
            >
              <a-checkbox
                v-for="(item, index) in info.areas"
                :key="index"
                :value="item.id"
              >
                {{ item.name }}
              </a-checkbox>
            </a-checkbox-group>
          </div>
        </st-form-item>
        <div :class="shelves('hide-more')" v-if="moreIsShow">
          <span @click="moreIsShow = false">收起</span>
        </div>
      </st-form>
    </section>
    <template slot="footer">
      <div :class="shelves('footer')">
        <st-button @click="show = false">取消</st-button>
        <!-- 上架 -->
        <st-button
          v-if="actionType === 'shelf'"
          @click="onSubmit"
          :loading="loading.shelfCard"
          type="primary"
        >
          确认上架
        </st-button>
        <!-- 变更上架 -->
        <st-button
          v-if="actionType === 'updateShelf'"
          @click="onUpdateShelf"
          :loading="loading.updateShelf"
          type="primary"
        >
          确认变更
        </st-button>
      </div>
    </template>
  </st-modal>
</template>
<script>
import { ShelfService } from './shelf.service'
import { cloneDeep } from 'lodash-es'
import { PatternService } from '@/services/pattern.service'
import ShopHourPicker from '@/views/components/hour-picker#/hour-picker'
import { ruleOptions, shopColumns, admissionTimeList } from './shelf.config'
import { BRAND_MEMBER } from '@/constants/card/brand-member'
import { MessageService } from '@/services/message.service'
export default {
  name: 'ModalCardBrandMemberShelf',
  bem: {
    shelves: 'modal-card-batch-shelves'
  },
  components: {
    ShopHourPicker
  },
  serviceInject() {
    return {
      pattern: PatternService,
      messageService: MessageService,
      shelfService: ShelfService
    }
  },
  rxState() {
    return {
      courseData: this.shelfService.courseList$,
      course_interests: this.shelfService.course_interests$,
      activateTypes: this.shelfService.activateTypes$,
      loading: this.shelfService.loading$,
      info: this.shelfService.info$,
      shelfCardDetail: this.shelfService.shelfCardDetail$
    }
  },
  props: {
    id: {
      type: Number,
      default: 0
    },
    shelf_id: {
      type: Number,
      default: 0
    },
    actionType: {
      type: String,
      default: 'shelf'
    },
    title: {
      type: String,
      default: '标题'
    }
  },
  computed: {
    shopColumns,
    admissionTimeList,
    shopList() {
      let shopList = []
      if (this.info.sell_shops) {
        this.info.sell_shops.forEach(i => {
          let id = parseInt(Math.random() * 999999).toString()
          shopList.push({ ...i, key: id })
        })
      }
      return shopList
    },
    admissionTimeIsOk() {
      return this.admissionTimeText === ''
    },
    courseInterestsIsOk() {
      return this.courseInterestsStatus === 'success'
    },
    priceIsOk() {
      return this.priceHelpText === ''
    },
    priceValidataArray() {
      let array = []
      this.priceList.forEach(i => {
        array.push(i.priceInputValue)
      })
      return array
    },
    vipTree() {
      let array = []
      if (this.actionType === 'shelf' && this.info.areas) {
        this.info.areas.forEach(i => {
          let children = []
          i.areas.forEach(o => {
            children.push({
              title: o.name,
              key: `${i.id}-${o.id}`,
              scopedSlots: { title: 'title' }
            })
          })
          array.push({
            title: i.name,
            key: i.id,
            scopedSlots: { title: 'title' },
            children
          })
        })
      }
      return array
    },
    // 回传给后台的上架门店
    sell_shops() {
      let shops = []
      if (this.info.sell_shops) {
        this.info.sell_shops.forEach(i => {
          shops.push(+i.id)
        })
      }
      return shops
    }
  },
  watch: {
    priceList: {
      deep: true,
      handler() {
        let b = this.priceValidataArray.every(i =>
          this.pattern.NUM_FLOAT(1).test(i)
        )
        b && this.checkedPrice()
      }
    },
    info: {
      deep: true,
      handler(newVal) {
        newVal.specs.forEach(i => {
          this.priceList.push({
            ...i,
            priceInputValue: ''
          })
        })
      }
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      firstLoading: false,
      BRAND_MEMBER,
      form,
      decorators,
      show: true,
      // 卡tag类型
      cardTypeTag: {
        1: 'number-card',
        2: 'period-card'
      },
      // 门店明细
      visible: false,
      // 范围价格列表
      priceList: [],
      priceHelpText: '',
      // 回传给后台的价格
      specs: [],
      // 开卡方式
      openTypeList: [],
      // 约课权益
      // 输入是否正确
      courseInterestsStatus: 'success',
      courseInterestsHelpText: '',
      // 课列表
      courseInterests: null,
      courseList: [],
      // 显示更多
      moreIsShow: true,
      admissionTime: 1,
      timeList: [],
      // 回传给后台的时间段
      inoutTime: [],
      admissionTimeText: '',
      expandedKeys: [],
      autoExpandParent: true,
      searchValue: '',
      // 选择的vip区域
      selectVipAreas: []
    }
  },
  created() {
    this.firstLoading = true
    const query = {}
    const { actionType, shelf_id } = this
    if (actionType === 'updateShelf') {
      query.shelf_id = shelf_id
    }
    this.shelfService.getInfo(this.id, query).subscribe(res => {
      if (actionType === 'updateShelf') {
        this.initShelfData()
      }
      this.firstLoading = false
    })
  },
  methods: {
    getCourseList(search) {
      let query = { course_name: search }
      this.shelfService.courseListAction$.dispatch(query)
    },
    // 检验入场时间是否输入正确
    checkedAdmission() {
      this.admissionTimeText =
        this.admissionTime === 2 && this.moreIsShow && !this.timeList.length
          ? '请选择入场时间'
          : ''
    },
    brandPriceSettingHandleChange({ value, key }) {
      this.priceList[key].priceInputValue = value
    },
    // 检验门店自主定价价格输入是否正确
    checkedPrice() {
      if (
        !(
          this.info.publish_channel === this.BRAND_MEMBER.PUBLISH_CHANNEL_1 &&
          this.info.price_setting === this.BRAND_MEMBER.PRICE_SETTING_2
        )
      ) {
        this.priceHelpText = ''
        return false
      }
      let b = this.priceValidataArray.every(i =>
        this.pattern.NUM_FLOAT(1).test(i)
      )
      this.priceHelpText = b ? '' : '请输入价格'
    },
    onTreeSearch(data) {
      if (data === '') {
        Object.assign(this, {
          expandedKeys: [],
          searchValue: data,
          autoExpandParent: true
        })
        return
      }
      let expandedKeys = []
      this.vipTree.forEach(i => {
        if (i.children) {
          i.children.forEach(o => {
            if (o.title.includes(data)) {
              expandedKeys.push(i.key)
            }
          })
        }
      })
      this.expandedKeys = cloneDeep(expandedKeys)
      this.searchValue = data
      this.autoExpandParent = true
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onTreeSelect(checkeds) {
      let selectAreasObject = {}
      let vipAreas = []
      let selectAreasArray = []
      vipAreas = checkeds.filter(i => `${i}`.includes('-'))
      vipAreas.forEach(i => {
        if (selectAreasObject[i.split('-')[0]]) {
          selectAreasObject[i.split('-')[0]].push(+i.split('-')[1])
        } else {
          selectAreasObject[i.split('-')[0]] = [+i.split('-')[1]]
        }
      })
      Object.keys(selectAreasObject).forEach(i => {
        selectAreasArray.push({
          shop_id: +i,
          areas: cloneDeep(selectAreasObject[i])
        })
      })
      this.selectVipAreas = cloneDeep(selectAreasArray)
    },
    // 格式化价格
    formatSpecs() {
      this.specs = []
      if (
        this.info.publish_channel === this.BRAND_MEMBER.PUBLISH_CHANNEL_1 &&
        this.info.price_setting === this.BRAND_MEMBER.PRICE_SETTING_2
      ) {
        // 有价格范围
        this.priceList.forEach(i => {
          this.specs.push({
            specs_id: i.spec_id,
            price: i.priceInputValue
          })
        })
      } else {
        // 无价格范围,发布渠道为2是门店，一定是无范围的
        this.priceList.forEach(i => {
          this.specs.push({
            specs_id: i.spec_id,
            price: i.rally_price
          })
        })
      }
    },
    // 格式化入场时段
    formatWeek() {
      this.inoutTime = []
      this.timeList.forEach(i => {
        this.inoutTime.push({
          week_day: +i.week_day,
          time_duration: [{ start_time: i.start_time, end_time: i.end_time }]
        })
      })
    },
    onSubmit() {
      this.form.validate().then(values => {
        this.checkedAdmission()
        // TODO: shop hour picker后续修改，不能有默认值
        this.formatWeek()
        this.formatSpecs()
        if (!this.inputCheck()) {
          return
        }
        if (this.admissionTimeIsOk) {
          if (this.openTypeList.toString() === '3') {
            this.$confirm({
              title: '确认上架?',
              content:
                '当前仅选择指定日期开卡，上架后小程序不显示该卡，确认上架？',
              onOk: () => {
                this.sendShelfCard(values)
              }
            })
            return
          }
          this.sendShelfCard(values)
        }
      })
    },
    getParams(values, shelf_id) {
      const params = {
        sell_shops: this.sell_shops,
        open_type: this.openTypeList,
        activate_duration:
          values.openDay === undefined ? values.openDay : +values.openDay,
        course_interests: +this.courseInterests,
        courses: values.courseList,
        inout_type: this.admissionTime,
        inout_time: this.inoutTime,
        specs: this.specs
      }
      const { actionType, selectVipAreas, shelfCardDetail } = this
      if (actionType === 'shelf') {
        params.areas = selectVipAreas
      } else {
        params.areas = shelfCardDetail.areas
      }
      if (shelf_id) {
        params.shelf_id = shelf_id
        /**
         * 变更上架信息不传 sell_shops
         */

        delete params.sell_shops
      }
      return params
    },
    inputCheck() {
      if (!this.courseInterests) {
        this.messageService.error({
          content: '请选择约课权益'
        })
        return false
      }
      return true
    },
    sendShelfCard(values) {
      const params = this.getParams(values)
      this.shelfService.shelfCard(params, this.id).subscribe(() => {
        this.show = false
        this.$emit('success')
      })
    },
    onUpdateShelf() {
      this.form.validate().then(values => {
        this.checkedAdmission()
        this.formatWeek()
        this.formatSpecs()
        const params = this.getParams(values, this.shelf_id)
        if (!this.inputCheck()) {
          return
        }
        this.shelfService.updateShelf(this.id, params).subscribe(() => {
          this.show = false
          this.$emit('success')
        })
      })
    },
    /**
     * 变更上架表单数据回显
     */
    initShelfData() {
      const detail = this.shelfCardDetail
      this.openTypeList = detail.activate_type
      this.courseInterests = detail.course_interests
      this.admissionTime = detail.inout_type
      this.timeList = this.timeFilter(detail.inout_time)
      this.vipAreaList = detail.areas
      this.$nextTick(() => {
        this.form.setFieldsValue({
          openDay: detail.automatic_num,
          courseList: detail.courses
        })
      })
      this.getCourseList('')
    },
    timeFilter(timeList) {
      return timeList.map(item => {
        const { week_day } = item
        const { start_time, end_time } = item.time_duration[0]
        return {
          week_day,
          start_time,
          end_time
        }
      })
    }
  }
}
</script>
