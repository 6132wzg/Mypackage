<template>
  <div :class="bSourceMode()">
    <title-info v-model="titleData"></title-info>
    <span class="mg-r16">选择来源</span>
    <template v-if="value.getData.source_channel.length">
      <template v-for="(tag, index) in value.getData.source_channel">
        <a-tooltip :key="index" :title="tag.name">
          <a-tag
            :key="index"
            :closable="true"
            :afterClose="() => handleClose(tag, index)"
          >
            {{ tag.name }}
          </a-tag>
        </a-tooltip>
      </template>
    </template>

    <a-tag :class="bSourceMode('tag')">
      <a-dropdown>
        <a class="ant-dropdown-link">
          <a-icon type="plus" />
          新增
        </a>
        <a-menu slot="overlay">
          <a-menu-item v-for="(item, key, index) in crowdEnums" :key="index">
            <a @click="dropdownFunc(item, index)">{{ item.name }}</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </a-tag>
  </div>
</template>
<script>
import { UserService } from '@/services/user.service'
import titleInfo from './title-info.vue'
import { cloneDeep } from 'lodash-es'
export default {
  bem: {
    bSourceMode: 'crowd-components-source-mode'
  },
  serviceInject() {
    return {
      userService: UserService
    }
  },
  rxState() {
    return {
      crowdEnums: this.userService.getOptions$('crowd.crowd_source_channel', {
        labelField: 'name'
      })
    }
  },
  model: {
    type: 'value',
    event: 'dataChangge'
  },
  props: {
    value: Object
  },
  components: {
    titleInfo
  },
  data() {
    return {
      titleData: {
        title: '来源方式',
        info: '选择来源方式为以下范围的用户'
      },
      tags: []
    }
  },
  created() {
    if (this.value.getData.source_channel.length > 0) {
      this.tags = cloneDeep(this.value.getData.source_channel)
    }
  },
  methods: {
    dropdownFunc(item, index) {
      const arr = this.tags.filter(i => {
        return i.value === item.value
      })
      if (arr.length > 0) {
        return
      }
      this.value.getData.source_channel.push(item)
      this.tags.push(item)
    },

    onChange(date, dateString) {
      this.$emit('dataChangge', this.value)
    },
    handleClose(removedTag, index) {
      this.value.getData.source_channel.forEach((element, i) => {
        if (element.value === removedTag.value) {
          this.value.getData.source_channel.splice(i, 1)
        }
      })
    }
  }
}
</script>
