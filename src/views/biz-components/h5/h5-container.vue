<template>
  <div :class="h5({ fixed })">
    <main :class="h5('main')">
      <nav :class="h5('nav')"><slot name="title">标题</slot></nav>
      <div :class="h5('content')">
        <slot v-if="isAuth && !loading.getInfo"></slot>
        <div v-if="!isAuth && !loading.getInfo" :class="h5('content-deny')">
          您还没配置小程序
          <br />
          不支持实时预览
          <br />
          <st-button
            :class="h5('content-deny-button')"
            type="primary"
            @click="gotoAuth"
          >
            去配置
          </st-button>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
import { H5ContainerService } from './h5-container.service'
export default {
  bem: {
    h5: 'st-h5-container'
  },
  props: {
    fixed: {
      type: Boolean,
      default: false
    }
  },
  serviceProviders() {
    return [H5ContainerService]
  },
  serviceInject() {
    return {
      H5ContainerService: H5ContainerService
    }
  },
  rxState() {
    return {
      loading: this.H5ContainerService.loading$
    }
  },
  data() {
    return {
      isAuth: 0
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.H5ContainerService.getInfo().subscribe(res => {
        this.isAuth = res.is_auth
      })
    },
    gotoAuth() {
      // this.$router.push({
      //   name: 'brand-setting-mina-index'
      // })
      const { href } = this.$router.resolve({
        name: 'brand-setting-mina-index'
      })
      window.open(href, '_blank')
    }
  }
}
</script>
