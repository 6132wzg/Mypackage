<template>
  <div>
    <div class="shop-member-crowd-index-box">
      <div
        class="shop-member-crowd-index-box-title"
        v-for="(item, index) in importantCrowd"
        :key="index"
        :class="{ middle: index === 1 }"
      >
        <div class="shop-member-crowd-index-box__header">
          <div
            class="shop-member-crowd-index-box__fresh"
            @click="onCrowdRefresh(item.id)"
          >
            <st-icon
              type="refresh"
              color="#9BACB9"
              size="16px"
              v-if="item.auth && item.auth['brand:member:crowd|fresh']"
              title="刷新"
            ></st-icon>
          </div>
          <div class="shop-member-crowd-index-box__item">
            <img
              :src="imgArry[index]"
              class="shop-member-crowd-index-box__img"
            />
            <div class="shop-member-crowd-index-box__info">
              <st-t4 class="shop-member-crowd-index-box__info__title">
                {{ item.crowd_name }}
              </st-t4>
              <div>{{ item.description }}</div>
            </div>
          </div>
          <div class="shop-member-crowd-index-box__num">
            <div class="shop-member-crowd-index-box__num-item">
              <div class="shop-member-crowd-index-box__number">
                {{ item.crowd_total_num.value }}
              </div>
              <div class="shop-member-crowd-index-box__num-describe">
                {{ item.crowd_total_num.name }}
              </div>
            </div>
            <div class="shop-member-crowd-index-box__num-item-middle">
              <div class="shop-member-crowd-index-box__number">
                {{ item.yesterday_admission.value }}
              </div>
              <div class="shop-member-crowd-index-box__num-describe">
                {{ item.yesterday_admission.name }}
              </div>
            </div>
            <div class="shop-member-crowd-index-box__num-item">
              <div class="shop-member-crowd-index-box__number">
                {{ item.yesterday_deal_numb.value }}
              </div>
              <div class="shop-member-crowd-index-box__num-describe">
                {{ item.yesterday_deal_numb.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="shop-member-crowd-index-box__btn">
          <router-link
            class="shop-member-crowd-index-box__btn-rq shop-member-crowd-index-box__btn-rq-line"
            tag="span"
            :to="{
              name: 'brand-marketing-plugin-crowd-analysis',
              query: { urlid: index, id: item.id }
            }"
          >
            人群分析
          </router-link>
          <a-tooltip>
            <a-dropdown placement="bottomRight">
              <span
                class="shop-member-crowd-index-box__btn-rq ant-dropdown-link"
              >
                定向运营
              </span>
              <a-menu slot="overlay">
                <a-menu-item
                  style="width: 100%"
                  v-if="item.auth && item.auth['brand:member:crowd|export']"
                >
                  <a
                    v-export-excel="{
                      type: 'crowd/' + item.id
                    }"
                  >
                    导出
                  </a>
                </a-menu-item>
                <a-menu-item style="width: 100%">
                  <a
                    v-modal-link="{
                      name: 'brand-setting-sms-group',
                      props: {
                        crowd: { user_type: 2, send_value: item.id }
                      }
                    }"
                  >
                    群发短信
                  </a>
                </a-menu-item>
                <a-menu-item style="width: 100%" v-if="auth.sendCoupon">
                  <a
                    v-modal-link="{
                      name: 'brand-app-plugin-send-coupon-batch-send',
                      props: { crowdId: item.id, title: '群发优惠' }
                    }"
                  >
                    群发优惠
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageService } from '@/services/message.service'
import { IndexService } from './index.service'
import { CrowdAPI } from '@/api/v1/crowd'
import BrandSettingSmsGroup from '@/views/biz-modals/brand/setting/sms/group'
import BrandAppPluginSendCouponBatchSend from '@/views/biz-modals/brand/app/plugin/send-coupon/batch-send'

export default {
  serviceInject() {
    return {
      messageService: MessageService,
      crowdAPI: CrowdAPI,
      aService: IndexService
    }
  },
  rxState() {
    return {
      auth: this.aService.auth$
    }
  },
  model: {
    type: 'value',
    event: 'dataChangge'
  },
  modals: {
    BrandSettingSmsGroup,
    BrandAppPluginSendCouponBatchSend
  },
  props: {
    value: Array
  },
  data() {
    return {
      imgArry: [
        require('@/assets/img/shop_crowd_new.png'),
        require('@/assets/img/shop_crowd_expire.png'),
        require('@/assets/img/shop_crowd_private_teaching.png')
      ]
    }
  },
  created() {
    console.log(this.crowdAPI.crowdShopExport())
  },
  computed: {
    importantCrowd() {
      return this.value.slice(0, 3)
    }
  },
  methods: {
    newCrowd(data) {
      this.messageService.warn({ content: data })
    },
    exportFunc(id) {
      // this.aService.getListInfo(id).subscribe()
    },
    onCrowdRefresh(id) {
      this.aService.crowdBrandRefresh(id).subscribe(res => {
        this.$router.reload()
      })
    }
  },
  mounted() {}
}
</script>
