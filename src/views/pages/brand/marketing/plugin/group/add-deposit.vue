<template>
  <group-form
    :form="form"
    :decorators="decorators"
    :loading="loading.addGroup"
    :confirmLoading="loading.addGroup"
    :isEdit="false"
    :groupParams="groupParams"
    @onsubmit="onSubmit"
    ref="group"
  >
    <template slot="choose-product">
      <a-row :gutter="8">
        <a-col :span="10">
          <st-form-item label="选择储值卡" required>
            <a-input type="hidden" v-decorator="decorators.depositId"></a-input>
            <a-select
              showSearch
              @change="changeSelect"
              placeholder="请选择储值卡"
              v-model="depositId"
            >
              <a-select-option
                :value="item.id"
                v-for="(item, index) in list"
                :key="index"
              >
                {{ item.product_name }}
              </a-select-option>
            </a-select>
          </st-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="8">
        <a-col :span="16">
          <st-form-item
            label="优惠设置"
            :help="tableText"
            :validateStatus="tableErr ? 'error' : ''"
            required
          >
            <st-container>
              <st-table
                rowKey="id"
                :dataSource="currentStored"
                :columns="columnsGroupStored"
                :pagination="false"
              >
                <template slot="discount" slot-scope="customRender, record">
                  <st-input-number
                    :float="true"
                    @input="setPriceChange"
                    v-model="record.group_price"
                    style="width:110px;"
                  >
                    <template slot="addonAfter">
                      元
                    </template>
                  </st-input-number>
                </template>
              </st-table>
            </st-container>
          </st-form-item>
        </a-col>
      </a-row>
    </template>
  </group-form>
</template>

<script>
// import SelectShop from '@/views/fragments/shop/select-shop'
import { AddDepositService } from './add-deposit.service'
import { PatternService } from '@/services/pattern.service'
import { columnsGroupStored, ruleOptions } from './add-deposit.config'
import moment, { months } from 'moment'
import GroupForm from './components#/group-form.vue'
import { ACTIVITY_STATUS } from '@/constants/marketing/group-buy'

export default {
  name: 'PageBrandMarketingGroupAddDeposit',
  /* bem: {
    basic: 'brand-marketing-group-deposit'
  }, */
  serviceInject() {
    return {
      add: AddDepositService,
      pattern: PatternService
    }
  },
  rxState() {
    return {
      loading: this.add.loading$,
      list: this.add.list$
    }
  },
  components: {
    GroupForm
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      columnsGroupStored,
      groupParams: {
        type: 2,
        id: null
      },
      activityState: Number, // 当前活动活动状态
      depositId: '', // 回显下拉选中product
      currentStored: [], // 当前下拉选中详细
      shopIds: [],
      ACTIVITY_STATUS,
      shopList: null,
      tableText: '',
      tableErr: false
    }
  },
  methods: {
    setPriceChange() {
      if (!this.currentStored[0].group_price) {
        this.tableText = '请输入拼团价格'
        this.tableErr = true
      } else {
        this.tableText = ''
        this.tableErr = false
      }
    },
    changeSelect(id) {
      this.form.setFieldsValue({
        depositId: id
      })
      this.list.filter(item => {
        if (item.id == id) {
          this.currentStored = item.product_spec
        }
      })
      this.groupParams.id = this.depositId
      this.$refs.group.updateShop()
    },
    onSubmit(params) {
      let tmpList = [
        {
          sku_id: this.currentStored[0].id,
          group_price: this.currentStored[0].group_price
        }
      ]
      params.product_type = 2
      params.product_id = this.depositId
      params.sku = tmpList

      this.add.addGroup(params).subscribe(res => {
        this.$router.push({
          path: `/brand/marketing/plugin/group/list`
        })
      })
    }
  }
}
</script>
