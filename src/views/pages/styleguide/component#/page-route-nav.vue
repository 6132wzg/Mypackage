<template>
  <div>
    <st-page-route-nav title="应用设置" v-model="navs"></st-page-route-nav>
  </div>
</template>
<script>
export default {
  data() {
    return {
      navs: [
        {
          label: '课程',
          route: {
            name: 'brand-setting-app-course-category'
          }
        },
        {
          label: '员工',
          route: {
            name: 'brand-setting-app-staff-skillful'
          }
        }
      ]
    }
  }
}
</script>
