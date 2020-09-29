<template>
  <a-input
    class="st-input"
    :style="{ width }"
    :maxlength="maxLength"
    v-bind="$attrs"
    v-model="dvalue"
    v-on="{
      ...$listeners,
      change: onChange,
      mousemove: inputMouseMove,
      mouseleave: inputMouseLeave
    }"
  >
    <span
      v-if="maxLength > 0"
      :class="{ 'st-input__suffix--disabled': disabled }"
      class="st-input__suffix"
      slot="suffix"
    >
      {{ valueLength }}/{{ maxLength }}
    </span>
  </a-input>
</template>

<script>
export default {
  name: 'StInput',
  model: {
    event: 'change',
    prop: 'value'
  },
  data() {
    return {
      dvalue: ''
    }
  },
  watch: {
    value(newValue) {
      this.dvalue = newValue
    }
  },
  computed: {
    valueLength() {
      return this.dvalue ? this.dvalue.length : 0
    },
    disabled() {
      return this.$attrs.disabled
    }
  },
  created() {
    this.dvalue = this.value
  },
  props: {
    maxLength: Number,
    value: {
      type: [Number, String]
    },
    width: {
      type: String,
      default: '100%'
    }
  },
  methods: {
    onChange(e) {
      this.dvalue = e.target.value
      this.$emit('change', this.dvalue)
    },
    inputMouseMove(e) {
      this.$emit('mousemove')
    },
    inputMouseLeave(e) {
      this.$emit('mouseleave')
    }
  }
}
</script>
