<template>
  <st-modal
    title="绑定实体卡"
    @ok="save"
    v-model="show"
    size="small"
    wrapClassName="shop-binding-card"
  >
    <section>
      <st-form :form="form" @submit="save" labelWidth="67px">
        <st-info>
          <st-info-item label="姓名">{{ record.member_name }}</st-info-item>
          <st-info-item label="手机号">{{ record.mobile }}</st-info-item>
        </st-info>
        <st-form-item label="实体卡号" required>
          <a-input
            placeholder="输入实体卡号"
            v-decorator="decorators.card_num"
          />
        </st-form-item>
        <st-form-item label="物理ID" required>
          <a-input
            placeholder="请将实体卡置于读卡器上"
            v-decorator="decorators.rfid"
          />
        </st-form-item>
      </st-form>
    </section>
    <section></section>
  </st-modal>
</template>
<script>
import { BindingEntityCardService } from './binding-entity-card.service'
import { ruleOptions } from './binding-entity-card.config'
export default {
  serviceInject() {
    return {
      service: BindingEntityCardService
    }
  },
  name: 'bindingEntityCard',
  bem: {
    b: 'shop-binding-card'
  },
  props: {
    record: {
      type: Object
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false
    }
  },
  methods: {
    save(e) {
      e.preventDefault()
      this.form.validate().then(values => {
        values.card_num =
          typeof values.card_num === 'string'
            ? values.card_num.trim()
            : values.card_num
        values.rfid =
          typeof values.rfid === 'string' ? values.rfid.trim() : values.rfid
        this.getLableList(values)
      })
    },
    getLableList(data) {
      this.service
        .getMemberCard(this.record.member_id, data)
        .subscribe(state => {
          this.show = false
          this.$emit('success')
        })
    }
  }
}
</script>
