<template>
  <div class="page-dashboard-plugin">
    <a :href="href" target="_blank" rel="noopener">
      <div class="image">
        <img :src="img" :alt="title" />
      </div>

      <div class="text">
        <st-t4 class="t4">{{ title }}</st-t4>
        <p class="detail" :title="sub">{{ sub }}</p>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: 'PlugIn',
  props: {
    title: {
      type: String,
      default: '优惠券'
    },
    sub: {
      type: String,
      default: '优惠抵扣购课费用'
    },
    img: {
      type: String,
      default:
        'https://file.digitaling.com/eImg/uimages/20170814/1502707757253062.jpg'
    },
    href: {
      type: String,
      default: 'javascript:void(0)'
    }
  }
}
</script>
