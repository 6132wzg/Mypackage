<template>
  <div>
    <st-form-item required label="请选择商品类型">
      <st-select
        placeholder="请选择"
        style="width: 470px"
        v-decorator="decorators.product_type"
        @change="
          formValueChange('product_type', $event, onTypeChange, formValue)
        "
        :options="productTypeList"
        :disabled="isEdit"
      ></st-select>
    </st-form-item>
    <!-- 会员卡 -->
    <template v-if="formValue.product_type === PRODUCT_TYPE.MEMBER_CARD">
      <st-form-item required :label="`请选择${$c('member_card')}`">
        <st-select-scroll
          placeholder="请选择"
          style="width: 470px"
          _label="product_name"
          _value="id"
          filter="label"
          showArrow
          :isScroll="false"
          :options="memberList"
          v-decorator="decorators.product_id"
          @change="formValueChange('product_id', $event, formValue)"
          :disabled="isEdit"
        ></st-select-scroll>
      </st-form-item>
    </template>
    <!-- 储值卡 -->
    <template v-if="formValue.product_type === PRODUCT_TYPE.DEPOSIT_CARD">
      <st-form-item required label="请选择储值卡">
        <st-select-scroll
          placeholder="请选择"
          style="width: 470px"
          _label="product_name"
          _value="id"
          filter="label"
          showArrow
          :isScroll="false"
          :options="depositList"
          v-decorator="decorators.product_id"
          @change="formValueChange('product_id', $event, formValue)"
          :disabled="isEdit"
        ></st-select-scroll>
      </st-form-item>
    </template>
    <!-- 私教课 -->
    <template v-if="formValue.product_type === PRODUCT_TYPE.PERSONAL_COURSE">
      <st-form-item required label="请选择私教课">
        <st-select-scroll
          style="width: 470px"
          placeholder="请选择"
          _label="product_name"
          _value="id"
          filter="label"
          showArrow
          :isScroll="false"
          :options="personalList"
          v-decorator="decorators.product_id"
          @change="formValueChange('product_id', $event, formValue)"
          :disabled="isEdit"
        ></st-select-scroll>
      </st-form-item>
    </template>
    <!-- 必须用v-show， 否则集联关系报错 -->
    <st-form-item
      required
      label="限定课时"
      v-show="formValue.product_type === PRODUCT_TYPE.PERSONAL_COURSE"
    >
      <st-input-number
        v-decorator="decorators.limit_course_num"
        @change="formValueChange('limit_course_num', $event, formValue)"
        placeholder=""
        style="width: 150px"
        :min="1"
        :max="9999"
      >
        <span slot="addonAfter">节</span>
      </st-input-number>
    </st-form-item>
    <st-form-item required label="优惠设置">
      <a-card size="small" style="width: 470px">
        <st-table
          emptyText="暂无数据"
          :rowKey="record => record.id || record.product_sku_id"
          :columns="columns"
          :dataSource="tableList"
          :page="false"
          :rowSelection="{
            onChange: onTableChange,
            selectedRowKeys: selectedRowKeys
          }"
        >
          <span slot="discount_price" slot-scope="text, record, index">
            <st-input-number
              style="width: 130px"
              :min="0"
              :max="999999.9"
              :disabled="!record.isSelected"
              :value="text"
              float
              @change="onTablePriceChange(index, $event)"
            >
              <span slot="addonAfter">元</span>
            </st-input-number>
          </span>
        </st-table>
      </a-card>
    </st-form-item>
  </div>
</template>
<script>
import { PRODUCT_TYPE } from '@/constants/brand/app/plugin/discount'
import { typeOf } from '@/utils/type'
import { listToMap } from '@/utils/list-to-map'
import { isEqual, merge } from 'lodash-es'
import FormMixin from './form.mixin'

