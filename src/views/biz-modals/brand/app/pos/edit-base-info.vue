<template>
  <st-modal title="更改POS机信息" v-model="show" width="484px">
    <st-form :form="form" labelWidth="110px" labelGutter="24px">
      <st-form-item label="门店" required>
        <a-select v-decorator="decorators.shop_id" placeholder="请选择门店">
          <a-select-option v-for="item in shopList" :key="item.id">
            {{ item.shop_name }}
          </a-select-option>
        </a-select>
      </st-form-item>
      <st-form-item label="自定义设备名称" required>
        <st-input
          :maxLength="15"
          placeholder="支持中英文,数字"
          v-decorator="decorators.terminal_name"
        />
      </st-form-item>
      <st-form-item label="设备号" required style="margin-bottom: 0">
        {{ info.terminal_no }}
      </st-form-item>
    </st-form>
    <template slot="footer">
      <st-button
        @click="onSubmit"
        :loading="loading.addPos"
        type="primary"
        style="width: 88px"
      >
        保&nbsp;存
      </st-button>
    </template>
  </st-modal>
</template>
<script>
import { PluginPosService } from './pos.service'
import { ruleOptions } from './edit-base-info.config'
export default {
  serviceInject() {
    return {
      service: PluginPosService
    }
  },
  rxState() {
    return {
      loading: this.service.loading$,
      shopList: this.service.shopList$,
      info: this.service.info$
    }
  },
  components: {},
  name: 'editPosInfo',
  props: {
    terminal_id: {}
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
  created() {
    this.service.init().subscribe(res => {
      this.service
        .getPosInfo({
          terminal_id: this.terminal_id
        })
        .subscribe(res => {
          this.$nextTick(() => {
            console.log('res.info', res.info)
            this.form.setFieldsValue({
              terminal_name: res.info.name,
              shop_id: res.info.shop_id
            })
          })
        })
    })
  },
  methods: {
    onSubmit() {
      this.form.validate().then(values => {
        values.terminal_id = this.terminal_id
        this.service.editPos(values).subscribe(state => {
          this.show = false
          this.$emit('success', true)
        })
      })
    }
  }
}
</script>
