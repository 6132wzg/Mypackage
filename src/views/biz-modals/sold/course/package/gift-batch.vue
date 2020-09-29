<template>
  <st-modal
    title="课程包赠送额度"
    v-model="show"
    @ok="setGiftPackage"
    width="484px"
    @cancel="show = false"
    wrapClassName="modal-sold-course-gift"
  >
    <st-form :form="form">
      <st-form-item
        label="选择"
        required
        labelWidth="68px"
        :help="helpText"
        :validateStatus="helpShow ? 'error' : ''"
      >
        <st-batch-select-radio
          :ids="this.ids"
          v-model="batch_type"
          :total="listNum$"
        ></st-batch-select-radio>
      </st-form-item>
      <st-form-item label="赠送额度" labelWidth="68px" required>
        <!-- 任意和范围内课程 start -->
        <st-input-number
          :max="999"
          :min="1"
          style="width: 121px"
          v-if="giftType === 'day'"
          placeholder="0"
          v-decorator="decorators.gift_time_quota"
        >
          <span slot="addonAfter">
            天
          </span>
        </st-input-number>
        <!-- 任意和范围内课程  end -->
        <!-- 范围限次内 start -->
        <div v-else>
          <div :class="b('form-item-wapper')">
            <div :class="b('form-item')">
              <span class="mg-r8">团体课</span>
              <st-input-number
                :max="999"
                :min="1"
                style="width: 121px"
                placeholder="0"
                v-decorator="decorators.gift_team_times"
              >
                <span slot="addonAfter">
                  次
                </span>
              </st-input-number>
            </div>
            <span :class="b('tip')">
              赠送给「仅支持预约团体课X次」和「支持预约团体课X次&私教课X次」的售出
            </span>
          </div>
          <div :class="b('form-item-wapper')">
            <div :class="b('form-item')">
              <span class="mg-r8">私教课</span>
              <st-input-number
                :max="999"
                :min="1"
                style="width: 121px"
                placeholder="0"
                v-decorator="decorators.gift_personal_times"
              >
                <span slot="addonAfter">
                  次
                </span>
              </st-input-number>
            </div>

            <span :class="b('tip')">
              赠送给「仅支持预约私体课X次」和「支持预约团体课X次&私教课X次」的售出
            </span>
          </div>
          <div :class="b('form-item-wapper')">
            <div :class="b('form-item')">
              <span class="mg-r8">团体课&私教课</span>
              <st-input-number
                :max="999"
                :min="1"
                style="width: 121px"
                placeholder="0"
                v-decorator="decorators.gift_total_times"
              >
                <span slot="addonAfter">
                  次
                </span>
              </st-input-number>
            </div>

            <span :class="b('tip')">
              赠送给「支持预约团体课&私教课共X次」的售出
            </span>
          </div>
        </div>

        <!-- 范围限次内  end-->
      </st-form-item>
      <st-form-item labelWidth="68px" label="备注" class="mg-b0">
        <st-textarea
          v-decorator="decorators.description"
          placeholder="请输入备注"
          maxlength="200"
          :autosize="{ minRows: 2, maxRows: 4 }"
        />
      </st-form-item>
    </st-form>
  </st-modal>
</template>

<script>
import { GiftBatchService } from './gift-batch.service'
import { ruleOptions } from './gift-batch.config'
import { BATCH_TYPE, BATCH_INFO } from '@/constants/common/batch-operation'
export default {
  name: 'ModalGiftBatch',
  bem: {
    b: 'modal-gift-batch'
  },
  serviceInject() {
    return {
      service: GiftBatchService
    }
  },
  rxState() {
    const { listNum$ } = this.service
    return { listNum$ }
  },
  props: {
    ids: {
      type: Array,
      default: () => []
    },
    searchQuery: {
      type: Object,
      default: () => {}
    },
    giftType: {
      type: String,
      default: 'null'
    }
  },
  data() {
    const form = this.$stForm.create()
    return {
      BATCH_TYPE,
      BATCH_INFO,
      form,
      show: false,
      batch_type: BATCH_TYPE.SELECTED
    }
  },
  computed: {
    ruleOptions,
    helpText() {
      return this.list_num > this.BATCH_INFO.LIMIT_NUM
        ? this.BATCH_INFO.ERROR_TIP
        : ''
    },
    helpShow() {
      return this.list_num > this.BATCH_INFO.LIMIT_NUM
    },
    decorators() {
      return this.form.decorators(ruleOptions)
    },
    isLimit() {
      return this.searchQuery.is_limit
    }
  },
  methods: {
    setGiftPackage() {
      this.form.validate().then(values => {
        this.service
          .setGiftPackage({
            batch_type: this.batch_type,
            sold_ids: this.ids,
            conditions: this.searchQuery,
            ...values
          })
          .subscribe(res => {
            this.$emit('success')
            this.show = false
          })
      })
    }
  },
  mounted() {
    this.service.getPackageTaskNum(this.searchQuery).subscribe()
  }
}
</script>
