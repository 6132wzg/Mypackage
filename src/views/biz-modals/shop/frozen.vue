<template>
  <st-modal
    title="冻结"
    v-model="show"
    @ok="save"
    width="740px"
    :loading="loading.getMemberBuy"
    :confirmLoading="loading.getMemberTransfer"
    wrapClassName="modal-shop-frozen"
  >
    <st-form :form="form" labelWidth="80px">
      <a-row :gutter="8">
        <a-col :lg="24">
          <st-info>
            <st-info-item label="姓名">
              {{ record.member_name }}
            </st-info-item>
            <st-info-item :label="record.is_minors ? '家长手机号' : '手机号'">
              {{ record.is_minors ? record.parent_info.mobile : record.mobile }}
            </st-info-item>
          </st-info>
        </a-col>
      </a-row>
      <st-t4 class="mg-b8">选择需要冻结的卡或课</st-t4>
      <a-row :gutter="8">
        <a-col
          :lg="24"
          class="distribution-container"
          style="padding-left:12px;padding-right:12px;"
        >
          <st-form-item :help="selectedRowsHelp" required>
            <st-table
              :rowSelection="rowSelection"
              :pagination="false"
              :columns="columns"
              :dataSource="list"
              rowKey="id"
            >
              <span
                slot="remain_amount"
                style="width: 60px"
                slot-scope="text, record"
              >
                {{ record.remain_amount }} {{ record.unit }}
              </span>
              <span slot="start_end" slot-scope="text, record">
                {{ record.start_time }} ~ {{ record.end_time }}
              </span>
              <span
                slot="member_info"
                slot-scope="text, record"
                v-if="record.member_info"
              >
                <st-overflow-text
                  :value="[
                    `购买人: ${record.member_info.card_buyer}`,
                    '成员:',
                    ...record.member_info.card_members
                  ]"
                  max-width="120px"
                ></st-overflow-text>
                <span
                  v-if="record.product_type === 1 && record.is_purchaser !== 1"
                  class="error-color"
                >
                  需要购买人冻结
                </span>
              </span>
            </st-table>
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8" class="mg-t24">
        <a-col :lg="24">
          <st-form-item label="冻结日期">
            <a-date-picker
              format="YYYY-MM-DD"
              placeholder="冻结日期"
              :disabledDate="disabledDate"
              v-decorator="decorators.end_time"
            />
            <br />
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col :lg="24">
          <st-form-item label="有无手续费" required>
            <a-radio-group
              v-decorator="decorators.is_handling_fee"
              @change="changeTransfer"
            >
              <a-radio
                :value="item.value"
                v-for="(item, index) in hasTransferFeeList"
                :key="index"
              >
                {{ item.label }}
              </a-radio>
            </a-radio-group>
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8" class="mg-t8" v-if="isTransferFlag">
        <a-col :lg="24">
          <st-form-item label="手续费" required>
            <st-input-number
              :float="true"
              placeholder="请输入手续费"
              v-decorator="decorators.pay_fee"
            >
              <template slot="addonAfter">
                元
              </template>
            </st-input-number>
          </st-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="8" class="mg-t8" v-if="isTransferFlag">
        <a-col :lg="24">
          <st-form-item label="支付方式" required>
            <a-select
              :class="basic('select')"
              v-decorator="decorators.pay_method"
              placeholder="请选择支付方式"
            >
              <a-select-option
                v-for="(item, index) in methodsList"
                :key="index"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </st-form-item>
        </a-col>
      </a-row>
      <!-- <a-row :gutter="8" class="mg-t8" v-if="isTransferFlag">
        <a-col :lg="24">
          <st-form-item label="收款人员" required>
            <a-select
              showSearch
              allowClear
              placeholder="输入手机号或员工名称搜索"
              :defaultActiveFirstOption="false"
              :showArrow="false"
              :filterOption="false"
              v-decorator="decorators.sale_id"
              @search="onSearch"
              notFoundContent="无搜索结果"
            >
              <a-select-option
              v-for="(item,index) in staffList"
              :value="item.id"
              :key="index">
                <span v-html="`${item.staff_name} ${item.mobile}`.replace(new RegExp(memberSearchText,'g'),`\<span class='global-highlight-color'\>${memberSearchText}\<\/span\>`)">
                  {{item.staff_name}} {{item.mobile}}
                </span>
              </a-select-option>
            </a-select>
          </st-form-item>
        </a-col>
      </a-row> -->
      <!-- <a-row :gutter="8">
        <a-col :lg="24">
          <st-form-item
            class="mg-l24"
            style="text-align:right; margin-bottom:0"
            labelOffset
          >
            <st-button
              type="primary"
              @click="save"
              :loading="loading.getMemberTransfer"
            >
              确认
            </st-button>
          </st-form-item>
        </a-col>
      </a-row> -->
    </st-form>
  </st-modal>
