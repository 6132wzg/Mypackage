<template>
  <st-panel-layout :class="b('container')">
    <!-- 连续包月信息说明 -->
    <MarkteingPluginTitle pathName="brand-app-auto-renewal" />
    <!-- 连续包月表格 -->
    <st-panel app>
      <div :class="b('main')" v-if="info.is_open">
        <div :class="b('main-search-bar')">
          <div class="left">
            <st-button
              :class="b('main-search-bar-button')"
              type="primary"
              plain
              @click="handleAddProduct"
              v-if="auth['newAdd']"
            >
              <st-icon type="add" size="12px" color="#FFF"></st-icon>
              新增包月商品
            </st-button>
          </div>
          <div class="right">
            <a-select
              class="mg-r16"
              placeholder="请选择状态"
              style="width: 130px"
              v-model="$searchQuery.shelf_status"
              @change="onSingleSearch('shelf_status', $event)"
            >
              <a-select-option :value="-1">
                全部
              </a-select-option>
              <a-select-option
                v-for="item in shelvesStatus"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
            <st-input-search
              @search="onSingleSearch('card_name', $event)"
              placeholder="请输入商品名称查找"
              style="width: 290px;"
            />
          </div>
        </div>
        <div :class="b('main-table')">
          <st-table
            :loading="loading.getList"
            :columns="columns"
            :scroll="{ x: 1200 }"
            rowKey="id"
            :page="page"
            @change="onTableChange"
            :dataSource="list"
          >
            <template slot="card_type" slot-scope="text, record">
              {{ record.card_type | enumFilter('finance.product_type') }}
            </template>
            <template slot="shelf_status" slot-scope="text, record">
              <st-text
                :status="{
                  success: text === 1,
                  default: text === 2
                }"
              >
                {{ record.shelf_status_desc }}
              </st-text>
            </template>
            <template slot="remark" slot-scope="text, record">
              <st-overflow-text
                :value="record.remark"
                needMaxContainerWidth
                maxWidth="200px"
              ></st-overflow-text>
            </template>
            <div slot="action" slot-scope="text, record">
              <st-table-actions>
                <a
                  @click="onEdit(record)"
                  v-if="record.auth['brand:application:auto_renewal|edit']"
                >
                  编辑
                </a>
                <a
                  @click="onUp(record)"
                  v-if="record.auth['brand:application:auto_renewal|up']"
                >
                  上架
                </a>
                <a
                  @click="onDown(record)"
                  v-if="record.auth['brand:application:auto_renewal|down']"
                >
                  下架
                </a>
                <a
                  @click="onDel(record)"
                  v-if="record.auth['brand:application:auto_renewal|delete']"
                >
                  删除
                </a>
              </st-table-actions>
            </div>
          </st-table>
        </div>
      </div>
      <div :class="b('content')" v-else>
        <img
          :src="image"
          alt=""
          v-for="(image, index) in info.not_open_images"
          :key="index"
        />
      </div>
    </st-panel>
  </st-panel-layout>
</template>

<script>
import tableMixin from '@/mixins/table.mixin'
import { UserService } from '@/services/user.service'
import { AutoRenewalService } from './auto-renewal.service'
import { columns } from './auto-renewal.config'
import MarkteingPluginTitle from '../marketing/components#/marketing-title'
export default {
  name: '',

  bem: {
    b: 'brand-app-plugin'
  },

  components: { MarkteingPluginTitle },

  props: {},

  mixins: [tableMixin],

  serviceInject() {
    return {
      listService: AutoRenewalService,
      userService: UserService
    }
  },

  rxState() {
    return {
      auth: this.listService.auth$,
      loading: this.listService.loading$,
      page: this.listService.page$,
      list: this.listService.list$,
      info: this.listService.info$,
      shelvesStatus: this.userService.getOptions$('cloud_store.shelves_status')
    }
  },

  data() {
    return {}
  },

  computed: { columns },

  mounted() {},

  methods: {
    handleAddProduct() {
      this.$router.push({
        name: 'brand-app-auto-renewal-edit'
      })
    },
    onEdit(record) {
      console.log('record', record)
      this.$router.push({
        name: 'brand-app-auto-renewal-edit',
        query: {
          id: record.id
        }
      })
    },
    onUp(record) {
      this.listService.productPutaway(record.id).subscribe(res => {
        this.$message.success({ content: '商品上架成功' })
        if (this.list.length <= 1) {
          let pageCurrent = this.page.current_page
          pageCurrent = pageCurrent === 1 ? 1 : pageCurrent - 1
          this.$router.replace({
            query: {
              ...this.finalSearchQuery,
              current_page: pageCurrent
            }
          })
        } else {
          this.$router.reload()
        }
      })
    },
    onDown(record) {
      this.listService.productSoldOut(record.id).subscribe(res => {
        this.$message.success({ content: '商品下架成功' })
        if (this.list.length <= 1) {
          let pageCurrent = this.page.current_page
          pageCurrent = pageCurrent === 1 ? 1 : pageCurrent - 1
          this.$router.replace({
            query: {
              ...this.finalSearchQuery,
              current_page: pageCurrent
            }
          })
        } else {
          this.$router.reload()
        }
      })
    },
    onDel(record) {
      console.log('$searchQuery', this.$searchQuery)
      this.listService.productDel(record.id).subscribe(res => {
        this.$message.success({ content: '商品删除成功' })
        if (this.list.length <= 1) {
          let pageCurrent = this.page.current_page
          pageCurrent = pageCurrent === 1 ? 1 : pageCurrent - 1
          this.$router.replace({
            query: {
              ...this.finalSearchQuery,
              current_page: pageCurrent
            }
          })
        } else {
          this.$router.reload()
        }
      })
    }
  }
}
</script>
