<template>
  <span class="st-help-tooltip">
    <a-tooltip
      v-if="invalidTooltips.indexOf(id) === -1 && !isCustom"
      :placement="placement"
      v-bind="$attrs"
      v-on="$listeners"
      @mouseenter="onMouseEnter"
      :mouseEnterDelay="0.3"
    >
      <template slot="title">
        <span>{{ content }}</span>
      </template>
      <!-- <span><st-icon type="help" /></span> -->
      <span class="st-help-tooltip-img">
        <img height="14" width="14" src="~@/assets/img/tooltip-help.png" />
      </span>
      <slot></slot>
    </a-tooltip>
    <a-tooltip
      v-if="defaultVisible && isCustom"
      v-bind="$attrs"
      v-on="$listeners"
      :mouseEnterDelay="0.3"
      :visible="visible"
      @visibleChange="change"
    >
      <slot></slot>
    </a-tooltip>
    <a-tooltip v-else v-bind="$attrs" v-on="$listeners" :mouseEnterDelay="0.3">
      <slot></slot>
    </a-tooltip>
  </span>
</template>
<script>
import { UserService } from '@/services/user.service'
import { HelpTooltipService } from './help-tooltip.service'
export default {
  name: 'StHelpTooltip',
  serviceInject() {
    return {
      userService: UserService,
      helpTooltipService: HelpTooltipService
    }
  },
  rxState() {
    return {
      invalidTooltips: this.userService.invalidTooltips$,
      menuData: this.userService.menuData$
    }
  },
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    id: {
      type: [Number, String],
      default: 0
    },
    placement: {
      type: String,
      default: 'top'
    },
    isCustom: {
      type: Boolean,
      default: false
    },
    defaultVisible: {
      type: Boolean,
      default: false
    },
    visible: Boolean
  },
  data() {
    return {
      content: '加载中...',
      loaded: false
    }
  },
  methods: {
    onMouseEnter() {
      if (!this.loaded) {
        this.getHelp()
      }
    },
    getHelp() {
      const { id } = this
      this.helpTooltipService.getToolTip(this.id).subscribe(res => {
        this.content = res.info.content
        this.loaded = true
      })
    },
    change(event) {
      this.$emit('change', event)
    }
  }
}
</script>