import { MessageService } from '@/services/message.service'
import {
  memberCardColumns,
  depositCardColumns,
  personalCourseLevelColumns,
  personalCourseColumns,
  productSettingRules
} from './product-setting.config'
import { ProductSettingService } from './product-setting.service'
export default {
  name: 'PluginProductSetting',
  mixins: [FormMixin],
  serviceInject() {
    return {
      service: ProductSettingService,
      messageService: MessageService
    }
  },
  rxState() {
    return {
      loading: this.service.loading$,
      productType: this.service.productType$,
      memberList: this.service.memberList$,
      depositList: this.service.depositList$,
      personalList: this.service.personalList$,
      coachLevelList: this.service.coachLevelList$,
      brand: this.service.brand$
    }
  },
  // decorators() {
  //   return this.form.addDecorators(this.productSettingRules)
  // },
  props: {
    discountPriceLabel: {
      type: String,
      default: '优惠价(元)'
    },
    form: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      PRODUCT_TYPE,
      selectedRowKeys: [],
      allSelected: false
    }
  },
  computed: {
    productSettingRules,
    decorators() {
      return this.form.addDecorators(this.productSettingRules)
    },
    productTypeList() {
      return this.productType.filter(
        item =>
          !(
            this.PRODUCT_TYPE.PERSONAL_COURSE === item.value &&
            this.brand.saleModel === 1
          )
      )
    },
    tableList: {
      get() {
        let list = []
        if (this.formValue.product_type === PRODUCT_TYPE.MEMBER_CARD) {
          list = this.tableMemberList
        }
        if (this.formValue.product_type === PRODUCT_TYPE.DEPOSIT_CARD) {
          list = this.tableDepositList
        }
        if (this.formValue.product_type === PRODUCT_TYPE.PERSONAL_COURSE) {
          list = this.tableCourseList
        }
        return list.map(item => {
          const id = item.id !== undefined ? item.id : item.product_sku_id
          return {
            ...item,
            product_sku_id: item.id || item.product_sku_id || 0,
            discount_price: item.discount_price || null,
            hour: this.formValue.limit_course_num,
            ...(this.discountInfoMap[id] || {}),
            isSelected:
              (!this.isEdit && this.allSelected) ||
              this.selectedRowKeys.includes(item.id) ||
              this.selectedRowKeys.includes(item.product_sku_id)
          }
        })
      },
      set(value) {
        this.getDiscountInfo(value)
      }
    },
    tableMemberList() {
      const itemArr = this.memberList.filter(item => {
        return item.id === this.formValue.product_id
      })
      return itemArr.length ? itemArr[0].product_spec : []
    },
    tableDepositList() {
      const itemArr = this.depositList.filter(item => {
        return item.id == this.formValue.product_id
      })
      return itemArr.length ? itemArr[0].product_spec : []
    },
    tableCourseList() {
      if (this.brand.priceModel !== 2) {
        // 私教课 priceModel = 1 统一定价模式
        return [
          {
            product_sku_id: 0,
            discount_price: null
          }
        ]
      }
      return this.coachLevelList
    },
    discountInfoMap() {
      return listToMap(this.formValue.discount_info, {
        keyField: 'product_sku_id'
      })
    },
    columns() {
      if (this.formValue.product_type === PRODUCT_TYPE.PERSONAL_COURSE) {
        return this.brand.priceModel === 2
          ? personalCourseLevelColumns(this)
          : personalCourseColumns(this)
      }
      if (this.formValue.product_type === PRODUCT_TYPE.DEPOSIT_CARD) {
        return depositCardColumns(this)
      }
      if (this.formValue.product_type === PRODUCT_TYPE.MEMBER_CARD) {
        return memberCardColumns(this)
      }
      return []
    }
  },
  watch: {
    'formValue.discount_info': {
      deep: true,
      immediate: true,
      handler(value) {
        let list = []
        value &&
          value.map(item => {
            list.push(item.product_sku_id)
          })
        // 去重
        this.selectedRowKeys = [...new Set([...this.selectedRowKeys, ...list])]
      }
    },
    'formValue.product_id': {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        if (!newVal || newVal === oldVal) return
        // 私教课 统一定价模式, 非教练谈单模式 选择的私教课发生变更，则更新对应的 教练等级列表
        this.brand.priceModel === 2 &&
          this.brand.saleModel !== 1 &&
          this.service.getCoachLevelList(newVal).subscribe()
        // 非编辑状态 如果商品选择发生改变则默认全部勾选
        if (!this.isEdit) {
          this.allSelected = true
        }
      }
    },
    tableList: {
      deep: true,
      handler(newVal, oldVal) {
        if (!newVal || newVal === oldVal) return
        // 非编辑状态 如果商品选择发生改变则默认全部勾选
        if (!this.isEdit && this.allSelected) {
          this.$nextTick(() => {
            let list = []
            this.tableList.map(item => {
              list.push(item.product_sku_id)
            })
            console.log(list, this.tableList)
            this.selectedRowKeys = [
              ...new Set([...this.selectedRowKeys, ...list])
            ]
          })
        }
      }
    }
  },
  mounted() {
    console.log(this.decorators)
    if (!this.isEdit) {
      this.service.getMemberList().subscribe()
      this.service.getDepositList().subscribe()
      this.service.getPersonalList().subscribe()
    } else {
      let name = 'getMemberList'
      switch (this.formValue.product_type) {
        case PRODUCT_TYPE.MEMBER_CARD:
          name = 'getMemberList'
          break
        case PRODUCT_TYPE.DEPOSIT_CARD:
          name = 'getDepositList'
          break
        case PRODUCT_TYPE.PERSONAL_COURSE:
          name = 'getPersonalList'
          break
      }
      console.log(222222)
      this.service[name]().subscribe(res => {
        this.checkProductIsExist(res.list)
      })
    }
  },
  methods: {
    onTypeChange(val) {
      this.setFieldsValue('product_id', undefined)
      this.formValue.limit_course_num = 1
      this.formValue.discount_info = []
      this.selectedRowKeys = []
    },
    // onMemberChange(val) {},
    // onDepositChange(val) {},
    // onPersonalChange(val) {},
    onTableChange(value) {
      console.log(value)
      this.allSelected = false
      this.selectedRowKeys = value
      this.getDiscountInfo(this.tableList)
    },
    // 修改列表对应 index 下的 price
    onTablePriceChange(index, val) {
      let list = this.tableList
      this.allSelected = false
      list.splice(index, 1, {
        ...this.tableList[index],
        discount_price: val
      })
      this.tableList = list
    },
    getDiscountInfo(value) {
      let list = []
      value.map(item => {
        if (item.isSelected) {
          list.push({
            product_sku_id: item.id || item.product_sku_id || 0,
            discount_price: item.discount_price || null
          })
        }
      })
      this.formValue.discount_info = list
    },
    checkProductIsExist(list) {
      const itemArr = list.filter(item => {
        return item.id === this.formValue.product_id
      })
      if (!itemArr.length) {
        this.$confirm({
          title: '提示',
          content: '该商品不存在或已被删除'
        })
      }
    },
    validate() {
      let is_pass = true
      if (!this.formValue.discount_info.length) {
        this.messageError({ content: '请设置优惠价格' })
        return false
      }
      this.formValue.discount_info.map(item => {
        if (
          is_pass &&
          (item.discount_price === null ||
            item.discount_price === undefined ||
            item.discount_price === '')
        ) {
          this.messageError({ content: '请设置优惠价格' })
          is_pass = false
          return
        }
      })
      return is_pass
    }
  }
}
</script>
