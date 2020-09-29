<template>
  <div :class="h5('wrapper')">
    <div :class="h5('scroll')">
      <div :class="h5()">
        <h5-reserve-component v-if="1"></h5-reserve-component>
        <h5-index-component
          v-else
          :openMiniFlag="openMiniFlag"
        ></h5-index-component>
        <div :class="h5('nav')">
          <div v-for="(li, index) in menuInfo" class="nav-li" :key="index">
            <img :src="li.icon | imgFilter({ w: 32, h: 32 })" />
            <p>{{ li.name }}</p>
          </div>
          <!-- <div :class="h5('nav-home')"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { H5WrapperService } from './h5-wrapper.service'
import { AppConfig } from '@/constants/config'
import { UserService } from '@/services/user.service'
import { imgFilter } from '@/filters/resource.filters'
import H5IndexComponent from './h5-index.component'
import H5ReserveComponent from './h5-reserve.component'
export default {
  bem: {
    h5: 'h5-component'
  },
  components: {
    H5IndexComponent,
    H5ReserveComponent
  },
  serviceInject() {
    return {
      h5WrapperService: H5WrapperService,
      config: AppConfig,
      userService: UserService
    }
  },
  rxState() {
    return {
      menuInfo: this.h5WrapperService.menuInfo$,
      brand: this.userService.brand$
    }
  },
  watch: {
    checkedInfo: {
      deep: true,
      handler(newVal) {
        this.checkedClass = `h5-component__action--${newVal.length}`
      }
    }
  },
  props: {
    // 门店上架会员卡数量
    openMiniFlag: {
      type: Boolean,
      default: false
    },
    activeKey: {
      type: String,
      default: '1'
    }
  },
  filters: {
    priceFilter(val) {
      if (val) {
        return `￥${val}`
      } else {
        return '咨询定价'
      }
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    imageFilter(key, opts) {
      return imgFilter(key, opts)
    }
  }
}
</script>
