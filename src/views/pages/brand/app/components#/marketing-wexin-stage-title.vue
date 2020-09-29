<template>
  <div :class="b()">
    <div :class="b('left')">
      <div :class="b('left-top')">
        <div class="title">
          {{ info.plugin_name }}
          <span class="tip" @click="ruleDetail">规则说明</span>
        </div>
        <div class="content" v-html="info.introduction"></div>
      </div>
      <div :class="b('left-bottom')">
        <span class="label">到期时间：</span>
        <span class="content">2020-10-21</span>
      </div>
    </div>
    <div :class="b('right')">
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
import BrandMarketingRuleTip from '@/views/biz-modals/brand/marketing/rule-tip'

export default {
  name: 'MarktingWexinStageTitle',
  bem: {
    b: 'marketing-wexin-stage-title'
  },
  modals: {
    BrandMarketingRuleTip
  },
  data() {
    return {}
  },
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
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
    }
  }
}
</script>
