<template>
  <div :class="b()" ref="container">
    <a-cascader
      :display-render="displayRender"
      popupClassName="brand-setting-mina-custom-link__popupClass"
      placeholder="选择链接功能"
      :allowClear="false"
      v-model="module_select"
      :fieldNames="{
        label: 'name',
        value: 'id',
        children: 'children'
      }"
      :options="options"
      @change="changeModule"
      style="width: 100%"
    ></a-cascader>
  </div>
</template>

<script>
import BrandAppCustomDecorateCustomLink from '@/views/biz-modals/custom-decorate/custom-link'
import { cloneDeep } from 'lodash-es'
export default {
  name: '',

  bem: {
    b: 'brand-setting-mina-custom-link'
  },

  components: {},

  modals: { BrandAppCustomDecorateCustomLink },

  props: {
    link: {
      type: Object,
      default: () => {}
    },
    modules: {
      type: Array,
      defaut: () => []
    }
  },

  data() {
    return {
      module_select: [],
      options: [],
      customOption: {
        id: -1,
        type: 99,
        path: '',
        name: '自定义页面路径'
      }
    }
  },

  computed: {},

  async: {},

  mounted() {},

  watch: {
    modules: {
      handler(newV) {
        if (newV && newV.length) {
          this.options = [...newV, this.customOption]
        }
      },
      immediate: true
    },
    link: {
      handler(newV) {
        if (newV) {
          let select = newV.id
          this.module_select = cloneDeep(select)
          if (select && select.length && select[0] === -1) {
            this.customOption.path = newV.path
          } else {
            this.customOption.path = ''
          }
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    displayRender(data) {
      let { labels, selectedOptions } = data
      if (
        selectedOptions &&
        selectedOptions.length === 1 &&
        selectedOptions[0]['id'] === -1
      ) {
        return selectedOptions[0]['path']
      }
      return labels[labels.length - 1]
    },
    changeModule(args, selectedOptions) {
      let currentId = args[args.length - 1]
      let currentOption = selectedOptions[selectedOptions.length - 1]
      if (currentId === -1) {
        if (!currentOption.path) this.module_select = []
        this.$modalRouter.push({
          name: 'brand-app-custom-decorate-custom-link',
          props: {
            customPath: this.customOption.path
          },
          on: {
            change: res => {
              this.options[this.options.length - 1] = res
              this.customOption = res
              this.$emit('change', {
                ...res,
                id: [res.id]
              })
              this.module_select = [-1]
            }
          }
        })
      } else {
        this.options[this.options.length - 1] = {
          id: -1,
          type: 99,
          path: '',
          name: '自定义页面路径'
        }
        this.customOption = {
          id: -1,
          type: 99,
          path: '',
          name: '自定义页面路径'
        }
        this.$emit('change', {
          id: args,
          // name: currentOption.name, // 自定义的话和path一样
          type: currentOption.type,
          path: currentOption.path
        })
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
