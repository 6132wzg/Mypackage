<template>
  <div
    :class="b()"
    :style="{
      fontSize: info.contract_setting.contract_font_size + 'px',
      paddingTop: info.contract_setting.contract_marget + 'mm'
    }"
  >
    <header :class="b('header')">
      <img
        v-if="info.contract_setting && info.contract_setting.is_brand_logo"
        :class="b('brand-logo')"
        :src="info.logo_url"
        alt="brand-logo"
      />
      <h1 :class="b('title')">{{ info.contract_title }}</h1>
      <h4
        v-if="info.contract_setting && info.contract_setting.is_brand_name"
        :class="b('brand-name')"
      >
        {{ info.brand_name }}
      </h4>
      <div
        v-if="info.contract_setting && info.contract_setting.is_contract_number"
        :class="b('contract-code')"
      >
        <label class="info-label">合同编号：</label>
        <span class="info-text">{{ info.contract_number }}</span>
      </div>
    </header>
    <section :class="b('basic')">
      <div :class="b('basic-list')">
        <a-row :gutter="16">
          <a-col
            :span="8"
            v-if="info.contract_setting && info.contract_setting.is_member_name"
          >
            <div class="info-item">
              <label class="info-label">姓名：</label>
              <span class="info-text">{{ info.member_name }}</span>
            </div>
          </a-col>
          <a-col
            :span="8"
            v-if="
              info.contract_setting && info.contract_setting.is_member_mobile
            "
          >
            <div class="info-item">
              <label class="info-label">联系方式：</label>
              <template v-if="info.is_minors === 1">
                <span class="info-text">{{ info.parent_mobile }}</span>
              </template>
              <template v-else>
                <span class="info-text">{{ info.mobile }}</span>
              </template>
            </div>
          </a-col>
          <!-- <a-col :span="8" v-if="info.contract_setting.is_member_card">
            <div class="info-item">
              <label class="info-label">{{ $c('member_card') }}号：</label>
              <span class="info-text">ST000001</span>
            </div>
          </a-col>-->
          <a-col
            :span="8"
            v-if="info.contract_setting && info.contract_setting.is_member_sex"
          >
            <div class="info-item">
              <label class="info-label">性别：</label>
              <span class="info-text">{{ info.sex }}</span>
            </div>
          </a-col>

          <a-col
            :span="8"
            v-if="
              info.contract_setting && info.contract_setting.is_salesman_name
            "
          >
            <div class="info-item">
              <label class="info-label">销售人员：</label>
              <span class="info-text">{{ info.sale }}</span>
            </div>
          </a-col>
          <a-col
            :span="12"
            v-if="
              info.contract_setting && info.contract_setting.is_member_id_card
            "
          >
            <div class="info-item">
              <label class="info-label">身份证：</label>
              <span class="info-text">{{ info.id_card }}</span>
            </div>
          </a-col>
          <template v-if="info.is_minors === 1">
            <a-col
              :span="8"
              v-if="
                info.contract_setting && info.contract_setting.is_parent_name
              "
            >
              <div class="info-item">
                <label class="info-label">家长姓名：</label>
                <span class="info-text">{{ info.parent_name }}</span>
              </div>
            </a-col>
            <a-col
              :span="8"
              v-if="
                info.contract_setting && info.contract_setting.is_parent_mobile
              "
            >
              <div class="info-item">
                <label class="info-label">家长联系方式：</label>
                <span class="info-text">{{ info.parent_mobile }}</span>
              </div>
            </a-col>
            <a-col
              :span="8"
              v-if="
                info.contract_setting && info.contract_setting.is_parent_rule
              "
            >
              <div class="info-item">
                <label class="info-label">家长身份：</label>
                <span class="info-text">{{ info.parent_rule }}</span>
              </div>
            </a-col>
            <a-col
              :span="12"
              v-if="info.contract_setting && info.is_parent_id_card"
            >
              <div class="info-item">
                <label class="info-label">家长身份证：</label>
                <span class="info-text">{{ info.parent_id_card }}</span>
              </div>
            </a-col>
          </template>
          <a-col
            :span="12"
            v-if="
              info.contract_setting && info.contract_setting.is_member_address
            "
          >
            <div class="info-item">
              <label class="info-label">家庭住址：</label>
              <span class="info-text">{{ info.living_address }}</span>
            </div>
          </a-col>
        </a-row>
      </div>
      <div
        v-if="info.contract_setting && info.contract_setting.is_member_pic"
        :class="b('avatar')"
      >
        <img :src="info.avatar_url || avatar" alt />
      </div>
    </section>
    <section :class="b('product')">
      <st-form-table>
        <thead>
          <tr v-if="showAllTh">
            <th>商品名称</th>
            <th v-if="info.contract_type === CONTRACT_TYPE.MEMBER_CARD">
              支持入场人数
            </th>
            <th>价格</th>
            <th>优惠</th>
            <th>小计</th>
          </tr>
          <tr v-if="showSomeTh">
            <th>商品名称</th>
            <th>小计</th>
          </tr>
          <tr v-if="showSmallCourseTh">
            <th>商品名称</th>
            <th>购买课时</th>
            <th>价格</th>
            <th>优惠</th>
            <th>小计</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="info.contract_type === CONTRACT_TYPE.MEMBER_CARD">
            <td>{{ info.product_name }}</td>
            <td>{{ info.support_member_num }}</td>
            <td>{{ info.price }}元</td>
            <td>{{ info.discount }}元</td>
            <td>{{ info.total_amount }}元</td>
          </tr>
          <tr v-if="info.contract_type === CONTRACT_TYPE.PERSONAL">
            <td>{{ info.product_name }}</td>
            <td>{{ info.price }}元</td>
            <td>{{ info.discount }}元</td>
            <td>{{ info.total_amount }}元</td>
          </tr>
          <tr v-if="info.contract_type === CONTRACT_TYPE.PACKAGE">
            <td>{{ info.product_name }}</td>
            <td>{{ info.price }}元</td>
            <td>{{ info.discount }}元</td>
            <td>{{ info.total_amount }}元</td>
          </tr>
          <tr v-if="info.contract_type === CONTRACT_TYPE.DEPOSITE">
            <td>{{ info.product_name }}</td>
            <td>{{ info.price }}元</td>
            <td>{{ info.discount }}元</td>
            <td>{{ info.total_amount }}元</td>
          </tr>
          <tr v-if="info.contract_type === CONTRACT_TYPE.CABINET">
            <td>{{ info.product_name }}</td>
            <td>{{ info.price }}元</td>
            <td>{{ info.discount }}元</td>
            <td>{{ info.total_amount }}元</td>
          </tr>
          <tr v-if="info.contract_type === CONTRACT_TYPE.MONEY">
            <td>{{ info.product_name }}</td>
            <td>{{ info.total_amount }}元</td>
          </tr>
          <tr v-if="info.contract_type === CONTRACT_TYPE.SMALL_COURSE">
            <td>{{ $c('small_course') }}</td>
            <td>{{ info.course_num }}</td>
            <td>{{ info.price }}</td>
            <td>{{ info.discount }}元</td>
            <td>{{ info.total_amount }}元</td>
          </tr>
        </tbody>
      </st-form-table>
    </section>
    <section :class="b('advanced')">
      <a-row>
        <a-col :span="8">
          <div class="info-item">
            <label class="info-label">合同总金额：</label>
            <span class="info-text">{{ info.total_amount }}元</span>
          </div>
        </a-col>
        <!-- <a-col :span="8">
          <div class="info-item">
            <label class="info-label">支付方式：</label>
            <span class="info-text">刷卡9600.00元</span>
          </div>
        </a-col>-->
        <a-col
          :span="8"
          v-if="info.contract_type === CONTRACT_TYPE.MEMBER_CARD"
        >
          <div class="info-item">
            <label class="info-label">开卡方式：</label>
            <span class="info-text">{{ info.open_card_type }}</span>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="info-item">
            <label class="info-label">购买门店：</label>
            <span class="info-text">{{ info.shop_name }}</span>
          </div>
        </a-col>
        <a-col :span="8" v-if="info.contract_type === CONTRACT_TYPE.PACKAGE">
          <div class="info-item">
            <label class="info-label">生效方式：</label>
            <span class="info-text">{{ info.effective_way }}</span>
          </div>
        </a-col>
        <a-col :span="24">
          <div class="info-item">
            <label class="info-label">合同有效期：</label>
            <span class="info-text">{{ info.valid_date }}</span>
          </div>
        </a-col>
        <a-col
          :span="24"
          v-if="info.contract_setting && info.contract_setting.is_comment"
        >
          <div class="info-item">
            <label class="info-label">备注：</label>
            <span class="info-text">{{ info.description }}</span>
          </div>
        </a-col>
        <a-col
          :span="24"
          v-if="info.contract_setting && info.contract_setting.is_law_content"
        >
          <div class="info-item">
            <label class="info-label">合同章程：</label>
            <samp class="info-text">{{ info.law_content }}</samp>
          </div>
        </a-col>
      </a-row>
    </section>

    <footer :class="b('footer')">
      <a-row>
        <a-col :span="12" v-if="info.contract_setting.is_member_signed_name">
          <div class="info-item">
            <label class="info-label">会员签名：</label>
          </div>
          <div class="info-item">
            <label
              class="info-label"
              v-if="info.contract_setting.is_signed_date"
            >
              签订日期：
            </label>
          </div>
        </a-col>
        <a-col :span="12" v-if="info.contract_setting.is_brand_signed_name">
          <div class="info-item">
            <label class="info-label">会所签名：</label>
          </div>
          <div class="info-item" v-if="info.contract_setting.is_signed_date">
            <label class="info-label">签订日期：</label>
          </div>
        </a-col>
      </a-row>
    </footer>
  </div>
