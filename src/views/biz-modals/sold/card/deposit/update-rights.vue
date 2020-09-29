<template>
  <st-modal title="修改售出权益" v-model="show">
    <st-form :form="form">
      <st-form-item labelWidth="120px" class="mg-b12">
        <template slot="label">
          <st-checkbox v-model="switches.consumeType">
            支持消费类型
          </st-checkbox>
        </template>
        <a-checkbox-group
          v-model="info.support_consumers"
          :disabled="!switches.consumeType"
        >
          <a-row>
            <a-col
              :span="12"
              v-for="item in consumeTypeOptions"
              :key="item.value"
              class="mg-b12"
            >
              <a-checkbox :value="item.value">{{ item.label }}</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
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
      <assign-shop
        v-if="info.consumption_range"
        :form="form"
        labelWidth="120px"
        :type="info.consumption_range.consumption_range_type"
        :shopIds="info.consumption_range.select_shops"
        :required="false"
        :disabled="!switches.consumeShop"
        @change="onShopChange"
      >
        <template slot="label">
          <st-checkbox v-model="switches.consumeShop">
            支持消费门店
          </st-checkbox>
        </template>
      </assign-shop>
    </st-form>
    <template slot="footer">
      <st-button
        @click="onSubmit"
        type="primary"
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
export default {
  components: {
    AssignShop
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
      consumeTypeOptions$,
      transferUnitOptions$
    } = this.updateRightsService
    return {
      info: info$,
      loading: loading$,
      consumeTypeOptions: consumeTypeOptions$,
      transferUnitOptions: transferUnitOptions$
    }
  },
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false,
      switches: {
        consumeType: 0,
        transferSetting: 0,
        consumeShop: 0
      }
    }
  },
  created() {
    this.updateRightsService.getInfo(this.id).subscribe(res => {
      this.$nextTick(() => {
        this.setFieldsValue(res.info)
      })
    })
  },
  methods: {
    onShopChange(type, shopIds) {
      this.info.consumption_range.consumption_range_type = type
      this.info.consumption_range.select_shops = shopIds
    },
    setFieldsValue(info) {
      const { transfer_num, transfer_unit } = info.transfer
      this.form.setFieldsValue({
        transfer_num,
        transfer_unit: transfer_unit || 1
      })
    },
    onSwitchChange() {
      this.form.validateFields(['transfer_num', 'transfer_unit'], {
        force: true
      })
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
          content: '未进行任何修改，无法确认'
        })
      }
      this.form.validate().then(values => {
        const { transfer, consumption_range, support_consumers } = this.info
        const { switches } = this
        const params = {
          is_change_consumers: switches.consumeType,
          consumption_range_type: consumption_range.consumption_range_type,
          support_consumers,
          is_change_transferable: switches.transferSetting,
          transfer_num: values.transfer_num,
          transfer_unit: values.transfer_unit,
          is_transferable: transfer.is_transferable,
          is_change_consumption_range: switches.consumeShop,
          select_shops: consumption_range.select_shops
        }
        this.updateRightsService
          .updateRights(this.id, params)
          .subscribe(this.onSubmitSuccess)
      })
    },
    onSubmitSuccess() {
      this.messageService.success({
        content: '提交成功'
      })
      this.show = false
      this.$emit('success')
    }
  }
}
</script>
