<template>
  <st-modal
    title="批量修改价格"
    size="small"
    v-model="show"
    @ok="onSubmit"
    @cancel="onCancel"
    :confirmLoading="loading.updatePrice"
  >
    <st-form :form="form" labelWidth="80px">
      <st-form-item label="选择" required>
        <st-batch-select-radio
          :ids="ids"
          v-model="batch_type"
          :total="total"
        ></st-batch-select-radio>
      </st-form-item>
      <st-form-item label="价格" required>
        <st-input-number
          placeholder="请输入售卖价格"
          v-decorator="decorators.price_num"
        >
          <template slot="addonAfter">
            元/天
          </template>
        </st-input-number>
      </st-form-item>
      <st-form-item label="转让手续费">
        <st-input-number placeholder="" v-decorator="decorators.transfer_num">
          <template slot="addonAfter">
            <a-select v-model="transferUnit">
              <a-select-option
                v-for="(item, index) in transferUnits"
                :key="index"
                :value="+item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </template>
        </st-input-number>
        <div class="mg-t8">
          <i class="color-danger mg-r4">*</i>
          <span style="color: #9bacb9">已经售卖的储物柜不受影响</span>
        </div>
      </st-form-item>
    </st-form>
  </st-modal>
</template>
<script>
import { MessageService } from '@/services/message.service'
import { EditPriceService as EditService } from './edit-price.service'
import { ruleOptions } from './cabinet.config'
import { BATCH_TYPE } from '@/constants/common/batch-operation'
export default {
  serviceInject() {
    return {
      messageService: MessageService,
      editService: EditService
    }
  },
  rxState() {
    return {
      loading: this.editService.loading$,
      transferUnits: this.editService.transferUnits$
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false,
      transferUnit: 1,
      BATCH_TYPE,
      batch_type: BATCH_TYPE.SELECTED
    }
  },
  props: {
    ids: {
      type: Array,
      default() {
        return []
      }
    },
    total: {
      type: Number,
      default: 0
    },
    cabinet_area_id: {
      type: Number,
      default: 0
    },
    keywords: {
      type: String,
      default: ''
    },
    battery: {
      type: String,
      default: 'all'
    },
    cabinet_business_type: {
      type: Number,
      default: -1
    }
  },
  methods: {
    onSubmit(e) {
      e.preventDefault()
      this.form.validate().then(data => {
        if (this.batch_type === 1) {
          data.ids = this.ids
        }
        data.transfer_unit = this.transferUnit
        data.batch_type = this.batch_type
        data.cabinet_area_id = this.cabinet_area_id
        data.keywords = this.keywords
        data.battery = this.battery
        data.cabinet_business_type = this.cabinet_business_type
        this.editService.updatePrice(data).subscribe(this.onSubmitSuccess)
      })
    },
    onCancel() {
      this.show = false
    },
    onSubmitSuccess() {
      this.messageService.success({
        content: '修改成功'
      })
      this.show = false
      this.$emit('change')
    }
  }
}
</script>
