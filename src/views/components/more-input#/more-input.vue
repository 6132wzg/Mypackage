<template>
  <div class="st-more-input">
    <div
      class="st-more-input__wrap"
      v-for="(item, index) in inputList"
      :key="index"
    >
      <a-input
        allowClear
        style="width: 300px"
        :placeholder="placeholder"
        v-model="inputList[index]"
        @change="onChange"
      ></a-input>
      <a @click="onRemove(index)">
        <st-icon
          allowClear
          v-if="inputList.length !== 1"
          type="delete"
          size="14px"
          color="#FF5E41"
          class="st-more-input__delete"
        ></st-icon>
      </a>
    </div>
    <div class="st-more-input__add" v-if="inputList.length < length">
      <a @click="add">新增一个</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StMoreInput',
  model: {
    event: 'change',
    prop: 'value'
  },
  data() {
    return {
      inputList: ['']
    }
  },
  watch: {
    list() {
      if (this.list && this.list.length) {
        this.inputList = [...this.list]
      }
    }
  },
  created() {
    if (this.list && this.list.length) {
      this.inputList = [...this.list]
    }
  },
  props: {
    list: {
      type: Array
    },
    length: Number,
    placeholder: String
  },
  methods: {
    onChange() {
      this.$emit('change', [...this.inputList])
    },
    add() {
      this.inputList.push('')
    },
    onRemove(index) {
      this.inputList.splice(index, 1)
      this.onChange()
    }
  }
}
</script>
