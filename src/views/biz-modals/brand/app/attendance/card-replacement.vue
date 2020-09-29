<template>
  <st-modal title="补充打卡信息" v-model="show" width="500px">
    <st-form :form="form" labelAuto :class="module()">
      <st-form-item label="打卡日期">
        <template v-if="source === '1'">
          <a-date-picker
            placeholder="请选择打卡日期"
            style="width: 100%"
            @change="pickHandle"
          />
        </template>
        <template v-if="source === '2'">
          {{ record.date }}
        </template>
      </st-form-item>
      <st-form-item label="员工信息">
        <template v-if="source === '1'">
          <staff-select
            style="width: 100%"
            type="brand"
            placeholder="输入姓名/手机号搜索"
            @change="staffChange"
          ></staff-select>
        </template>
        <template v-if="source === '2'">
          <span class="name-space">{{ record.name }}</span>
          <span>{{ record.mobile }}</span>
        </template>
      </st-form-item>
      <st-form-item label="上班打卡门店">
        <a-select
          style="width: 100%"
          placeholder="请选择上班打卡门店"
          :value="in_shop"
          @focus="handleShopClick"
          @change="handleChange($event, 'in_shop')"
        >
          <a-select-option v-for="item in shopList" :key="item.id">
            {{ item.shop_name }}
          </a-select-option>
        </a-select>
      </st-form-item>
      <st-form-item label="上班打卡时间">
        <a-date-picker
          v-model="in_time"
          style="width: 100%"
          :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择上班打卡时间"
        />
      </st-form-item>
      <st-form-item label="下班打卡门店">
        <a-select
          style="width: 100%"
          placeholder="请选择下班打卡门店"
          :value="out_shop"
          @focus="handleShopClick"
          @change="handleChange($event, 'out_shop')"
        >
          <a-select-option v-for="item in shopList" :key="item.id">
            {{ item.shop_name }}
          </a-select-option>
        </a-select>
      </st-form-item>
      <st-form-item label="下班打卡时间">
        <a-date-picker
          v-model="out_time"
          style="width: 100%"
          :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择下班打卡时间"
        />
      </st-form-item>
      <st-form-item label="备注">
        <st-textarea
          placeholder="请输入备注内容"
          class="remark"
          v-model="remark"
          :maxlength="30"
        ></st-textarea>
      </st-form-item>
    </st-form>
    <template slot="footer">
      <st-button @click="show = false">取消</st-button>
      <st-button
        @click="onSubmit"
        type="primary"
        :loading="loading.postAttendanceMendHandle"
      >
        保存
      </st-button>
    </template>
  </st-modal>
