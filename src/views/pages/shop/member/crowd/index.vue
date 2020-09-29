<template>
  <st-panel-layout class="shop-member-crowd-index">
    <index
      v-model="crowdIndexInfo.info.important_crowd"
      v-if="crowdIndexInfo.info.important_crowd.length > 0"
    ></index>
    <st-panel app>
      <div slot="title">
        <router-link
          :to="{ name: 'shop-member-crowd-add' }"
          v-if="crowdIndexInfo.info.list.length < 20"
        >
          <st-button type="primary" v-if="auth.add" icon="add">
            新增人群
          </st-button>
        </router-link>
        <st-button
          v-else
          type="primary"
          @click="newCrowd('人群数量已达到上限！')"
        >
          新增人群
        </st-button>
        <span class="shop-member-crowd-index-new__crowb_num">
          新增人群数量最多20个
        </span>
      </div>
      <st-table
        rowKey="id"
        :dataSource="crowdIndexInfo.info.list"
        :columns="columns"
        @change="onChange"
        :page="false"
      >
        <router-link
          class="mg-r8"
          :to="{
            name: 'shop-member-crowd-detail',
            query: { id: record.id }
          }"
          slot="crowd_name"
          slot-scope="crowd_name, record"
        >
          {{ crowd_name }}
        </router-link>
        <template slot="description" slot-scope="text, record">
          <st-overflow-text
            v-for="(item, index) in record.description"
            :key="index"
            max-width="300px"
            :value="item"
          ></st-overflow-text>
        </template>

        <span slot="refreshTitle">
          刷新状态
          <st-help-tooltip id="TSUL007" />
        </span>
        <template slot="refresh_task_status_code" slot-scope="text">
          <st-text
            :status="{
              success: text === refreshStatusMap.success,
              warning: text === refreshStatusMap.waitting,
              info: text === refreshStatusMap.freshing,
              error: text === refreshStatusMap.failed
            }"
          >
            {{ text | enumFilter('crowd.refresh_task_status') }}
          </st-text>
        </template>
        <div slot="actions" slot-scope="text, record">
          <st-table-actions>
            <a
              v-if="record.auth['shop:member:crowd|export']"
              v-export-excel="{ type: 'crowd/' + record.id, query: record }"
            >
              导出
            </a>
            <router-link
              v-if="record.auth['shop:member:crowd|edit']"
              :to="{
                name: 'shop-member-crowd-add',
                query: { id: record.id }
              }"
            >
              编辑
            </router-link>
            <st-popconfirm
              v-if="record.auth['shop:member:crowd|del']"
              @confirm="deleteTreeNode(record)"
            >
              <a>删除</a>
            </st-popconfirm>
            <a
              @click="onCrowdRefresh(record)"
              v-if="record.auth['shop:member:crowd|fresh']"
            >
              刷新
            </a>
          </st-table-actions>
        </div>
      </st-table>
    </st-panel>
  </st-panel-layout>
</template>
<script>
import index from './components#/index'
import { IndexService } from './index.service'
import { MessageService } from '@/services/message.service'
import tableMixin from '@/mixins/table.mixin'
import { columns } from './index.config'
export default {
  mixins: [tableMixin],
  serviceInject() {
    return {
      aService: IndexService,
      messageService: MessageService
    }
  },
  rxState() {
    return {
      crowdIndexInfo: this.aService.crowdIndexInfo$,
      auth: this.aService.auth$
    }
  },
  data() {
    return {
      refreshStatusMap: {
        success: 1, //已刷新
        waitting: 2, // 等待刷新
        freshing: 3, // 刷新中
        failed: 4 // 刷新失败
      }
    }
  },
  components: {
    index
  },
  computed: {
    columns
  },
  methods: {
    newCrowd(data) {
      this.messageService.warn({ content: data })
    },
    onChange(pagination, filters, sorter) {
      console.log('params', pagination, filters, sorter, data)
    },
    groupSMS(value) {
      console.log(value)
    },
    addTreeNode(value) {
      console.log(value)
    },
    refresh() {
      this.$router.push({ query: {} })
    },
    deleteTreeNode(value) {
      this.aService.delCrowdBrandCrowd(value.id).subscribe(res => {
        this.refresh()
      })
    },
    onCrowdRefresh(record) {
      this.aService.crowdShopRefresh(record.id).subscribe(res => {
        this.refresh()
      })
    }
  },
  mounted() {}
}
</script>
