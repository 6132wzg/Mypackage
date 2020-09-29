import CustomDecorateProductTableSelect from '@/views/biz-modals/custom-decorate/product-table-select'
import { cloneDeep } from 'lodash'
export default {
  modals: {
    CustomDecorateProductTableSelect
  },
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    },
    /**
     * 模块名称
     */
    moduleName: {
      type: String,
      default: ''
    },
    /**
     * 模块类型
     */
    moduleType: {
      type: [Number, String],
      default: 1
    },
    /**
     * 门店 id
     */
    shopId: {
      type: [Number, String],
      default: 0
    },
    /**
     * 限制数量
     */
    maxNum: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      draggableOptions: {
        filter: '.ignore-elements'
      },
      DATA_SOURCE_CUSTOM: 99,
      flexibleKeys: ['show_direction', 'data_source', 'show_content'],
      idKeyName: 'id',
      customList: []
    }
  },
  computed: {
    isShowCustom() {
      return this.data_source === this.DATA_SOURCE_CUSTOM
    },
    selectedRowKeys() {
      const selectedRowKeys = []
      this.value.list.forEach(item => {
        selectedRowKeys.push(item[this.idKeyName])
      })
      return selectedRowKeys
    }
  },
  watch: {
    value(val) {
      this.init()
    },
    data_source(newVal, oldVal) {
      /**
       * 缓存自定义数据
       */
      const { DATA_SOURCE_CUSTOM } = this
      if (oldVal === DATA_SOURCE_CUSTOM) {
        this.customList = this.value.list
      }
      if (newVal === DATA_SOURCE_CUSTOM && oldVal !== null) {
        this.value.list = this.customList
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.flexibleKeys.forEach(key => {
        if (this.hasOwnProperty(key)) {
          this[key] = this.value[key]
        }
      })
    },
    onDel(index) {
      this.value.list.splice(index, 1)
      this.onChange()
    },
    onImageChange(images, index) {
      this.value.list[index].image = images.length ? images.pop() : []
      this.onChange()
    },
    onChange() {
      const { list } = this.value
      const data = {
        list
      }
      this.flexibleKeys.forEach(key => {
        if (this.hasOwnProperty(key)) {
          data[key] = this[key]
        }
      })
      this.$emit('input', data)
      this.$emit('change')
      console.log('change', data)
    },
    /**
     * 触发定义选择
     */
    onCustomAction() {
      const { title, max } = this.modalConfig
      this.$modalRouter.push({
        name: 'custom-decorate-product-table-select',
        props: {
          module_type: this.moduleType,
          defaultSelectedRowKeys: this.selectedRowKeys,
          defaultSelectedRows: this.value.list,
          idKeyName: this.idKeyName,
          shopId: this.shopId,
          title,
          max
        },
        on: {
          complete: res => {
            if (typeof this.adaptor === 'function') {
              this.value.list = this.adaptor(res.selectedRows)
              this.onChange()
            }
          }
        }
      })
    },
    selectedRowKeysFilter() {
      const selectedRowKeys = []
      this.value.list.forEach(item => {
        selectedRowKeys.push(item[this.idKeyName])
      })
      return selectedRowKeys
    }
  }
}
