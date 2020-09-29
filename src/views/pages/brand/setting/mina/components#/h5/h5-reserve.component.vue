<template>
  <div :class="h5Reserve()">
    <div :class="h5Reserve('title')">
      预约
    </div>
    <div
      :class="[
        'h5-reserve__header',
        {
          'h5-reserve__border-select': isBorderSelect && reserveList.length > 0
        }
      ]"
    >
      <div :class="h5Reserve('tabs')">
        <div
          class="h5-reserve__tabs-item"
          v-for="li in reserveList"
          :class="{ active_tab: li.type === activeTab }"
          :key="li.type"
          v-show="li.is_display"
          @click="changeTab(li)"
        >
          {{ li.title || li.default_title }}
        </div>
      </div>
      <div :class="h5Reserve('filter')" v-if="reserveList.length">
        筛选
        <st-icon type="filter" size="32px" />
      </div>
    </div>
    <div :class="h5Reserve('content')"></div>
  </div>
</template>
<script>
export default {
  props: {
    moduleDatas: {
      type: Array,
      default: function() {
        return []
      }
    },
    isBorderSelect: {
      type: Boolean,
      default: true
    }
  },
  bem: {
    h5Reserve: 'h5-reserve'
  },
  data() {
    return {
      activeTab: 0,
      checkList: [],
      reserveList: []
    }
  },
  watch: {
    moduleDatas: {
      handler(val) {
        if (val.length === 0) return
        this.reserveList = val[0].content.list
        this.activeTab = this.reserveList[0].type
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    changeTab(li) {
      this.activeTab = li.type
    }
  }
}
</script>
