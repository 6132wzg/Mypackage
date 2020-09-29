<template>
  <st-modal :title="title" v-model="show">
    <st-form :form="form">
      <st-form-item labelWidth="120px">
        <template slot="label">
          <st-checkbox v-model="switches.supportNum">
            支持入场人数
          </st-checkbox>
        </template>
        <st-input-number
          v-decorator="decorators.support_num"
          :disabled="!switches.supportNum"
          :min="1"
          :max="20"
          style="width: 120px"
        >
          <template slot="addonAfter">人</template>
        </st-input-number>
      </st-form-item>
      <st-form-item labelWidth="120px">
        <template slot="label">
          <st-checkbox v-model="switches.frozenTime" @change="onSwitchChange">
            剩余冻结时长
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
      <st-form-item v-if="info.reserve" labelWidth="88px">
        <template slot="label">
          <st-checkbox
            v-model="switches.reserveSetting"
            @change="onSwitchChange"
          >
            约课限制
          </st-checkbox>
        </template>
        <a-select
          style="width: 160px; margin-right: 10px;"
          v-model="info.reserve.reserve_is_limit"
          :options="reserveIsLimitNewOptions"
          :disabled="!switches.reserveSetting"
        ></a-select>
        <st-input-number
          v-decorator="decorators.reserve_limit_times"
          v-show="info.reserve.reserve_is_limit === 1"
          :min="1"
          :max="999"
          :disabled="!switches.reserveSetting"
          style="width: 200px"
        >
          <a-select
            v-decorator="decorators.reserve_limit_day"
            slot="addonBefore"
            :disabled="!switches.reserveSetting"
            :options="reserveLimitDayOptions"
          ></a-select>
          <template slot="addonAfter">节</template>
        </st-input-number>
        <span class="st-des mg-l8">该限制仅生效于小程序</span>
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
import CommonTaskSuccessTip from '@/views/biz-modals/common/task/success-tip'
export default {
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
      supportMemberNumOptions$,
      reserveLimitDayOptions$,
      reserveIsLimitNewOptions$
    } = this.updateRightsService
    return {
      info: info$,
      loading: loading$,
      transferUnitOptions: transferUnitOptions$,
      supportMemberNumOptions: supportMemberNumOptions$,
      reserveLimitDayOptions: reserveLimitDayOptions$,
      reserveIsLimitNewOptions: reserveIsLimitNewOptions$
    }
  },
  props: {
    id: {
      type: Number,
      default: 0
    },
    /**
     * 是否是课程包列表的同步售出权益操作
     */
    isSync: {
      type: Boolean,
      default: false
    },
    isShowLink: {
      type: Boolean,
      default: true
    },
    isBrandTaskLink: {
      type: Boolean,
      default: false
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
      switches: {
        supportNum: 0,
        frozenTime: 0,
        transferSetting: 0,
        reserveSetting: 0
      }
    }
  },
  computed: {
    title() {
      return (
        '修改售出权益' + (this.isSync ? '-选中权益点信息会同步到已售合同' : '')
      )
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
    setFieldsValue(info) {
      const { frozen_time_remain, support_num } = info
      const { transfer_num, transfer_unit } = info.transfer
      const {
        reserve_limit_day,
        reserve_limit_times,
        reserve_is_limit
      } = info.reserve
      this.form.setFieldsValue({
        support_num,
        frozen_time_remain,
        transfer_num,
        transfer_unit: transfer_unit || 1,
        reserve_limit_day: reserve_limit_day || 1,
        reserve_limit_times,
        reserve_is_limit
      })
    },
    onSwitchChange() {
      this.form.validateFields(
        [
          'transfer_num',
          'transfer_unit',
          'frozen_time_remain',
          'reserve_limit_times'
        ],
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
    onSubmit() {
      if (!this.checkIsChanged()) {
        return this.messageService.error({
          content: '未进行任何操作，请勿提交'
        })
      }
      this.form.validate().then(values => {
        this.doSubmit(values)
      })
    },
    doSubmit(values) {
      const { transfer, support_member_num, reserve } = this.info
      const { frozen_time_remain, support_num } = values
      const { switches } = this
      const params = {
        id: this.id,
        support_num,
        is_change_support_num: switches.supportNum,
        frozen_time_remain,
        is_change_frozen_time_remain: switches.frozenTime,
        transfer: {
          is_transferable: transfer.is_transferable,
          transfer_num: values.transfer_num,
          transfer_unit: values.transfer_unit
        },
        is_change_transfer: switches.transferSetting,
        reserve: {
          reserve_is_limit: reserve.reserve_is_limit,
          reserve_limit_day: values.reserve_limit_day,
          reserve_limit_times: values.reserve_limit_times
        },
        is_change_reserve: switches.reserveSetting
      }
      this.updateRightsService
        .updateRights(params, this.isSync)
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
     * 课程包售出权益同步成功回调
     */
    onSyncSubmitSuccess() {
      this.show = false
      this.successTip()
    },
    successTip() {
      this.$modalRouter.push({
        name: 'common-task-success-tip',
        props: {
          isShowLink: this.isShowLink,
          isBrandTaskLink: this.isBrandTaskLink
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
