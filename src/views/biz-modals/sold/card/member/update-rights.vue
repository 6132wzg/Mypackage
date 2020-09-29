<template>
  <st-modal :title="title" v-model="show">
    <st-form :form="form">
      <st-form-item
        v-show="info.card_number_type === TYPE_MULII_CARD"
        labelWidth="120px"
      >
        <template slot="label">
          <st-checkbox v-model="switches.entranceNum">支持入场人数</st-checkbox>
        </template>
        <a-select
          :options="supportMemberNumOptions"
          v-model="info.support_member_num"
          :disabled="!switches.entranceNum"
          style="width: 120px"
        ></a-select>
      </st-form-item>
      <st-form-item labelWidth="130px">
        <template slot="label">
          <st-checkbox v-model="switches.givingTime" @change="onSwitchChange">
            剩余可赠送额度
          </st-checkbox>
        </template>
        <st-input-number
          v-decorator="decorators.gift_remain"
          :disabled="!switches.givingTime"
          :max="9999"
          style="width: 120px"
        >
          <template slot="addonAfter">{{ givingUnit }}</template>
        </st-input-number>
        <span class="st-des mg-l8" v-if="!isSync">
          已赠送额度{{ info.gift_amount }}{{ givingUnit }}
        </span>
      </st-form-item>
      <st-form-item labelWidth="130px">
        <template slot="label">
          <st-checkbox v-model="switches.frozenTime" @change="onSwitchChange">
            剩余可冻结时长
          </st-checkbox>
        </template>
        <st-input-number
          v-decorator="decorators.frozen_time_remain"
          :disabled="!switches.frozenTime"
          :max="9999"
          style="width: 120px"
        >
          <template slot="addonAfter">天</template>
        </st-input-number>
        <span class="st-des mg-l8" v-if="!isSync">
          {{ info.frozen_time_remain_text }}
        </span>
      </st-form-item>
      <st-form-item v-if="info.transfer" labelWidth="88px">
        <template slot="label">
          <st-checkbox
            v-model="switches.transferSetting"
            @change="onSwitchChange"
          >
            转让设置
          </st-checkbox>
        </template>
        <st-checkbox
          :disabled="!switches.transferSetting"
          v-model="info.transfer.is_transferable"
        >
          支持转让
        </st-checkbox>
        <st-input-number
          v-show="info.transfer.is_transferable"
          v-decorator="decorators.transfer_num"
          style="width: 140px"
          :min="0"
          :max="form.getFieldValue('transfer_unit') === 1 ? 100 : 9999999.9"
          :disabled="!switches.transferSetting"
        >
          <span slot="addonAfter">
            <a-select
              v-decorator="decorators.transfer_unit"
              :options="transferUnitOptions"
              :disabled="!switches.transferSetting"
            ></a-select>
          </span>
        </st-input-number>
      </st-form-item>
      <member-card-course-interests
        v-if="info.course_interests"
        :form="form"
        :required="false"
        :disabled="!switches.courseInterests"
        :type="info.course_interests.course_interests_type"
        :courseIds="info.course_interests.select_courses"
        @change="onCourseInterestsChange"
      >
        <template slot="label">
          <st-checkbox v-model="switches.courseInterests">约课权益</st-checkbox>
        </template>
      </member-card-course-interests>
      <assign-shop
        v-if="info.admission_range"
        :form="form"
        labelWidth="120px"
        :disabled="!switches.entranceShop"
        :required="false"
        :type="info.admission_range.admission_range_type"
        :shopIds="info.admission_range.select_shops"
        @change="onShopChange"
      >
        <template slot="label">
          <st-checkbox v-model="switches.entranceShop">
            支持入场门店
          </st-checkbox>
        </template>
      </assign-shop>
      <!-- <st-form-item labelWidth="120px">
        <template slot="label">
          <st-checkbox v-model="switches.area">VIP场地通行</st-checkbox>
        </template>
        <select-area type="tree" :disabled="!switches.area" />
      </st-form-item>-->
      <!-- <st-form-item>
        <template slot="label">
          <st-checkbox v-model="switches.entranceTime">入场时段</st-checkbox>
        </template>
        <a-radio-group
          :options="inoutTypeOptions"
          :disabled="!switches.entranceTime"
          v-model="info.inout_type"
        ></a-radio-group>
      </st-form-item>
      <shop-hour-picker
        v-if="info.inout_type === 'INOUT_TYPE_CUSTOM'"
        class="mg-b24"
        v-model="timeList"
        :isInfo="!switches.entranceTime"
      ></shop-hour-picker>-->
      <st-form-item label="备注" labelWidth="28px">
        <st-textarea
          v-model="info.description"
          :autosize="{ minRows: 1, maxRows: 6 }"
          placeholder="请输入备注"
          maxlength="200"
        />
      </st-form-item>
    </st-form>
    <template slot="footer">
      <a-popconfirm v-if="isSync" @confirm="onSubmit" placement="topRight">
        <template slot="title">
          <p>
            请再次确认是否同步，同步后会覆盖
            <br />
            售出售出会员卡，将会有2-5s无法正常使用
          </p>
        </template>
        <st-button type="primary" :loading="loading.updateRights">
          确认提交
        </st-button>
      </a-popconfirm>
      <st-button
        v-else
        type="primary"
        @click="onSubmit"
        :loading="loading.updateRights"
      >
        确认提交
      </st-button>
    </template>
  </st-modal>
</template>

