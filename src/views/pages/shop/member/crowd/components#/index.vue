<template>
  <div>
    <div class="shop-member-crowd-index-box">
      <div
        class="shop-member-crowd-index-box-title"
        v-for="(item, index) in importantCrowd"
        :key="index"
        :class="{ middle: index === 1 }"
      >
        <div class="shop-member-crowd-index-box__header">
          <div
            class="shop-member-crowd-index-box__fresh"
            @click="onCrowedRefresh(item.id)"
          >
            <st-icon
              type="refresh"
              color="#9BACB9"
              size="16px"
              v-if="item.auth && item.auth['shop:member:crowd|fresh']"
              title="刷新"
            ></st-icon>
          </div>
          <div class="shop-member-crowd-index-box__item">
            <img
              :src="imgArry[index]"
              class="shop-member-crowd-index-box__img"
            />
            <div class="shop-member-crowd-index-box__info">
              <st-t4 class="shop-member-crowd-index-box__info__title">
                {{ item.crowd_name }}
              </st-t4>
              <div>{{ item.description }}</div>
            </div>
          </div>
          <div class="shop-member-crowd-index-box__num">
            <div class="shop-member-crowd-index-box__num-item">
              <div class="shop-member-crowd-index-box__number">
                {{ item.crowd_total_num.value }}
              </div>
              <div class="shop-member-crowd-index-box__num-describe">
                {{ item.crowd_total_num.name }}
              </div>
            </div>
            <div class="shop-member-crowd-index-box__num-item-middel">
              <div class="shop-member-crowd-index-box__number">
                {{ item.yesterday_admission.value }}
              </div>
              <div class="shop-member-crowd-index-box__num-describe">
                {{ item.yesterday_admission.name }}
              </div>
            </div>
            <div class="shop-member-crowd-index-box__num-item">
              <div class="shop-member-crowd-index-box__number">
                {{ item.yesterday_deal_numb.value }}
              </div>
              <div class="shop-member-crowd-index-box__num-describe">
                {{ item.yesterday_deal_numb.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="shop-member-crowd-index-box__btn">
          <router-link
            class="shop-member-crowd-index-box__btn-rq shop-member-crowd-index-box__btn-rq-line"
            tag="span"
            :to="{
              name: 'shop-member-crowd-analysis',
              query: { urlid: index, id: item.id }
            }"
          >
            人群分析
          </router-link>
          <a-tooltip v-if="item.auth && item.auth['shop:member:crowd|export']">
            <span
              v-export-excel="{ type: 'crowd/' + item.id }"
              class="shop-member-crowd-index-box__btn-rq"
            >
              导出
            </span>
          </a-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageService } from '@/services/message.service'
import { IndexService } from './index.service'
import { CrowdAPI } from '@/api/v1/crowd'
export default {
  serviceInject() {
    return {
      messageService: MessageService,
      crowdAPI: CrowdAPI,
      aService: IndexService
    }
  },
  rxState() {
    return {
      auth: this.aService.auth$
    }
  },
  model: {
    type: 'value',
    event: 'dataChangge'
  },
  props: {
    value: Array
  },
  data() {
    return {
      imgArry: [
        require('@/assets/img/shop_crowd_new.png'),
        require('@/assets/img/shop_crowd_expire.png'),
        require('@/assets/img/shop_crowd_private_teaching.png')
      ]
    }
  },
  created() {
    console.log(this.value)
  },
  computed: {
    importantCrowd() {
      return this.value.slice(0, 3)
    }
  },
  methods: {
    newCrowd(data) {
      this.messageService.warn({ content: data })
    },
    exportFunc(id) {
      // this.aService.getListInfo(id).subscribe()
    },
    onCrowedRefresh(id) {
      this.aService.crowdShopRefresh(id).subscribe(res => {
        this.$router.reload()
      })
    }
  },
  mounted() {}
}
</script>
