<template>
  <div :class="basic()">
    <st-panel-layout :class="basic('main')">
      <st-panel app initial :class="basic('section')">
        <div :class="col()" :key="index" v-for="(item, index) in pluginList">
          <template v-if="item.plugin_list && item.plugin_list.length">
            <div :class="col('title')">
              {{ item.plugin_type | enumFilter('plugin.plugin_type') }}
            </div>
            <a-row :gutter="16" :class="col('list')">
              <a-col
                :xxl="6"
                :xl="8"
                :span="12"
                :key="index"
                v-for="(i, index) in item.plugin_list"
              >
                <div :class="ite()" @click="onClickHandle(i)">
                  <div :class="ite('tag')">
                    <img
                      v-if="i.tag === TAG_NEW"
                      src="~@/assets/img/brand/app/tag-new.png"
                    />
                    <img
                      v-else-if="i.tag === TAG_HOT"
                      src="~@/assets/img/brand/app/tag-hot.png"
                    />
                  </div>
                  <div :class="ite('left')">
                    <img :src="i.icon" alt="" />
                  </div>
                  <div :class="ite('right')">
                    <div :class="ite('title')">{{ i.plugin_name }}</div>
                    <div :class="ite('desc')">{{ i.introduction }}</div>
                  </div>
                </div>
              </a-col>
            </a-row>
          </template>
        </div>
      </st-panel>
    </st-panel-layout>

    <section :class="sider()">
      <header :class="sider('hd')">
        <span :class="sider('title')">运营玩法</span>
        <label :class="sider('label')">案例分享</label>
      </header>
      <div :class="sider('bd')">
        <ul :class="sider('list')">
          <li
            v-for="(item, index) in operation"
            :key="index"
            @click="goLink(item.link)"
          >
            <img :src="item.thumb | imgFilter({ w: 416, h: 234 })" />
            <p>{{ item.title }}</p>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
<script>
import { CenterService } from './center.service'

export default {
  name: 'BrandAppIndex',
  bem: {
    basic: 'page-brand-app',
    col: 'brand-app-column',
    ite: 'brand-app-item',
    sider: 'brand-app-sider'
  },
  serviceInject() {
    return {
      centerService: CenterService
    }
  },
  rxState() {
    return {
      operation: this.centerService.operation$,
      pluginList: this.centerService.pluginList$
    }
  },
  data() {
    return {
      TAG_NEW: 2,
      TAG_HOT: 3
    }
  },
  methods: {
    onClickHandle(item) {
      const { redrect_url: url } = item
      if (url.indexOf('http') !== -1) {
        this.goLink(url)
      } else if (url) {
        this.goToPlugin(url)
      }
    },
    goLink(url) {
      window.open(url)
    },
    goToPlugin(route) {
      this.$router.push({
        name: route
      })
    }
  }
}
</script>
