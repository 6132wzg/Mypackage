<template>
  <st-panel app :class="add()">
    <div :class="add('content')">
      <div
        :class="add('item')"
        v-for="(i, index) in packageTypeList"
        :key="index"
        @click="jumpTo(i.url)"
        :style="{
          background: `url(${i.bg}) no-repeat center`,
          backgroundSize: 'cover'
        }"
      >
        <div :class="add('text')">
          <h2 :class="add('title')">{{ i.title }}</h2>
          <p :class="add('describe')">{{ i.describe }}</p>
        </div>
      </div>
    </div>
  </st-panel>
</template>
<script>
export default {
  bem: {
    add: 'page-add-select-package'
  },
  data(vm) {
    return {
      packageTypeList: [
        {
          bg: require('@/assets/img/bg-course-package-unlimit.png'),
          title: '不限课程',
          describe: '支持用户预约门店全部课程',
          url: vm.cardUrlList.unLimit
        },
        {
          bg: require('@/assets/img/bg-course-package-range.png'),
          title: '范围内课程',
          describe: '支持用户预约限定范围内的课程',
          url: vm.cardUrlList.range
        },
        {
          bg: require('@/assets/img/bg-course-package-fix.png'),
          title: '固定课程',
          describe: '仅支持用户预约固定的课程',
          url: vm.cardUrlList.fix
        }
      ]
    }
  },
  props: {
    cardUrlList: {
      type: Object,
      default: () => {
        return {
          unLimit: 'shop-product-course-manage-package-add-unlimit-package',
          range: 'shop-product-course-manage-package-add-range-package',
          fix: 'shop-product-course-manage-package-add-fix-package'
        }
      }
    }
  },
  methods: {
    jumpTo(name) {
      this.$router.push({
        name
      })
    }
  }
}
</script>
