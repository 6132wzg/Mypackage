<template>
  <div :class="bPage()">
    <st-panel app>
      <div :class="bPage('content')">
        <img
          :class="bPage('content-success-img')"
          src="~@/assets/img/brand/marketing/lottery/success.png"
          alt="success"
        />
        <div class="mg-b16 mg-t24">活动新增成功</div>
        <div class="mg-b24" :class="bPage('content-text')">
          更多曝光推广，获得更多客户与订单
        </div>
        <div :class="bPage('content-action')">
          <span
            @click="pushSharePosterModal"
            :class="bPage('content-action-item')"
          >
            <img
              :class="bPage('content-action-img')"
              src="~@/assets/img/brand/marketing/lottery/poster.png"
              alt="success"
            />
            <a>
              分享海报
            </a>
          </span>
          <span :class="bPage('content-action-item')">
            <img
              :class="bPage('content-action-img')"
              src="~@/assets/img/brand/marketing/lottery/ad.png"
              alt="success"
            />
            <router-link to="/brand/setting/mina/index">
              设置活动广告
            </router-link>
          </span>
          <span
            @click="pushQrCodeModal()"
            :class="bPage('content-action-item')"
          >
            <img
              :class="bPage('content-action-img')"
              src="~@/assets/img/brand/marketing/lottery/mina.png"
              alt="success"
            />
            <a>
              小程序码
            </a>
          </span>
        </div>
        <div :class="bPage('content-btn')">
          <router-link to="./add">
            <st-button class="mg-r16">
              新增活动
            </st-button>
          </router-link>
          <router-link to="./index">
            <st-button type="primary">
              返回活动列表页
            </st-button>
          </router-link>
        </div>
      </div>
    </st-panel>
  </div>
</template>
<script>
import { SuccessService } from './success.service'
import useShare from '@/hooks/marketing/share.hook'

export default {
  name: 'PluginLotteryAdd',
  data() {
    return {}
  },
  bem: {
    bPage: 'page-brand-marketing-plugin-lottery-success'
  },
  serviceInject() {
    return {
      service: SuccessService
    }
  },
  rxState() {
    const { info$, qrcode$ } = this.service
    return { info$, qrcode$ }
  },
  hooks() {
    return {
      share: useShare()
    }
  },
  computed: {
    lotteryId() {
      return this.$searchQuery.id
    }
  },
  methods: {
    pushSharePosterModal() {
      this.service.getSharePosterInfo(this.lotteryId).subscribe(res => {
        const info = this.info$
        const shsInfo = {
          qrcode_url: info.qrcode_url,
          sub_name: info.sub_name
        }
        const isAuth = res.is_auth
        this.share.poster({ isAuth, shsInfo, shsPath: '/saas/lottery_poster' })
      })
    },
    pushQrCodeModal() {
      this.service.getQrCode(this.lotteryId).subscribe(res => {
        this.share.qrCode({ isAuth: res.is_auth, qrCodeUrl: this.qrcode$ })
      })
    }
  }
}
</script>