<script>
import { UpdateRightsService } from './update-rights.service.ts'
import { ruleOptions } from './update-rights.config'
import { MessageService } from '@/services/message.service'
import AssignShop from '@/views/biz-components/shop/assign-shop/assign-shop'
import MemberCardCourseInterests from '@/views/biz-components/card/member-card-course-interests/member-card-course-interests'
import { CARD_TYPE } from '@/constants/card/member'
// import ShopHourPicker from '@/views/biz-components/shop-hour-picker/shop-hour-picker'
// import SelectArea from '@/views/biz-components/area/select-area/select-area'
import CommonTaskSuccessTip from '@/views/biz-modals/common/task/success-tip'
export default {
  components: {
    AssignShop,
    MemberCardCourseInterests
    // ,
    // ShopHourPicker,
    // SelectArea
  },
  modals: {
    CommonTaskSuccessTip
  },
  serviceInject() {
    return {
      messageService: MessageService,
      updateRightsService: UpdateRightsService
    }
  },
  rxState() {
    const {
      info$,
      loading$,
      transferUnitOptions$,
      inoutTypeOptions$,
      supportMemberNumOptions$
    } = this.updateRightsService
    return {
      info: info$,
      loading: loading$,
      transferUnitOptions: transferUnitOptions$,
      inoutTypeOptions: inoutTypeOptions$,
      supportMemberNumOptions: supportMemberNumOptions$
    }
  },
  props: {
    id: {
      type: Number,
      default: 0
    },
    /**
     * 是否是会员卡列表的同步售出权益操作
     */
    isSync: {
      type: Boolean,
      default: false
    },
    isShowLink: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false,
      timeList: [],
      INOUT_TYPE_CUSTOM: 2,
      CARD_TYPE,
      TYPE_MULII_CARD: 2,
      switches: {
        entranceNum: 0,
        givingTime: 0,
        frozenTime: 0,
        transferSetting: 0,
        courseInterests: 0,
        entranceShop: 0
        // ,
        // area: 0,
        // entranceTime: 0
      }
    }
  },
  computed: {
    title() {
      return (
        '修改售出权益' + (this.isSync ? '-选中权益点信息会同步到已售合同' : '')
      )
    },
    givingUnit() {
      return this.info.card_type === CARD_TYPE.NUMBER ? '次' : '天'
    }
  },
  created() {
    this.updateRightsService.getInfo(this.id, this.isSync).subscribe(res => {
      this.$nextTick(() => {
        this.setFieldsValue(res.info)
      })
    })
  },
  methods: {
    onShopChange(type, shopIds) {
      this.info.admission_range.admission_range_type = type
      this.info.admission_range.select_shops = shopIds
    },
    onCourseInterestsChange(type, courseIds) {
      this.info.course_interests.course_interests_type = type
      this.info.course_interests.select_courses = courseIds
    },
    setFieldsValue(info) {
      const { gift_remain, frozen_time_remain } = info
      const { transfer_num, transfer_unit } = info.transfer
      this.form.setFieldsValue({
        gift_remain,
        frozen_time_remain,
        transfer_num,
        transfer_unit: transfer_unit || 1
      })
    },
    onSwitchChange() {
      this.form.validateFields(
        ['gift_remain', 'frozen_time_remain', 'transfer_num', 'transfer_unit'],
        { force: true }
      )
    },
    checkIsChanged() {
      let isChanged = false
      const { switches } = this
      for (let i in switches) {
        if (switches[i]) {
          isChanged = true
          return true
        }
      }
      return isChanged
    },
    inputCheck() {
      const { switches } = this
      const { admission_range, course_interests } = this.info
      if (
        switches.courseInterests &&
        course_interests.course_interests_type === -1
      ) {
        this.messageService.error({
          content: '请选择约课权益'
        })
        return false
      }
      if (
        switches.entranceShop &&
        admission_range.admission_range_type === -1
      ) {
        this.messageService.error({
          content: '请选择支持入场门店'
        })
        return false
      }
      return true
    },
    onSubmit() {
      if (!this.checkIsChanged()) {
        return this.messageService.error({
          content: '未进行任何修改，无法确认'
        })
      }
      this.form.validate().then(values => {
        if (!this.inputCheck()) {
          return
        }
        this.doSubmit(values)
      })
    },
    doSubmit(values) {
      const {
        transfer,
        admission_range,
        support_member_num,
        course_interests,
        description
      } = this.info
      const { gift_remain, frozen_time_remain } = values
      const { switches } = this
      const params = {
        is_change_support_member_num: switches.entranceNum,
        support_member_num,
        is_change_gift_remain: switches.givingTime,
        gift_remain,
        is_change_frozen_time_remain: switches.frozenTime,
        frozen_time_remain,
        is_change_transferable: switches.transferSetting,
        is_transferable: transfer.is_transferable,
        transfer_num: values.transfer_num,
        transfer_unit: values.transfer_unit,
        is_change_course_interests: switches.courseInterests,
        course_interests: course_interests.course_interests_type,
        select_courses: course_interests.select_courses,
        is_change_admission_range: switches.entranceShop,
        admission_range: admission_range.admission_range_type,
        select_shops: admission_range.select_shops,
        description
      }
      this.updateRightsService
        .updateRights(this.id, params, this.isSync)
        .subscribe(() => {
          if (this.isSync) {
            this.onSyncSubmitSuccess()
          } else {
            this.onSubmitSuccess()
          }
        })
    },
    onSubmitSuccess() {
      this.messageService.success({
        content: '提交成功'
      })
      this.show = false
      this.$emit('success')
    },
    /**
     * 会员卡售出权益同步成功回调
     */
    onSyncSubmitSuccess() {
      this.show = false
      this.successTip()
    },
    successTip() {
      this.$modalRouter.push({
        name: 'common-task-success-tip',
        props: {
          isShowLink: this.isShowLink
        },
        on: {
          success: () => {
            this.$emit('success')
          }
        }
      })
    }
  }
}
</script>
