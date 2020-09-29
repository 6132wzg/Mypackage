<template>
  <st-modal
    title="下架课程包"
    @ok="onOffsale"
    okText="确认下架"
    width="500px"
    v-model="show"
  >
    <div :class="bModal()">
      <st-form :form="form">
        <template v-if="pageType === 'brand'">
          <st-form-item label="课程包名称" labelWidth="128px">
            {{ info$.course_name }}
          </st-form-item>
          <st-form-item label="当前上架门店(家)" labelWidth="128px">
            {{ info$.upshelf_shop_num }}
            <span :class="bModal('tip')">（不含已下架门店）</span>
          </st-form-item>
          <st-form-item label="当前有效课程包" labelWidth="128px">
            {{ info$.valid_package_num }}
            <span :class="bModal('tip')">（不含过期课程包）</span>
          </st-form-item>
          <st-form-item label="下架门店" required labelWidth="128px">
            <a-select
              v-decorator="decorators.shop_ids"
              mode="multiple"
              placeholder="请选择下架门店"
              :options="shopOptions$"
            ></a-select>
          </st-form-item>
        </template>
        <st-form-item v-else label="课程包名称" labelWidth="128px">
          {{ shopPackageName }}
        </st-form-item>

        <st-form-item label="下架原因" required labelWidth="128px">
          <st-textarea
            v-decorator="decorators.reason"
            :maxlength="500"
            placeholder="请输入下架原因"
          ></st-textarea>
        </st-form-item>
      </st-form>
    </div>
  </st-modal>
</template>
<script>
import { OffSalesService } from './off-sales.service'
import { ruleOptions } from './off-sales.config'
export default {
  name: 'PackageOffSales',
  bem: {
    bModal: 'modal-package-off-sales'
  },
  serviceInject() {
    return {
      service: OffSalesService
    }
  },
  serviceProviders() {
    return [OffSalesService]
  },
  rxState() {
    const { info$, shopOptions$ } = this.service
    return {
      info$,
      shopOptions$
    }
  },
  props: {
    id: [String, Number],
    pageType: [String],
    shopPackageName: String
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
    onOffsale() {
      this.form.validate().then(values => {
        this.service
          .setDownShelf({ id: this.id, ...values, pageType: this.pageType })
          .subscribe(res => {
            this.$emit('success')
            this.show = false
          })
      })
    }
  },
  created() {
    if (this.pageType === 'shop') {
      return
    }
    const { id, pageType } = this
    this.service.getDownShelfInfo({ id, pageType }).subscribe()
  },
  mounted() {
    if (this.pageType === 'shop') return
    this.service.getShopList(this.id).subscribe(res => {
      this.$nextTick().then(() => {
        this.form.setFieldsValue({
          shop_ids: this.shopOptions$.map(item => item.value)
        })
      })
    })
  }
}
</script>
