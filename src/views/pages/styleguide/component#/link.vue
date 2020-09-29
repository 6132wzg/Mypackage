<template>
  <div>
    <div>
      <st-link value="这是超链接" @click="goToHome"></st-link>
    </div>
    <div>
      <st-link value="这是超链接的禁用形式" disabled></st-link>
    </div>
    <div>
      <st-link
        value="这是超链接，支持router-link的用法"
        :to="{ path: '/' }"
      ></st-link>
    </div>
    <div>
      <st-link
        value="这是超链接，整合了st-overflow-text组件,测试测试测试测试测试测试测试测试测试测试测试测试"
        @click="goToHome"
        maxWidth="300px"
      ></st-link>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goToHome() {
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>
