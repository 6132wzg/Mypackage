<template>
  <div :class="mapButton()" @click="map">
    <div :class="mapButton('add')" v-if="isAdd">
      <st-icon type="location" size="32px" :class="mapButton('icon')"></st-icon>
      <p>{{ addText }}</p>
    </div>
    <div :class="mapButton('update')" v-else>
      <p>{{ `${province.name} ${city.name} ${district.name}` }}</p>
      <p>{{ pureAddress }}</p>
    </div>
  </div>
</template>
<script>
import ShopMap from '@/views/biz-modals/shop/map'
export default {
  bem: {
    mapButton: 'st-map-button'
  },
  name: 'StMapButton',
  modals: {
    ShopMap
  },
  props: {
    addText: {
      type: String,
      default() {
        return '设置门店地址'
      }
    },
    address: {
      type: String,
      default() {
        return '无'
      }
    },
    province: {
      type: Object,
      default() {
        return {}
      }
    },
    city: {
      type: Object,
      default() {
        return {}
      }
    },
    district: {
      type: Object,
      default() {
        return {}
      }
    },
    lat: {
      type: String,
      default() {
        return ''
      }
    },
    lng: {
      type: String,
      default() {
        return ''
      }
    }
  },
  computed: {
    isAdd() {
      return this.lat === '' || this.lng === ''
    },
    st_province() {
      return this.province
    },
    st_city() {
      return this.city
    },
    st_district() {
      return this.district
    },
    pureAddress() {
      return this.address
        .replace(this.province.name, '')
        .replace(this.city.name, '')
        .replace(this.district.name, '')
    }
  },
  methods: {
    map() {
      this.$modalRouter.push({
        name: 'shop-map',
        props: {
          lat: this.lat,
          lng: this.lng,
          province: this.st_province,
          city: this.st_city,
          district: this.st_district,
          address: this.address
        },
        on: {
          ok: this.mapOk
        }
      })
    },
    mapOk(data) {
      this.$emit('select', data)
      this.$emit('change', data)
    }
  }
}
</script>
