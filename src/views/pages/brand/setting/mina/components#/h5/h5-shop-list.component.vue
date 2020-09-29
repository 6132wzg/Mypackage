<template>
  <div :class="module()">
    <div :class="module('button')">
      <div :class="module('shop')" v-if="selectShop">
        {{ selectShop.shop_name }}
      </div>
      <a-dropdown
        overlayClassName="setting-shop-list__dropdown"
        :trigger="['click']"
        :getPopupContainer="trigger => trigger.parentNode"
        @visibleChange="dropdownFlag = !dropdownFlag"
      >
        <div
          :class="
            module('icon', {
              up: dropdownFlag
            })
          "
        >
          <st-icon size="12px" color="#252A2E" type="down"></st-icon>
        </div>
        <div slot="overlay" :class="module('overlay')">
          <div
            @click="tapShop(item.shop_id, index)"
            :class="
              module('overlay--item', {
                active: shopActiveIndex === index
              })
            "
            v-for="(item, index) in shopList"
            :key="index"
          >
            <div :class="module('overlay--item-name')">
              {{ item.shop_name }}
            </div>
          </div>
        </div>
      </a-dropdown>
    </div>
  </div>
</template>
<script>
import { H5SettingIndexService } from './h5-setting-index.service'
export default {
  name: 'h5ShopListComponent',
  bem: {
    module: 'h5-shop-list-component'
  },
  props: {
    shopList: {
      type: Array,
      default: () => {
        return []
      }
    },
    shopActiveIndex: {
      type: Number,
      default: 0
    }
  },
  serviceInject() {
    return {
      h5SettingIndexService: H5SettingIndexService
    }
  },
  watch: {},
  data() {
    return {
      dropdownFlag: false
    }
  },
  computed: {
    selectShop: function() {
      return this.shopList[this.shopActiveIndex]
    }
  },
  methods: {
    tapShop(shopId, index) {
      this.dropdownFlag = !this.dropdownFlag
      if (index !== this.shopActiveIndex) {
        this.$emit('change', shopId)
      }
    }
  }
}
</script>
