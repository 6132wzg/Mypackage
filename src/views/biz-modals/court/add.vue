<template>
  <st-modal title="创建场地" v-model="show" wrapClassName="modal-court-add">
    <st-form :form="form" labelWidth="68px" labelGutter="16px">
      <st-form-item label="场地名称" required>
        <a-input
          placeholder="请输入场地名称，不超过10个字"
          maxlength="10"
          v-decorator="decorators.area_name"
        />
      </st-form-item>
      <st-form-item label="场地属性" required>
        <a-radio-group
          @change="onChooseRadio"
          v-decorator="decorators.area_type"
        >
          <a-radio
            v-for="(item, index) in areaType"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
      </st-form-item>
      <st-form-item label="容纳人数" v-if="isShowPersonNum" class="mg-b0">
        <st-input-number
          placeholder="请输入最大容纳人数，1-999"
          :min="1"
          :max="999"
          v-decorator="decorators.contain_number"
        />
      </st-form-item>
    </st-form>
    <template slot="footer">
      <st-button type="primary" :loading="loading.add" @click="onSubmit">
        保存
      </st-button>
    </template>
  </st-modal>
</template>

<script>
import { AddService } from './add.service'
import { MessageService } from '@/services/message.service'
import { PatternService } from '@/services/pattern.service'
import { ruleOptions } from './court.config'
import { AREA_TYPE } from '@/constants/setting/court'

export default {
  serviceInject() {
    return {
      addService: AddService,
      messageService: MessageService,
      pattern: PatternService
    }
  },
  rxState() {
    return {
      loading: this.addService.loading$,
      areaType: this.addService.areaType$
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false,
      isShowPersonNum: true,
      AREA_TYPE
    }
  },
  methods: {
    onSubmit() {
      this.form.validate().then(() => {
        const data = this.getData()
        this.addService.add(data).subscribe(this.onSubmitSuccess)
      })
    },
    onCancel() {
      this.show = false
    },
    getData() {
      const data = this.form.getFieldsValue()
      data.area_type = this.area_type
      return data
    },
    onChooseRadio(e) {
      this.area_type = e.target.value
      if (this.area_type === AREA_TYPE.GATE) {
        this.isShowPersonNum = false
      } else {
        this.isShowPersonNum = true
      }
    },
    onSubmitSuccess() {
      this.messageService.success({
        content: '新增成功'
      })
      this.$emit('change')
      this.show = false
    }
  }
}
</script>
