<template>
  <div :class="b()">
    <div :class="b('left')">
      <st-t2>
        轻嘤小程序
      </st-t2>
      <p :class="b('content')">
        三体轻嘤小程序为您提供免费的会员端引流转化工具，无须开通微信支付即可直接使用，助力场馆打破流量孤岛，开放生态共赢，还有更多流量福利等你来领，实现用户的快速增长！
      </p>
      <div :class="b('footer')">
        <div :class="b('footer-module')">
          <img :src="brand" alt="品牌曝光" />
          <div>
            <p :class="b('text-shop')">品牌曝光</p>
            <label :class="b('text-desc')">
              基于平台开放生态，打造品牌特色
            </label>
          </div>
        </div>
        <div :class="b('footer-module')">
          <img :src="course" alt="极速约课" />
          <div>
            <p :class="b('text-shop')">极速约课</p>
            <label :class="b('text-desc')">实时发布课程，会员一键预约</label>
          </div>
        </div>
      </div>
    </div>
    <div :class="b('right')">
      <img :src="info.default_qrcode" />
      <p>三体微信小程序示例 扫码查看</p>
    </div>
  </div>
</template>

<script>
import brand from '@/assets/img/brand/marketing/qy-mina/icon_brand.png'
import course from '@/assets/img/brand/marketing/qy-mina/icon_course.png'
export default {
  name: 'MarktingMinaPluginTitle',
  bem: {
    b: 'markting-mina-plugin-title'
  },
  data() {
    return {
      brand,
      course
    }
  },
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
