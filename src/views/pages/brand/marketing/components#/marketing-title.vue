<template>
  <div :class="basic()">
    <div :class="basic('left')">
      <p :class="basic('title')">{{ info.plugin_name }}</p>
      <p :class="basic('content')" v-html="info.introduction"></p>
      <p :class="basic('footer')">
        <label @click="ruleDetail" v-if="this.info.regulation">规则说明</label>
        <!-- <label @click="openTeach">使用教程</label>
        <label @click="openCase">活动案例</label> -->
      </p>
    </div>
    <div
      :class="basic('right')"
      v-viewer="{ url: 'data-src', toolbar: false, toolbar: false }"
    >
      <div
        class="st-preview-item imgBox"
        v-for="(item, index) in info.plugin_image"
        :key="index"
      >
        <img
          :src="item | imgFilter({ w: 80, h: 142 })"
          :data-src="item | imgFilter({ w: 1000 })"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { MarketingTitleService } from './marketing-title.service'
import BrandMarketingRuleTip from '@/views/biz-modals/brand/marketing/rule-tip'

export default {
  name: 'MarktingPluginTitle',
  bem: {
    basic: 'markting-plugin-title'
  },
  modals: {
    BrandMarketingRuleTip
  },
  serviceInject() {
    return {
      marketingTitleService: MarketingTitleService
    }
  },
  props: {
    /**
     * 插件path name
     */
    pathName: {
      type: String,
      required: true
    }
  },
  rxState() {
    return {
      loading: this.marketingTitleService.loading$,
      info: this.marketingTitleService.info$
    }
  },
  created() {
    this.marketingTitleService.getPluginInfo(this.pathName).subscribe()
  },
  data() {
    return {
      imgKeys: [
        'http://styd-saas-test.oss-cn-shanghai.aliyuncs.com/image/IUt_vXTl8zaWGwlO.jpg',
        'http://styd-saas-test.oss-cn-shanghai.aliyuncs.com/image/IUt_vXTl8zaWGwlO.jpg',
        'http://styd-saas-test.oss-cn-shanghai.aliyuncs.com/image/IUt_vXTl8zaWGwlO.jpg'
      ]
    }
  },
  methods: {
    ruleDetail() {
      this.$modalRouter.push({
        name: 'brand-marketing-rule-tip',
        props: {
          contents: this.info.regulation
        },
        on: {
          success: () => {
            console.log('success')
          }
        }
      })
    },
    openTeach() {
      if (this.info.usage_link) {
        window.open(this.info.usage_link)
      }
    },
    openCase() {
      if (this.info.usage_link) {
        window.open(this.info.case_link)
      }
    }
  }
}
</script>
