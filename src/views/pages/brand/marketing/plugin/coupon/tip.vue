<template>
  <st-panel app initial>
    <div :class="basic()">
      <img src="~@/assets/img/brand/marketing/coupon/success.svg" />
      <p :class="basic('success')">活动新增成功</p>
      <p :class="basic('tips')">更多曝光推广，获得更多客户与订单</p>
      <ul>
        <li>
          <img src="~@/assets/img/brand/marketing/coupon/poster.svg" />
          <label @click="sharePoster">分享海报</label>
        </li>
        <li>
          <img src="~@/assets/img/brand/marketing/coupon/activity.png" />
          <label @click="jumpToad">设置活动广告</label>
        </li>
        <li>
          <img src="~@/assets/img/brand/marketing/coupon/mini-program.svg" />
          <label @click="shareQrcode">小程序码</label>
        </li>
      </ul>
      <div>
        <st-button @click="addCoupon">新增优惠券</st-button>
        <st-button type="primary" @click="backCoupon">返回优惠券列表</st-button>
      </div>
    </div>
  </st-panel>
</template>

<script>
/**
 * TODO: 这个组件没有使用到，张飞说和产品商量过了
 */
import BrandMarketingBind from '@/views/biz-modals/brand/marketing/bind'
import BrandMarketingPoster from '@/views/biz-modals/brand/marketing/share-poster'
export default {
  name: 'PageBrandMarketingPluginCouponTip',
  bem: {
    basic: 'page-brand-plugin-coupon-tip'
  },
  serviceInject() {
    return {}
  },
  rxState() {
    return {}
  },
  modals: {
    BrandMarketingBind,
    BrandMarketingPoster
  },
  computed: {},
  data() {
    return {}
  },
  mounted() {},
  watch: {},
  methods: {
    jumpToad() {
      this.$router.push({
        name: 'brand-setting-mina-index'
      })
    },
    sharePoster() {
      let auth = Number(this.$searchQuery.isAuth)
      if (auth) {
        this.$modalRouter.push({
          name: 'brand-marketing-poster',
          props: {
            id: String(this.$searchQuery.id),
            type: 1
          },
          on: {
            success: () => {
              console.log('success')
            }
          }
        })
      } else {
        this.$modalRouter.push({
          name: 'brand-marketing-bind',
          on: {
            success: () => {
              console.log('success')
            }
          }
        })
      }
    },
    shareQrcode() {
      let auth = Number(this.$searchQuery.isAuth)
      if (auth) {
        this.$modalRouter.push({
          name: 'brand-marketing-poster',
          props: {
            id: this.$searchQuery.id,
            type: 2
          },
          on: {
            success: () => {
              console.log('success')
            }
          }
        })
      } else {
        this.$modalRouter.push({
          name: 'brand-marketing-bind',
          on: {
            success: () => {
              console.log('success')
            }
          }
        })
      }
    },
    addCoupon() {
      this.$router.push({ path: '/brand/marketing/plugin/coupon/add' })
    },
    backCoupon() {
      this.$router.push({ path: '/brand/marketing/plugin/coupon/list' })
    }
  },
  components: {}
}
</script>
