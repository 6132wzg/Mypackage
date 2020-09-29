<template>
  <div :class="b()">
    <cabinet-area
      :class="b('nav')"
      v-model="$searchQuery.id"
      @changeCurrentArea="onChangeCurrentArea"
    ></cabinet-area>
    <st-panel :class="b('content')">
      <div slot="prepend" class="page-setting-cabinet-tab">
        <a-tabs
          v-model="$searchQuery.type"
          class="st-route-tabs"
          @change="onCabinetTabChange"
        >
          <a-tab-pane
            :tab="`临时储物柜(${currentArea.temporary_num || 0})`"
            key="temporary"
          ></a-tab-pane>
          <a-tab-pane
            :tab="`长期储物柜(${currentArea.long_term_num || 0})`"
            key="long-term"
          ></a-tab-pane>
          <a-tab-pane tab="使用记录" key="record"></a-tab-pane>
          <st-input-search
            class="mg-r24"
            @search="onCabinetKeywordsSearch"
            v-model="$searchQuery.keywords"
            placeholder="搜索柜号、姓名、手机号及手牌信息"
            allowClear
            slot="tabBarExtraContent"
          />
        </a-tabs>
      </div>
      <cabinet-list
        :loading="loading.getList"
        :list="list"
        :page="page"
        :areaName="areaName"
        ref="cabinetList"
        @refresh="onCabinetReload"
      ></cabinet-list>
    </st-panel>
  </div>
</template>
<script>
import { MessageService } from '@/services/message.service'
import { CabinetService } from './cabinet.service'
import CabinetArea from '@/views/biz-components/shop/cabinet/area'
import CabinetList from '@/views/biz-components/shop/cabinet/list'
export default {
  bem: {
    b: 'page-setting-cabinet'
  },
  data() {
    return {
      currentArea: {}
    }
  },
  serviceInject() {
    return {
      cabinetService: CabinetService
    }
  },
  rxState() {
    return {
      list: this.cabinetService.list$,
      page: this.cabinetService.page$,
      loading: this.cabinetService.loading$
    }
  },
  components: {
    CabinetList,
    CabinetArea
  },
  computed: {
    type() {
      return this.$searchQuery.type
    },
    areaName() {
      return this.currentArea.area_name
    }
  },
  methods: {
    onCabinetTabChange(key) {
      this.singleCabinetSearch('type', key)
    },
    onChangeCurrentArea(area) {
      this.currentArea = area
      this.singleCabinetSearch('id', area.id)
    },
    singleCabinetSearch(key, data) {
      this.$refs.cabinetList.onSelectionReset()
      this.$router.push({
        query: {
          [key]: data,
          id: this.currentArea.id
        }
      })
    },
    onCabinetKeywordsSearch(keywords) {
      this.$searchQuery.keywords = keywords
      this.onCabinetReload()
    },
    onCabinetReload() {
      this.$refs.cabinetList.onSelectionReset()
      this.$router.push({
        query: this.$searchQuery
      })
    }
  }
}
</script>
