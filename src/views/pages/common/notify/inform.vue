<template>
  <div :class="b()">
    <st-search-panel @search="onSearch" @reset="onSearchReset">
      <st-search-panel-item label="通知类型：">
        <st-search-radio
          v-model="$searchQuery.notify_type"
          :options="noticeTypeLevel1Options"
        />
      </st-search-panel-item>
      <st-search-panel-item label="二级分类：">
        <st-search-radio
          v-model="$searchQuery.sub_notify_type"
          :options="noticeTypeLevel2Options"
        />
      </st-search-panel-item>
      <st-search-panel-item label="通知门店：">
        <shop-select
          class="mg-r8"
          style="width: 160px"
          :defaultValue="-1"
          v-model="$searchQuery.shop_id"
        ></shop-select>
      </st-search-panel-item>
    </st-search-panel>

    <st-table
      class="pd-24"
      @change="onTableChange"
      rowKey="id"
      :columns="columns"
      :dataSource="list$"
      :loading="loading$.getList"
      :page="page$"
    >
      <template slot="notify_type" slot-scope="text, record">
        {{ record.notify_type.name }}
      </template>
      <template slot="sub_notify_type" slot-scope="text, record">
        {{ record.sub_notify_type.name }}
      </template>
      <template slot="content" slot-scope="text, record">
        <st-overflow-text maxWidth="450px" :value="contentText(record)">
          <span v-html="text"></span>
          <div
            v-if="record.content_detail"
            class="page-inform-table-member"
            slot="content"
          >
            <div class="page-inform-table__member-img">
              <img :src="record.image_url" alt="会员图片" />
            </div>

            <div class="page-inform-table__member-info">
              <div class="content">
                <st-t3>
                  {{
                    `${record.content_detail.member_name}(${record.content_detail.level_name})`
                  }}
                </st-t3>

                <div class="pass">
                  <span>{{ record.content_detail.entrance_time }}</span>
                  使用
                  <span>{{ record.content_detail.proof_name }}</span>
                  通过
                  <span>{{ record.content_detail.hardware_name }}</span>
                  进入
                  <span>{{ record.content_detail.area_name }}</span>
                </div>
                <div class="tip">
                  <span>上次入场：</span>
                  <span>{{ record.content_detail.last_entrance_time }}</span>
                  <span>跟进会籍：</span>
                  <span>{{ record.content_detail.sale_name }}</span>
                  <span>跟进{{ $c('coach') }}：</span>
                  <span>{{ record.content_detail.coach_name }}</span>
                </div>
              </div>
              <div
                v-if="
                  record.content_detail.temperature_type_value !==
                    TEMPERATURE_TYPE.NOTHING
                "
                class="page-inform-table__member-temperature-tag"
              >
                <a-tag
                  :color="
                    record.content_detail.temperature_type_value ===
                    TEMPERATURE_TYPE.SAFETY
                      ? '#23D9AD'
                      : '#FF4B2B'
                  "
                >
                  {{ record.content_detail.temperature_type_text }}
                  {{ record.content_detail.temperature }}
                </a-tag>
              </div>
            </div>
          </div>
        </st-overflow-text>
      </template>
      <template slot="actions" slot-scope="text, record">
        <st-table-actions>
          <a @click="onClickDetail(record)">
            查看
          </a>
        </st-table-actions>
      </template>
    </st-table>
  </div>
</template>

<script>
import ShopSelect from '@/views/biz-components/shop/shop-select'
import { columns } from './inform.config'
import { InformService } from './inform.service'
import { TEMPERATURE_TYPE } from '@/constants/common/notify'
import tableMixin from '@/mixins/table.mixin'

export default {
  name: 'NotifyInform',
  mixins: [tableMixin],
  bem: {
    b: 'page-notify-inform'
  },
  serviceInject() {
    return {
      service: InformService
    }
  },
  watch: {
    // 当一级类型变化则二级分类重置
    '$searchQuery.notify_type'(oldValue, newValue) {
      if (oldValue !== newValue) {
        this.$searchQuery.sub_notify_type = -1
      }
    }
  },
  components: {
    ShopSelect
  },
  rxState() {
    const { list$, page$, loading$, informTypeOptions$ } = this.service
    return { list$, page$, loading$, informTypeOptions$ }
  },
  data() {
    return {
      date: null,
      TEMPERATURE_TYPE
    }
  },
  computed: {
    columns,
    routerNameSet() {
      return {
        'shop-reception-entrance': [1, 2],
        'shop-reception-reserve': [3, 4, 5],
        'shop-finance-order-list': [6, 7, 8, 9],
        'shop-member-list-studio': [10, 11, 12, 13, 14, 15, 16]
      }
    },
    noticeTypeLevel1Options() {
      return this.informTypeOptions$.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      })
    },
    noticeTypeLevel2Options() {
      let options = []
      for (let item of this.informTypeOptions$) {
        if (item.id === this.$searchQuery.notify_type) {
          options = [
            { label: '全部', value: -1 },
            ...item.children.map(item => {
              return {
                label: item.name,
                value: item.id
              }
            })
          ]
        }
      }
      return options
    }
  },
  methods: {
    contentText(record) {
      const notifyType = this.$searchQuery.notify_type
      return notifyType === 3
        ? `<div class="page-notify-inform__content"><img src='${record.image_url}'><span>${record.content}</span></div>`
        : record.content
    },
    onClickDetail(record) {
      console.log(record)
      for (let key in this.routerNameSet) {
        console.log(key)
        console.log(
          this.routerNameSet[key].includes(record.sub_notify_type.key)
        )
        console.log('this.routerNameSet[key]', this.routerNameSet[key])
        if (this.routerNameSet[key].includes(record.sub_notify_type.key)) {
          this.$router.push({ name: key })
        }
      }
    }
  }
}
</script>
