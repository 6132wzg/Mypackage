<template>
  <st-modal v-model="show" @ok="onSubmit" title="去发货" size="small">
    <st-form :form="form">
      <st-form-item label="物流公司" required>
        <!-- <a-input
          placeholder="请输入物流公司"
          v-decorator="decorators.expressCompany"
        /> -->
        <a-select
          showSearch
          allowClear
          placeholder="请输入物流公司"
          :defaultActiveFirstOption="false"
          :showArrow="false"
          :filterOption="false"
          v-decorator="decorators.expressCompany"
          @search="onCompanySearch"
          notFoundContent="无搜索结果"
        >
          <a-select-option
            v-for="(item, index) in dataList"
            :value="item.company_name"
            :key="index"
          >
            <span
              v-html="
                `${item.company_name}`.replace(
                  new RegExp(searchText, 'g'),
                  `\<span class='global-highlight-color'\>${searchText}\<\/span\>`
                )
              "
            >
              {{ item.company_name }}
            </span>
          </a-select-option>
        </a-select>
      </st-form-item>
      <st-form-item label="物流单号" required>
        <a-input
          placeholder="请输入物流单号"
          v-decorator="decorators.expressNumber"
        />
      </st-form-item>
    </st-form>
  </st-modal>
</template>

<script>
import { ruleOptions } from './deliver-good.config'
import { DeliverGoodService } from './deliver-good.service'
export default {
  name: 'modalStoreDeliverGood',
  props: ['id'],
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      show: false,
      form,
      decorators,
      searchText: ''
    }
  },
  serviceInject() {
    return { deliverGoodService: DeliverGoodService }
  },
  rxState() {
    return {
      dataList: this.deliverGoodService.list$
    }
  },
  methods: {
    onSubmit() {
      this.form.validate().then(values => {
        this.deliverGoodService
          .sendOption({
            express_company: values.expressCompany,
            express_number: values.expressNumber,
            id: this.id
          })
          .subscribe(res => {
            this.show = false
            this.$emit('success')
          })
      })
    },
    onCompanySearch(data) {
      this.searchText = data
      if (data === '') {
        this.deliverGoodService.list$.commit(() => [])
        this.form.resetFields(['expressCompany'])
      } else {
        this.deliverGoodService
          .getCompanyList({ name: data })
          .subscribe(res => {
            if (!res.list.length) {
              this.form.resetFields(['expressCompany'])
            }
          })
      }
    }
  }
}
</script>