</template>
<script>
import { dateFilter } from '@/filters/date.filters'
import { CONTRACT_TYPE } from '@/constants/setting/contract'
import moment from 'moment'
import { ContractPreviewService } from './contract-preview.service'
import avatar from '@/assets/img/avatar_default_contract.png'
export default {
  bem: {
    b: 'common-contract-preview'
  },
  serviceInject() {
    return {
      contractPreviewService: ContractPreviewService
    }
  },
  rxState() {
    return {
      info: this.contractPreviewService.info$
    }
  },
  filters: { dateFilter },
  data() {
    return {
      CONTRACT_TYPE,
      today: moment(),
      avatar: avatar
    }
  },
  computed: {
    showAllTh() {
      switch (this.info.contract_type) {
        case CONTRACT_TYPE.MEMBER_CARD:
        case CONTRACT_TYPE.PERSONAL:
        case CONTRACT_TYPE.PACKAGE:
        case CONTRACT_TYPE.CABINET:
        case CONTRACT_TYPE.DEPOSITE:
          return true
        default:
          return false
      }
    },
    showSomeTh() {
      switch (this.info.contract_type) {
        case CONTRACT_TYPE.MONEY:
          return true
        default:
          return false
      }
    },
    showSmallCourseTh() {
      switch (this.info.contract_type) {
        case CONTRACT_TYPE.SMALL_COURSE:
          return true
        default:
          return false
      }
    }
  },
  created() {
    let html = document.querySelector('html')
    html.className += ' print'
    let id = this.$searchQuery.id
    this.getInfo(id)
  },
  methods: {
    getInfo(id) {
      this.contractPreviewService.getInfo({ id }).subscribe()
    }
  }
}
</script>
