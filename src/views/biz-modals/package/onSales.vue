<template>
  <st-modal
    title="上架课程包"
    okText="确认上架"
    @ok="onOnsale"
    :confirmLoading="loading$.getUpShelfInfo"
    wrapClassName="modal-shop-product-course-package"
    v-model="show"
  >
    <st-form :form="form">
      <st-form-item label="课程包名称" labelWidth="128px">
        {{ info$.course_name }}
      </st-form-item>
      <st-form-item
        v-if="pageType === 'brand'"
        label="当前上架门店"
        labelWidth="128px"
      >
        {{ info$.upshelf_shop_num }}
      </st-form-item>
      <st-form-item
        v-if="pageType === 'brand'"
        label="支持售卖门店数"
        labelWidth="128px"
      >
        {{ info$.support_shop_num }}
      </st-form-item>
      <st-form-item label="支持售卖时间" labelWidth="128px" required>
        <div v-if="info$.is_permanent_sale">永久售卖</div>
        <div v-else>
          <!-- <st-range-picker
            v-show="channel === 'shop'"
            v-decorator="decorators.sale_date"
            :disabledDays="180"
            disabled
            @change="onSaleDate"
          /> -->
          <span>{{ saleDate }}</span>
        </div>
      </st-form-item>
    </st-form>
  </st-modal>
</template>
<script>
import { OnSalesService } from './on-sales.service'
import { ruleOptions } from './onSales.config'
export default {
  name: 'ModalPackageOnSale',
  bem: {
    bModal: 'modal-package-on-sale'
  },
  serviceInject() {
    return {
      service: OnSalesService
    }
  },
  serviceProviders() {
    return [OnSalesService]
  },
  rxState() {
    const { info$, loading$ } = this.service
    return { info$, loading$ }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false,
      sale_start_time: '',
      sale_end_time: ''
    }
  },
  props: {
    id: {
      type: [String, Number]
    },
    channel: {
      type: String
    },
    pageType: [String]
  },
  computed: {
    saleDate() {
      return `${moment(this.sale_start_time).format('YYYY-MM-DD')} ~ ${moment(
        this.sale_end_time
      ).format('YYYY-MM-DD')}`
    }
  },
  methods: {
    onOnsale() {
      this.form.validate().then(values => {
        let { id, channel, pageType, sale_start_time, sale_end_time } = this
        let form = { id }
        if (channel === 'shop') {
          form = {
            ...form,
            sale_start_time,
            sale_end_time
          }
        }
        this.service.setUpShelf({ ...form, pageType }).subscribe(res => {
          this.$emit('success')
          this.show = false
        })
      })
    },
    onSaleDate(value) {
      this.sale_start_time = moment(value[0]).format('YYYY-MM-DD')
      this.sale_end_time = moment(value[1]).format('YYYY-MM-DD')
    }
  },
  created() {
    const { id, pageType } = this
    this.service.getUpShelfInfo({ id, pageType }).subscribe(res => {
      this.$nextTick().then(() => {
        this.form.setFieldsValue({
          sale_date: [res.info.sale_start_time, res.info.sale_end_time]
        })
        this.sale_start_time = moment(res.info.sale_start_time).format(
          'YYYY-MM-DD'
        )
        this.sale_end_time = moment(res.info.sale_end_time).format('YYYY-MM-DD')
      })
    })
  }
}
</script>
