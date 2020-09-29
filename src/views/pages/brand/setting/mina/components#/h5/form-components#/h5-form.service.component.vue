<template>
  <div :class="module()">
    <div :class="module('title')">{{ serviceData.module_name }}</div>
    <div :class="module('list')">
      <div v-for="(li, index) in list" :key="index">
        <div :class="module('box')">
          <div :class="module('box__icon')">
            <img :src="li.icon_path" class="box__img" />
          </div>
          <div :class="module('checked')">
            <st-checkbox
              :value="li.is_display"
              @change="onClick(index)"
            ></st-checkbox>
          </div>
          <div :class="module('name')">
            {{ li.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'h5FormAssetsdataComponent',
  bem: {
    module: 'h5-form-service-component'
  },
  components: {},
  props: {
    serviceData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  watch: {
    serviceData: {
      handler(newVal) {
        this.list = newVal.content.list
        console.log(23444343, this.list)
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      list: []
    }
  },
  methods: {
    onClick(index) {
      console.log('----', this.list, index)
      let displayTotal = 0
      this.list.forEach(val => {
        if (val.is_display) {
          displayTotal++
        }
      })
      if (displayTotal === 1 && this.list[index].is_display) {
        return
      }
      this.list[index].is_display = +!this.list[index].is_display
      this.$emit('change')
    }
  }
}
</script>
