<template>
  <st-panel app>
    <div :class="basic()">
      <router-link :to="i.url" v-for="(i, index) in typeList" :key="index">
        <div :class="bCard()">
          <img :src="i.bg" :alt="i.name" />
          <div :class="bCard('name')">{{ i.name }}</div>
        </div>
      </router-link>
    </div>
  </st-panel>
</template>
<script>
export default {
  bem: {
    basic: 'brand-marketing-plugin-choose',
    bCard: 'card'
  },
  data() {
    return {
      typeList: [
        {
          name: `${this.$c('member_card')}`,
          bg: require('@/assets/img/brand/marketing/group/mod_member.png'),
          url: './add-member'
        },
        {
          name: '储值卡',
          bg: require('@/assets/img/brand/marketing/group/mod_stored.png'),
          url: './add-deposit'
        },
        {
          name: '私教课',
          bg: require('@/assets/img/brand/marketing/group/mod_personal.png'),
          url: './add-personal'
        },
        {
          name: '课程包',
          bg: require('@/assets/img/brand/marketing/group/mod_course.png'),
          url: './add-package-course'
        }
      ]
    }
  }
}
</script>