</template>
<script>
import StaffSelect from '@/views/biz-components/staff-select/staff-select'
import { CardReplacementService } from './card-replacement.service'
import moment from 'moment'
import { cloneDeep } from 'lodash-es'
import tipVue from '@/views/pages/brand/marketing/plugin/coupon/tip.vue'
import { MessageService } from '@/services/message.service'
export default {
  bem: {
    module: 'brand-app-attendance-card-replacement'
  },
  serviceInject() {
    return {
      messageService: MessageService,
      cardReplacementService: CardReplacementService
    }
  },
  rxState() {
    return {
      loading: this.cardReplacementService.loading$
    }
  },
  components: { StaffSelect },
  name: 'newLable',
  props: {
    // 1-table btn,2-单员工补卡
    source: {
      type: String,
      default: '0'
    },
    record: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      show: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      shopList: [],
      in_time: null,
      out_time: null,
      in_shop: '',
      out_shop: '',
      staff_id: '',
      remark: '',
      cardDate: ''
    }
  },
  watch: {
    source: {
      handler(val) {
        this.source = val
        console.log(88, this.source)
      },
      immediate: true
    },
    record: {
      handler(val) {
        if (JSON.stringify(val) === '{}' || !val) {
          return
        }
        this.shopList = val.shops
        this.remark = val.remark
        const dateTime = new Date(val.date)
        let afterTime = dateTime.setDate(dateTime.getDate() + 1)
        const finallyTime = new Date(afterTime)
          .toLocaleDateString()
          .replace(/\//g, '-')
        console.log(123, afterTime, finallyTime, val.in_time, val.out_time)
        let timeTips = ['in_time', 'out_time']
        timeTips.forEach(tip => {
          if (val[tip].includes('次日')) {
            const time = val[tip].split('次日')[1]
            this[tip] = moment(`${finallyTime} ${time}`)
          } else if (val[tip] && val[tip] !== '--') {
            this[tip] = moment(`${val.date} ${val[tip]}`)
          } else {
            this[tip] = null
          }
        })
        let in_shop =
          val.in_shop_id && val.in_shop_id !== '--' ? val.in_shop_id : null
        let out_shop =
          val.out_shop_id && val.out_shop_id !== '--' ? val.out_shop_id : null
        // 员工换门店处理
        let isHasInShop = false
        let isHasOutShop = false
        for (let i = 0; i < this.shopList.length; i++) {
          if (this.shopList[i].id === in_shop) {
            isHasInShop = true
          }
          if (this.shopList[i].id === out_shop) {
            isHasOutShop = true
          }
        }
        if (isHasInShop) {
          this.in_shop = in_shop
        }
        if (isHasOutShop) {
          this.out_shop = out_shop
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    moment,
    handleShopClick() {
      console.log(this.shopList)
      if (this.shopList.length === 0) {
        this.messageService.warn({
          content: '请先输入员工信息'
        })
      }
    },
    onSubmit() {
      const query = {
        id: this.record.id || '0',
        staff_id: this.staff_id || this.record.staff_id,
        date: this.cardDate || this.record.date,
        in_shop_id: this.in_shop,
        in_time:
          (this.in_time &&
            moment(this.in_time).format('YYYY-MM-DD HH:mm:ss')) ||
          null,
        out_shop_id: this.out_shop,
        out_time:
          (this.out_time &&
            moment(this.out_time).format('YYYY-MM-DD HH:mm:ss')) ||
          null,
        remark: this.remark
      }
      console.log('query---', query)
      const tips = [
        {
          name: 'date',
          tip: '打卡日期'
        },
        {
          name: 'staff_id',
          tip: '员工信息'
        },
        {
          name: 'in_shop_id',
          tip: '上班打卡门店'
        },
        {
          name: 'in_time',
          tip: '上班打卡时间'
        },
        {
          name: 'out_shop_id',
          tip: '下班打卡门店'
        },
        {
          name: 'out_time',
          tip: '下班打卡时间'
        }
      ]
      for (let i = 0; i < tips.length; i++) {
        if (!query[tips[i].name]) {
          this.messageService.warn({
            content: tips[i].tip + '不能为空'
          })
          return
        }
      }
      query.in_time = query.in_time.slice(0, -3)
      query.out_time = query.out_time.slice(0, -3)
      if (query.range < 100) {
        this.messageService.warn({
          content: '范围不能小于100米'
        })
        return
      }
      this.cardReplacementService
        .postAttendanceMendHandle(query)
        .subscribe(res => {
          this.$emit('success')
          this.show = false
          this.messageService.success({
            content: '保存成功'
          })
        })
    },
    staffChange(e) {
      this.staff_id = e
      if (this.staff_id) {
        this.cardReplacementService
          .getAttendanceListHandle({ id: this.staff_id })
          .subscribe(res => {
            this.shopList = res.list
            this.in_shop = ''
            this.out_shop = ''
          })
      }
    },
    pickHandle(e) {
      this.cardDate = moment(e).format('YYYY-MM-DD')
    },
    handleChange(value, tag) {
      this[tag] = value
    }
  }
}
</script>

<style lang="less">
.brand-app-attendance-card-replacement {
  .staff-select .ant-select-selection {
    background-color: #fff;
    border: 1px solid #cdd4df;
  }
  .staff-select .ant-select-selection:hover {
    border-color: #6b90ff;
  }
  .ant-select-focused .ant-select-selection,
  .ant-select-selection:active,
  .ant-select-selection:focus {
    border-color: #6b90ff;
    box-shadow: 0 0 0 2px rgba(63, 102, 246, 0.2);
  }
  .ant-form-item {
    margin-bottom: 20px;
  }
  .member-select {
    border-radius: 0;
    background: #fff;
  }
  .staff-select {
    background: #fff;
  }
  .remark {
    height: 76px;
  }
  .name-space {
    margin-right: 24px;
  }
}
</style>
