<template>
  <div :class="b('biz-select-area')">
    <div v-if="value.length">
      <!-- default -->
      <a-checkbox-group v-if="type === 'default'" :disabled="disabled">
        <a-checkbox
          v-for="(item, index) in value"
          :key="index"
          :value="item.id"
        >
          {{ item.name }}
        </a-checkbox>
      </a-checkbox-group>
      <!-- tree -->
      <div :class="b('tree')" v-if="type === 'tree'">
        <a-input-search
          class="mg-b16"
          :class="b('tree-search')"
          @search="onTreeSearch"
          placeholder="请输入场地名称查询"
          :disabled="disabled"
        />
        <a-tree
          checkable
          @expand="onExpand"
          :autoExpandParent="autoExpandParent"
          :expandedKeys="expandedKeys"
          :treeData="vipTree"
          @check="onTreeSelect"
          :disabled="disabled"
        >
          <template slot="title" slot-scope="{ title }">
            <span v-if="title.indexOf(searchValue) > -1">
              {{ title.substr(0, title.indexOf(searchValue)) }}
              <span :class="b('tree-title-span')">{{ searchValue }}</span>
              {{
                title.substr(title.indexOf(searchValue) + searchValue.length)
              }}
            </span>
            <span v-else>{{ title }}</span>
          </template>
        </a-tree>
      </div>
    </div>
    <div v-else>无</div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash-es'
export default {
  bem: {
    b: 'biz-select-area'
  },
  props: {
    value: {
      type: Array,
      default() {
        return [
          {
            id: 667846544261962,
            name: '露露上海店',
            areas: [
              {
                id: 667846544269451,
                name: 'VIP场地A'
              }
            ]
          }
        ]
      }
    },
    /**
     * default | tree
     */
    type: {
      type: String,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      expandedKeys: [],
      autoExpandParent: true,
      searchValue: '',
      // 选择的vip区域
      selectVipAreas: []
    }
  },
  computed: {
    vipTree() {
      let array = []
      if (this.type === 'tree') {
        this.value.forEach(i => {
          let children = []
          i.areas.forEach(o => {
            children.push({
              title: o.name,
              key: `${i.id}-${o.id}`,
              scopedSlots: { title: 'title' }
            })
          })
          array.push({
            title: i.name,
            key: i.id,
            scopedSlots: { title: 'title' },
            children
          })
        })
      }
      return array
    }
  },
  methods: {
    onTreeSearch(data) {
      if (data === '') {
        Object.assign(this, {
          expandedKeys: [],
          searchValue: data,
          autoExpandParent: true
        })
        return
      }
      let expandedKeys = []
      this.vipTree.forEach(i => {
        if (i.children) {
          i.children.forEach(o => {
            if (o.title.includes(data)) {
              expandedKeys.push(i.key)
            }
          })
        }
      })
      this.expandedKeys = cloneDeep(expandedKeys)
      this.searchValue = data
      this.autoExpandParent = true
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onTreeSelect(checkeds) {
      let selectAreasObject = {}
      let vipAreas = []
      let selectAreasArray = []
      vipAreas = checkeds.filter(i => `${i}`.includes('-'))
      vipAreas.forEach(i => {
        if (selectAreasObject[i.split('-')[0]]) {
          selectAreasObject[i.split('-')[0]].push(+i.split('-')[1])
        } else {
          selectAreasObject[i.split('-')[0]] = [+i.split('-')[1]]
        }
      })
      Object.keys(selectAreasObject).forEach(i => {
        selectAreasArray.push({
          shop_id: +i,
          areas: cloneDeep(selectAreasObject[i])
        })
      })
      this.selectVipAreas = cloneDeep(selectAreasArray)
    }
  }
}
</script>
