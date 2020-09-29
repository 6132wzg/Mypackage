<template>
  <div :class="b()">
    <st-panel-layout :class="b('container')">
      <st-form :form="form" labelWidth="88px" labelGutter="16px">
        <a-row>
          <a-col :lg="13">
            <st-form-item label="选择会员卡" required>
              <div :class="b('select-wrapper')">
                <select-scroll
                  v-decorator="decorators.card_id"
                  _key="card_id"
                  _name="card_name"
                  placeholder="请选择会员卡"
                  notFoundContent="无搜索结果"
                  :list="list"
                  :disabled="isEdit"
                  :loading="loading.getCardList"
                  :showSearch="false"
                  @load="handleGetList"
                  @select="handleSelectProduct"
                ></select-scroll>
                <div>
                  仅支持会员期限卡
                </div>
              </div>
            </st-form-item>
          </a-col>
        </a-row>
        <st-form-item label="分期规格" required>
          <a-row>
            <a-col :lg="13">
              <st-table
                :page="false"
                @change="onTableChange"
                :rowSelection="rowSelection"
                :columns="columns"
                :dataSource="editSpecs"
                rowKey="template_id"
              >
                <template slot="name" slot-scope="text, record">
                  {{ record.name }}（扣费周期{{ record.days }}天）
                </template>
                <!-- <template slot="first_amount" slot-scope="text, record">
                  <st-input-number
                    style="margin: -5px 0"
                    :value="text"
                    float
                    :disabled="judgeIfCanEdit(record.template_id)"
                    @change="
                      value =>
                        handleFirstAmountChange(value, record.template_id)
                    "
                  />
                </template>
                <template slot="amount" slot-scope="text, record">
                  <st-input-number
                    style="margin: -5px 0"
                    :value="text"
                    float
                    :disabled="judgeIfCanEdit(record.template_id)"
                    @change="
                      value => handleAmountChange(value, record.template_id)
                    "
                  />
                </template> -->
              </st-table>
            </a-col>
          </a-row>
        </st-form-item>
        <st-form-item label="备注">
          <a-row>
            <a-col :lg="13">
              <st-textarea
                v-decorator="decorators.remark"
                :autosize="{ minRows: 4, maxRows: 6 }"
                :maxlength="200"
                placeholder="请填写备注，限制200字以内"
              />
            </a-col>
          </a-row>
        </st-form-item>
        <st-form-item label-fix>
          <a-row>
            <a-col :lg="13">
              <a-popconfirm @confirm="productUp" placement="topRight">
                <template slot="title">
                  <p>确认是否上架</p>
                </template>
                <st-button type="primary">
                  上架
                </st-button>
              </a-popconfirm>
            </a-col>
          </a-row>
        </st-form-item>
      </st-form>
    </st-panel-layout>
  </div>
</template>

<script>
import tableMixin from '@/mixins/table.mixin'
import { ruleOptions, columns } from './auto-renewal-edit.config'
import { AutoRenewalEditService } from './auto-renewal-edit.service'
import { get, cloneDeep } from 'lodash-es'

import SelectScroll from '@/views/components/select-scroll#/select-scroll'
export default {
  name: '',

  bem: {
    b: 'wexin-stage-product-edit'
  },

  mixins: [tableMixin],

  serviceInject() {
    return {
      editService: AutoRenewalEditService
    }
  },

  rxState() {
    return {
      auth: this.editService.auth$,
      loading: this.editService.loading$,
      product: this.editService.product$,
      specs: this.editService.specs$,
      list: this.editService.list$,
      page: this.editService.page$
    }
  },

  components: { SelectScroll },

  props: {},

  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      options: [],
      editSpecs: []
    }
  },

  computed: {
    columns,
    isEdit() {
      return !!this.$searchQuery.id
    },
    rowSelection() {
      1
      let self = this
      const { selectedRowKeys, onSelectionChange } = this
      return {
        onChange: onSelectionChange,
        selectedRowKeys: selectedRowKeys
      }
    }
  },

  watch: {
    specs: {
      handler(value) {
        this.editSpecs = cloneDeep(value)
        this.selectedRowKeys = value
          .filter(spec => spec.is_select)
          .map(spec => spec.template_id)
      },
      immediate: true,
      deep: true
    }
  },

  async: {},

  mounted() {
    if (this.$searchQuery.id) {
      this.editService
        .getProductDetail({
          id: this.$searchQuery.id
        })
        .subscribe(res => {
          this.editService.setList([
            {
              card_id: res.card_id,
              card_name: res.card_name
            }
          ])
          this.form.setFieldsValue({
            card_id: res.card_id,
            remark: res.remark
          })
        })
    } else {
      this.editService.getCardList().subscribe()
    }
  },

  methods: {
    handleGetList() {
      if (this.finished) return false
      this.editService
        .getCardList({
          current_page: ++this.page.current_page
        })
        .subscribe()
    },
    judgeIfCanEdit(id) {
      return !this.selectedRowKeys.includes(id)
    },
    productUp() {
      this.form.validate().then(values => {
        let specs = this.editSpecs.map(spec => {
          spec.is_select = this.selectedRowKeys.includes(spec.template_id)
          return spec
        })
        let params = {
          specs,
          remark: values.remark
        }
        console.log('params', params)
        if (this.isEdit) {
          params.id = this.$searchQuery.id
          this.editService.productEdit(params).subscribe(res => {
            this.$message.success({
              content: '商品上架成功'
            })
            this.$router.replace({
              name: 'brand-app-auto-renewal'
            })
          })
        } else {
          params.card_id = values.card_id
          this.editService.productAdd(params).subscribe(res => {
            this.$message.success({
              content: '商品上架成功'
            })
            this.$router.replace({
              name: 'brand-app-auto-renewal'
            })
          })
        }
      })
    },
    handleAmountChange(value, id) {
      console.log(value)
      this.editSpecs = this.editSpecs.map(spec => {
        if (spec.template_id === id) {
          spec.amount = value
        }
        return spec
      })
    },
    handleFirstAmountChange(value, id) {
      console.log('id', id)
      this.editSpecs = this.editSpecs.map(spec => {
        if (spec.template_id === id) {
          spec.first_amount = value
        }
        return spec
      })
    },
    handleSelectProduct(id) {
      this.form.setFieldsValue({
        card_id: id
      })
      this.editService
        .getProductDetail({
          id: this.$searchQuery.id || 0
        })
        .subscribe()
    }
  }
}
</script>

<style lang="less" scoped></style>
