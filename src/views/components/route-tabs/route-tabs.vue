<template>
  <a-tabs
    :type="type"
    :activeKey="activeRouteName"
    :tabPosition="tabPosition"
    @change="onChange"
    class="st-route-tabs"
  >
    <a-tab-pane v-for="(tab, index) in options" :key="tab.route.name">
      <template slot="tab">
        <a-badge dot v-if="tab.isBadge">
          {{ tab.label || 'tab' + index }}
        </a-badge>
        <span v-else>{{ tab.label || 'tab' + index }}</span>
      </template>
    </a-tab-pane>
    <slot name="actions" slot="tabBarExtraContent"></slot>
  </a-tabs>
</template>

<script>
import { intersection } from 'lodash-es'
export default {
  name: 'StRouteTabs',
  props: {
    type: {
      type: String,
      default: 'line'
    },
    options: {
      type: Array,
      default: () => {
        return []
      },
      required: true,
      validator: value => {
        let flag
        value.forEach(tab => {
          flag = !tab.label || !tab.route || !tab.route.name
        })
        return !flag
      }
    },
    tabPosition: {
      type: String,
      default: 'top'
    }
  },
  computed: {
    activeRouteName() {
      const matchedRouteNames = this.$route.matched.map(item => item.name)
      const activeRouteNames = intersection(
        matchedRouteNames,
        this.options.map(item => item.route.name)
      )
      if (activeRouteNames.length) {
        return activeRouteNames[0]
      } else {
        return ''
      }
    }
  },
  created() {
    this.options.forEach(op => {
      if (!op.label) {
        throw new Error(['请设置 label 值'])
      }
      if (!op.route) {
        throw new Error([`请给label为${op.label}设置 route对象`])
      }
      if (!op.route.name) {
        throw new Error([`请给label为${op.label}设置 route对象`])
      }
    })
  },
  methods: {
    onChange(key) {
      const { options } = this
      let query = {}
      options.forEach(tab => {
        if (tab.route.name === key) {
          query = { ...tab.route.query }
        }
      })
      this.$emit('change', key, query)
      this.$router.push({ name: key, query })
    }
  }
}
</script>
