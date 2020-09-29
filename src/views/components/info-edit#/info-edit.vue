<template>
  <div
    class="info-edit"
    :class="{ isEdit: isEdit }"
    @click.stop="handleOpenEdit"
  >
    <div class="info-edit__wrapper">
      <div class="info-edit__label" :style="'min-width:' + labelWidth + 'px'">
        {{ label }}
      </div>
      <div class="info-edit__content" v-if="!isEdit">
        <slot />
      </div>
      <div class="info-edit__content" v-else>
        <template v-if="type === 'input'">
          <a-input
            :placeholder="placeholder"
            maxlength="30"
            v-model="sValue"
            slot="edit"
            style="width: 140px"
          ></a-input>
        </template>
        <template v-else-if="type === 'textarea'">
          <a-textarea
            v-model="sValue"
            :maxLength="200"
            :autosize="{ minRows: 1, maxRows: 3 }"
            slot="edit"
            style="minWidth: 400px"
            :placeholder="placeholder"
          ></a-textarea>
        </template>
        <template v-else-if="type === 'select'">
          <a-select
            v-model="sValue"
            :placeholder="placeholder"
            slot="edit"
            style="width: 140px"
          >
            <a-select-option :value="-1">无</a-select-option>
            <a-select-option
              v-for="item in options"
              :value="item.id"
              :key="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </template>
        <div class="info-edit__buttons">
          <st-button
            class="info-edit__button"
            type="link"
            @click.stop="handleConfirm"
          >
            确定
          </st-button>
          <st-button
            class="info-edit__button"
            type="link"
            @click.stop="handleCancel"
          >
            取消
          </st-button>
        </div>
      </div>
    </div>
    <!-- 非编辑状态,且全局没有处于编辑状态 -->
    <div
      class="info-edit__icon"
      v-if="canEdit && ((!isEdit && !invisibleEdit) || isEdit)"
    >
      <st-icon type="edit"></st-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: '',

  bem: {},

  components: {},

  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      required: true,
      default: ''
    },
    labelWidth: {
      type: String,
      default: '70'
    },
    type: {
      type: String,
      default: 'input'
    },
    invisibleEdit: {
      type: Boolean,
      default: false
    },
    canEdit: {
      type: Boolean,
      deafult: true
    },
    placeholder: {
      type: String,
      deafult: '请输入'
    },
    editBgColor: {
      type: String,
      default: '#fff'
    }
  },

  data() {
    return {
      isEdit: false,
      sValue: ''
    }
  },

  watch: {
    isEdit(v) {
      console.log('v', v)
      this.$emit('changeEditStatus', v)
    },
    value: {
      handler(v) {
        console.log('v', v)
        this.sValue = v
      },
      immediate: true
    }
  },

  async: {},

  mounted() {},

  methods: {
    handleOpenEdit() {
      if (
        this.canEdit &&
        ((!this.isEdit && !this.invisibleEdit) || this.isEdit)
      ) {
        this.isEdit = true
        this.sValue = this.value
        console.log('value', this.value)
      }
    },
    handleCancel() {
      this.isEdit = false
      this.sValue = ''
      console.log('handleCancel')
    },
    handleConfirm(value) {
      this.isEdit = false
      this.$emit('confirm', this.sValue)
      this.sValue = ''
    }
  }
}
</script>

<style lang="less" scoped></style>
