<template>
  <st-modal
    title="黑名单管理"
    v-model="show"
    size="small"
    @ok="postBlackListSetting"
  >
    <a-select
      v-model="blackKeys"
      showSearch
      mode="multiple"
      placeholder="手机号搜索"
      style="width: 100%"
      :defaultActiveFirstOption="false"
      @search="onSearchKeyWords"
      :filterOption="false"
      @change="joinPerson"
      :maxTagCount="0"
      class="mg-b24"
    >
      <template slot="maxTagPlaceholder">
        <div>已选择{{ blackKeys.length || 0 }}个</div>
      </template>
      <a-select-option
        v-for="item in searchList"
        :key="item.user_id"
        :value="+item.user_id"
      >
        ({{ item.user_cate }}) &nbsp;&nbsp;{{ item.user_name }}&nbsp;{{
          item.mobile
        }}
      </a-select-option>
    </a-select>

    <st-table
      :columns="columns"
      :dataSource="blackList"
      :page="page"
      rowKey="user_id"
      @change="onChange"
    >
      <div slot="action" slot-scope="text, record">
        <st-table-actions>
          <a>
            <st-popconfirm
              :title="'一旦删除则无法恢复，确认删除'"
              @confirm="deletePerson(record)"
            >
              删除
            </st-popconfirm>
          </a>
        </st-table-actions>
      </div>
    </st-table>
  </st-modal>
</template>
<script>
import { columns } from './black-list.config'
import { BlackService } from './black-list.service'

export default {
  serviceInject() {
    return {
      blackService: BlackService
    }
  },
  rxState() {
    return {
      loading: this.blackService.loading$,
      blackList: this.blackService.blackList$,
      blackKeys: this.blackService.blackKeys$,
      searchList: this.blackService.searchList$
    }
  },
  bem: {
    bPage: 'modal-shop-blacklist'
  },
  props: {
    id: Number
  },
  data() {
    return {
      show: false,
      list: [],
      page: {} // 前端分页
    }
  },
  created() {
    this.getBlackList()
  },
  computed: {
    columns
  },
  methods: {
    getBlackList() {
      return this.blackService.getBlackList().subscribe()
    },
    onSearchKeyWords(val) {
      this.blackService.onSearchKeyWords(val).subscribe()
    },
    joinPerson(para) {
      let arr = this.blackList
      this.blackList = []
      this.blackKeys = Array.from(new Set(this.blackKeys))
      let searchRes = this.searchList.concat(arr)
      this.blackKeys.map(id => {
        searchRes.map(searchItem => {
          if (searchItem.user_id === id) {
            this.blackList.push(searchItem)
          }
        })
      })
    },
    deletePerson(para) {
      this.blackKeys = this.blackKeys.filter(id => {
        return id !== para.user_id
      })
      this.blackList = this.blackList.filter(({ user_id }) => {
        return user_id !== para.user_id
      })
    },
    onChange(pagination, filters, sorter) {
      this.page = pagination
      this.page.current_page = pagination.current
      this.page.size = pagination.pageSize
    },
    postBlackListSetting() {
      this.blackService
        .postBlackListSetting({ black_list: this.blackList })
        .subscribe(res => {
          this.show = false
          this.$emit('success')
        })
    }
  },
  watch: {
    // 去重
    blackList() {
      for (var i = 0; i < this.blackList.length; i++) {
        for (var j = i + 1; j < this.blackList.length; j++) {
          if (this.blackList[i].user_id === this.blackList[j].user_id) {
            this.blackList.splice(j, 1)
            j--
          }
        }
      }
    }
  }
}
</script>
