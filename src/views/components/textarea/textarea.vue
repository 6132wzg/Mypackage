<template>
  <div :class="b()">
    <a-textarea
      :class="b('content')"
      v-bind="attrs"
      :allowClear="false"
      :disabled="disabled"
      v-model="content"
      @change="onChange"
    ></a-textarea>
    <label :class="b('label')">
      <span v-if="shouldUseRows">{{ currentRows }}/{{ maxRows }} 行</span>
      <span v-else>
        {{ currentLength }}/{{
          suffix ? suffix.length + 2 + maxlength : maxlength
        }}
        字
      </span>
    </label>
    <label v-if="suffix" :class="b('suffix')">{{ '【' + suffix + '】' }}</label>
  </div>
</template>
<script>
export default {
  name: 'StTextarea',
  model: {
    prop: 'value',
    event: 'change'
  },
  bem: {
    b: 'st-textarea'
  },
  props: {
    value: {
      type: String
    },
    maxlength: {
      type: [String, Number],
      default: 500
    },
    maxRows: {
      type: [String, Number],
      default: 0
    },
    autosize: {
      type: Object,
      default: () => {
        return {
          minRows: 10,
          maxRow: 20
        }
      }
    },
    // 文字后缀
    suffix: {
      type: [String, Object]
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      content: '',
      attrs: {
        autosize: this.autosize,
        ...this.$attrs
      },
      lastContent: ''
    }
  },
  watch: {
    value() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  computed: {
    currentLength() {
      return this.suffix
        ? this.content.length + this.suffix.length + 2
        : this.content.length
    },
    currentRows() {
      return this.calcRowsLength(this.content)
    },
    shouldUseRows() {
      return this.maxRows
    }
  },
  methods: {
    calcRowsLength(content) {
      return content
        .trim()
        .split('\n')
        .filter(item => item !== '').length
    },
    init() {
      this.content = this.value || ''
    },
    onChange(e) {
      if (this.maxRows) {
        const newRows = this.calcRowsLength(e.target.value)
        if (newRows > this.maxRows) {
          // 逐字输入
          if (newRows - this.calcRowsLength(this.lastContent) <= 1) {
            this.content = this.lastContent
          } else {
            // 复制黏贴截取
            this.content = e.target.value
              .trim()
              .split('\n')
              .slice(0, this.maxRows)
              .join('\n')
          }
        }
        this.$emit('input', this.content)
        this.$emit('change', this.content)
      } else {
        const { maxlength } = this
        const content = e.target.value.substr(0, maxlength)
        this.content = content
        this.$emit('input', content)
        this.$emit('change', content)
      }
      this.lastContent = this.content
    }
  }
}
</script>
