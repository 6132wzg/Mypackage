<template>
  <st-modal title="添加POS机" v-model="show" width="484px">
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
          placeholder="支持中英文,数字"
          :maxLength="15"
          v-decorator="decorators.terminal_name"
        />
      </st-form-item>
      <st-form-item label="设备号" required style="margin-bottom: 0">
        <a-select
          v-decorator="decorators.terminal_id"
          placeholder="请选择设备号"
        >
          <a-select-option v-for="item in deviceList" :key="item.id">
            {{ item.terminal_no }}
          </a-select-option>
        </a-select>
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
import { ruleOptions } from './add-pos.config'
export default {
  serviceInject() {
    return {
      service: PluginPosService
    }
  },
  rxState() {
    return {
      loading: this.service.loading$,
      deviceList: this.service.deviceList$,
      shopList: this.service.shopList$
    }
  },
  components: {},
  name: 'addPos',
  props: {},
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
        .getEnablePosDeviceList({
          status: 3
        })
        .subscribe()
    })
  },
  methods: {
    onSubmit() {
      this.form.validate().then(values => {
        this.service.addPos(values).subscribe(state => {
          this.show = false
          this.$emit('success', true)
        })
      })
    }
  }
}
</script>
