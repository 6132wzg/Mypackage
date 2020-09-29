<template>
  <st-panel-layout :class="b()">
    <MarkteingPluginTitle pathName="brand-app-training-book-info" />
    <div :class="b('content')">
      <img :src="image" alt="" v-for="(image, index) in images" :key="index" />
    </div>
  </st-panel-layout>
</template>
<script>
import MarkteingPluginTitle from '../../marketing/components#/marketing-title'
import { InfoService } from './info.service'
export default {
  bem: {
    b: 'brand-app-training-book'
  },
  components: {
    MarkteingPluginTitle
  },
  serviceInject() {
    return {
      infoService: InfoService
    }
  },
  data() {
    return {
      images: []
    }
  },
  mounted() {
    this.infoService.getPluginInfo().subscribe(res => {
      this.images = res.not_open_images
    })
  }
}
</script>
