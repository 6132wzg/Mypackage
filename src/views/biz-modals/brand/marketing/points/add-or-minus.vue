<template>
  <st-modal
    :title="title"
    v-model="show"
    width="600px"
    @cancel="show = false"
    @ok="addOrMinusPoints"
  >
    <st-form :form="form" labelWidth="66px">
      <st-form-item label="选择" v-if="isBatch">
        已选{{ memberLength }}条数据
      </st-form-item>
      <st-form-item label="会员" v-if="!isBatch">
        {{ query.memberName }}
      </st-form-item>
      <st-form-item label="积分数" required>
        <st-input-number
          v-decorator="decorators.points"
          style="width: 120px"
          placeholder="请输入"
          :min="1"
          :max="99999"
          :step="1"
          :float="true"
        >
          <template slot="addonAfter">
            积分
          </template>
        </st-input-number>
      </st-form-item>
      <st-form-item label="备注" style="margin-bottom: 0">
        <st-textarea
          v-decorator="decorators.remark"
          placeholder="请输入备注"
          maxlength="99"
          :autosize="{
            minRows: 1,
            maxRow: 2
          }"
        ></st-textarea>
      </st-form-item>
    </st-form>
  </st-modal>
</template>
<script>
import { ruleOptions } from './add-or-minus.config'
import { AddByBatchService } from './add-or-minus.service'
export default {
  name: 'BrandMarketingAddPoints',
  bem: {
    basic: 'brand-marketing-plugin-points-add'
  },
  serviceInject() {
    return {
      service: AddByBatchService
    }
  },
  props: {
    query: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: 'add'
    }
  },
  computed: {
    memberLength() {
      return this.query.member_ids ? this.query.member_ids.length : 0
    },
    title() {
      return (
        {
          add: '添加积分',
          'shop-add': '添加积分',
          'add-by-batch': '批量添加积分',
          minus: '扣减积分',
          'shop-minus': '扣减积分',
          'minus-by-batch': '批量扣减积分'
        }[this.type] || '增减积分'
      )
    },
    isBatch() {
      return ['add-by-batch', 'minus-by-batch'].includes(this.type)
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions(this.type))
    return {
      form,
      decorators,
      show: false
    }
  },
  methods: {
    addOrMinusPoints() {
      this.form.validate().then(values => {
        this.service
          .addOrMinusPoints({ ...this.query, ...values }, this.type)
          .subscribe(res => {
            this.$emit('done')
            this.show = false
          })
      })
    }
  }
}
</script>
