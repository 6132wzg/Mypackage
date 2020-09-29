<template>
  <div
    :class="
      module({
        info: hasSlot,
        hide: !moduleInfo.module_is_display,
        active: isActive
      })
    "
  >
    <a-tooltip
      :class="module('draggable')"
      placement="top"
      v-if="!hasChange && !hasSlot"
    >
      <template slot="title">
        <span>拖拽调整顺序</span>
      </template>
      <div>
        <st-icon size="16px" class="tooltip-draggable" type="tuozhuai" />
      </div>
    </a-tooltip>
    <template v-if="renaming">
      <st-input
        :class="module('left--input')"
        v-model="moduleInfo.module_name"
        :maxLength="20"
        @change="change"
        @mousemove="mouseEmit(false)"
        @mouseleave="mouseEmit(true)"
      ></st-input>
      <div @click="renameSave" :class="module('left--save')">保存</div>
      <div :class="module('left--close')" @click="renameClose">
        <st-icon color="#cdd4df" type="close" />
      </div>
    </template>
    <template v-else>
      <div :class="module('left')">
        <div :class="module('name')">{{ moduleInfo.module_name }}</div>
        <div @click="editName">
          <st-icon
            v-if="moduleInfo.is_can_rename"
            size="12px"
            color="#9BACB9"
            :class="module('edit')"
            type="edit"
          />
        </div>
      </div>
      <div v-if="!hasChange && !hasSlot" :class="module('right')">
        <div
          :class="module('handle')"
          @click="hideModule"
          v-if="moduleInfo.is_can_display"
        >
          <a-tooltip title="隐藏" v-if="moduleInfo.module_is_display">
            <div><st-icon size="16px" color="#FF5E41" type="eye-show" /></div>
          </a-tooltip>
          <a-tooltip v-else title="显示" :class="module('handle-hide')">
            <div><st-icon color="#9BACB9" size="16px" type="eye-hide" /></div>
          </a-tooltip>
        </div>

        <st-popconfirm
          :title="'一旦删除则无法恢复，确认删除'"
          @confirm="deleteModule"
        >
          <div :class="module('handle')" v-if="moduleInfo.is_can_delete">
            <a-tooltip title="删除">
              <div><st-icon size="14px" color="#FF5E41" type="delete" /></div>
            </a-tooltip>
          </div>
        </st-popconfirm>
      </div>
      <div :class="module('right')"><slot /></div>
    </template>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash-es'
export default {
  name: 'H5ModuleComponent',
  bem: {
    module: 'h5-module-component'
  },
  props: {
    moduleInfo: {
      type: Object,
      default: () => {}
    },
    isActive: {
      type: Boolean,
      default: false
    },
    // 没有slot时使用不可更改模板
    isNoChange: {
      type: Boolean,
      default: false
    },
    // 是否有插槽
    hasSlot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 是否正在重命名
      renaming: false,
      // 使用不可更改模板
      hasChange: false,
      historyNmae: '',
      canDrag: true
    }
  },
  watch: {
    isActive: function(newVal) {
      !newVal && this.renameSave()
    },
    isNoChange: {
      handler(newVal) {
        if (newVal) {
          this.hasChange = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.historyNmae = this.moduleInfo.module_name
  },
  methods: {
    change() {
      this.$emit('change', this.moduleInfo)
    },
    editName() {
      this.renaming = true
    },
    renameClose() {
      this.renaming = false
      this.moduleInfo.module_name = this.historyNmae
    },
    renameSave() {
      this.renaming = false
    },
    hideModule() {
      this.moduleInfo.module_is_display = +!this.moduleInfo.module_is_display
      this.change()
    },
    deleteModule() {
      this.moduleInfo.module_is_delete = 1
      this.$emit('delete', this.moduleInfo)
    },
    mouseEmit(flag) {
      this.$emit('mouse', flag)
    }
  }
}
</script>