</template>
<script>
import { FrozenService } from './frozen.service'
import { columns, ruleOptions } from './frozen.config'
import moment from 'moment'
export default {
  name: 'ModalShopFrozen',
  bem: {
    frozen: 'modal-shop-frozen'
  },
  serviceInject() {
    return {
      frozenService: FrozenService
    }
  },
  rxState() {
    return {
      list: this.frozenService.list$,
      staffList: this.frozenService.staffList$,
      payMethodList: this.frozenService.payMethodList$,
      hasTransferFeeList: this.frozenService.hasTransferFeeList$,
      loading: this.frozenService.loading$
    }
  },
  name: 'frozen',
  bem: {
    basic: 'shop-frozen'
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
      show: false,
      isTransferFlag: false,
      selectedRows: [],
      dateString: [],
      selectedRowsHelp: ''
    }
  },
  created() {
    this.getMemberBuy()
  },
  methods: {
    disabledDate(current) {
      // Can not select days before today and today
      return (
        current && current.format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD')
      )
    },
    moment,
    // 搜索员工
    onSearch(data) {
      this.memberSearchText = data
      if (data === '') {
        this.frozenService.memberList$.commit(() => [])
        this.form.resetFields(['pay_fee'])
      } else {
        this.frozenService.getMemberList(data).subscribe(res => {
          if (!res.list.length) {
            this.form.resetFields(['pay_fee'])
          }
        })
      }
    },
    getMemberBuy() {
      this.frozenService.getMemberBuy(this.record.member_id).subscribe()
    },
    getMemberTransfer(data) {
      this.frozenService.getMemberTransfer(data).subscribe(state => {
        this.show = false
        this.$emit('success')
      })
    },
    save(e) {
      e.preventDefault()
      this.form.validate().then(values => {
        if (this.selectedRows.length <= 0) {
          this.selectedRowsHelp = '请选择冻结的卡课'
          return
        } else {
          this.selectedRowsHelp = ''
        }
        values.product = this.selectedRows.map(item => {
          return {
            product_type: item.product_type,
            product_id: item.id
          }
        })
        values.id = this.record.member_id
        values.end_time = moment(values.end_time).format('YYYY-MM-DD HH:mm')
        this.getMemberTransfer(values)
      })
    },
    onChangeDatepicker(date, dateString) {
      this.dateString = dateString
    },
    changeTransfer(event) {
      if (event.target.value === 0) {
        this.isTransferFlag = false
      } else {
        this.isTransferFlag = true
      }
    }
  },
  computed: {
    columns,
    methodsList() {
      // TODO 冻结用户暂时隐藏POS机支付方式
      return this.payMethodList.filter(method => method.value < 32)
    },
    rowSelection() {
      let self = this
      const { selectedRowKeys } = this
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          self.selectedRows = selectedRows
          if (selectedRows.length > 0) {
            self.selectedRowsHelp = ''
          }
        },
        getCheckboxProps: record => ({
          props: {
            // 产品类型为 1 会员卡 2 课程包  is_purchaser 1 为购卡人
            disabled:
              [1, 4].includes(record.product_type) && record.is_purchaser !== 1
          }
        })
      }
    }
  }
}
</script>
