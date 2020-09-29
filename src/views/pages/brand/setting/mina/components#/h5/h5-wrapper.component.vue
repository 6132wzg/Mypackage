<template>
  <st-mina-panel :class="h5wpr()" initial>
    <st-tabs
      defaultActiveKey="1"
      class="st-tabs"
      :activeKey="currentactiveKey"
      @change="changeTab"
    >
      <st-tab-pane class="pd-0" tab="首页装修" key="1">
        <h5-setting-index-component
          @change="editContent"
          v-if="currentactiveKey === '1'"
        />
      </st-tab-pane>
      <st-tab-pane tab="预约页面" key="2" class="pd-0">
        <h5-setting-reserve-component
          @change="editContent"
          v-if="currentactiveKey === '2'"
        />
      </st-tab-pane>
      <st-tab-pane tab="我的页面" key="3" class="pd-0">
        <h5-setting-my-component
          @change="editContent"
          v-if="currentactiveKey === '3'"
        />
      </st-tab-pane>
      <st-tab-pane tab="底部导航" key="4" class="pd-0">
        <h5-setting-tabbar-component
          @change="editContent"
          v-if="currentactiveKey === '4'"
        />
      </st-tab-pane>
    </st-tabs>
  </st-mina-panel>
</template>
<script>
import H5SettingIndexComponent from './h5-setting-index.component'
import H5SettingReserveComponent from './h5-setting-reserve.component'
import H5SettingMyComponent from './h5-setting-my.component'
import H5SettingTabbarComponent from './h5-setting-tabbar.component'
import H5Component from './h5.component'
export default {
  name: 'H5WrapperComponent',
  components: {
    H5SettingIndexComponent,
    H5SettingReserveComponent,
    H5SettingMyComponent,
    H5SettingTabbarComponent
  },
  bem: {
    h5wpr: 'h5-wrapper-component'
  },
  data() {
    return {
      currentactiveKey: '1',
      isEdit: false
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    editContent(isEdit) {
      this.isEdit = isEdit
      this.emitChange()
    },
    changeTab(key) {
      if (this.isEdit) {
        this.$confirm({
          title: '确定要离开？',
          content: '此时离开将丢失已编辑的内容，是否确认离开？',
          onOk: () => {
            this.currentactiveKey = `${key}`
            this.isEdit = false
            this.emitChange()
          }
        })
      } else {
        this.currentactiveKey = `${key}`
      }
    },
    emitChange() {
      this.$emit('change', this.isEdit)
    }
  }
}
</script>
