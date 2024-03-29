<template>
  <st-panel-layout class="page-personal-course-info">
    <st-panel class=" mg-b16">
      <div class="page-personal-header">
        <div class="page-personal-header__left mg-r24">
          <st-t3 class="mg-b16">
            {{ personalCourseInfo.course_name }}（{{
              personalCourseInfo.category_id.name || '暂无'
            }}）
          </st-t3>
          <div class="course-detail-item mg-b16">
            <div class="course-detail-item__left">
              <span class="label">
                <st-icon
                  type="time"
                  color="rgb(0,199,219)"
                  class="mg-r8"
                  size="16px"
                ></st-icon>
                时长:
              </span>
              <span class="value">{{ personalCourseInfo.duration }}分钟</span>
            </div>
            <div class="course-detail-item__right"></div>
          </div>
          <div class="course-detail-item__content mg-b16">
            {{ personalCourseInfo.description }}
          </div>
          <div class="course-detail-item__tip mg-b24">
            #
            <span
              v-for="(item, index) in personalCourseInfo.train_aim"
              :key="item.id"
            >
              {{ item.name }}
              <i v-if="index === personalCourseInfo.train_aim.length - 1"></i>
              /
            </span>
          </div>
        </div>
        <div class="page-personal-header__right">
          <img
            :src="image | imgFilter({ w: 197, h: 136, type: 'course' })"
            alt="课程详情图片"
          />
        </div>
      </div>
    </st-panel>
    <st-panel app>
      <div class="page-personal-content">
        <div class="page-personal-content__item mg-b24">
          <div class="title mg-b8">
            <span class="label">上课门店:</span>
            <span class="value">
              共{{ personalCourseInfo.shops.length }}家门店
            </span>
          </div>
          <st-container>
            <st-table
              rowKey="shop_id"
              :columns="shopColumns"
              :dataSource="personalCourseInfo.shops"
              page-mode="client"
            ></st-table>
          </st-container>
        </div>
        <div class="page-personal-content__item mg-b24">
          <div class="title mg-b8">
            <span class="label">上课{{ $c('coach') }}:</span>
            <span class="value">
              共{{ personalCourseInfo.coaches.length }}名{{ $c('coach') }}
            </span>
          </div>
          <st-container>
            <st-table
              rowKey="id"
              :columns="coachColumns"
              page-mode="client"
              :dataSource="personalCourseInfo.coaches"
            >
              <div slot="nature_work" slot-scope="nature_work">
                {{ nature_work | enumFilter('staff.nature_work') }}
              </div>
            </st-table>
          </st-container>
        </div>
        <div class="page-personal-content__item">
          <div class="title mg-b8">
            <span class="label">售价设置:</span>
            <span class="value">
              {{
                personalCourseInfo.price_model
                  | enumFilter('personal_course.price_model')
              }}
            </span>
          </div>
          <st-container>
            <st-table
              rowKey="id"
              :columns="priceConfigColumns"
              :dataSource="prices"
              page-mode="client"
            >
              <div slot="min_sell_price" slot-scope="min_sell_price, record">
                <span v-if="saleModel">
                  {{ record.min_sell_price }} ~ {{ record.max_sell_price }}
                </span>
                <span v-else>
                  {{ record.sell_price }}
                </span>
              </div>
              <div slot="min_sell" slot-scope="min_sell, record">
                {{ record.min_sale }} ~ {{ record.max_sale }}
              </div>
              <div slot="transfer_num" slot-scope="transfer_num, record">
                {{ record.transfer_num }}
                {{
                  record.transfer_unit === TRANSFER_UNIT.PERCENT ? '%' : '元'
                }}
              </div>
            </st-table>
          </st-container>
          <div class="title mg-t16">
            <span class="label">售卖方式:</span>
            <span
              class="value"
              v-for="(item, index) in personalCourseInfo.sell_type"
              :key="index"
            >
              {{ item | enumFilter('personal_course.sell_type') }}
              <i v-if="index !== personalCourseInfo.sell_type.length - 1">、</i>
            </span>
          </div>
          <div class="title mg-t8">
            <span class="label">单节有效期:</span>
            <span class="value">{{ personalCourseInfo.effective_unit }}</span>
          </div>
          <div class="title mg-t8">
            <span class="label">定价权限:</span>
            <span class="value">
              {{
                personalCourseInfo.price_setting
                  | enumFilter('personal_course.price_setting')
              }}
            </span>
          </div>
          <div class="title mg-t8">
            <span class="label">单节售卖:</span>
            <span class="value">{{ personalCourseInfo.single_price }}</span>
          </div>
        </div>
      </div>
    </st-panel>
  </st-panel-layout>
</template>
<script>
import {
  shopColumns,
  coachColumns,
  priceConfigColumns
} from './info#table.config'
import { InfoService } from './info.service'
import { AppConfig } from '@/constants/config'
import { TRANSFER_UNIT } from '@/constants/course/personal'
export default {
  name: 'PersonalInfo',
  serviceInject() {
    return {
      config: AppConfig,
      infoService: InfoService
    }
  },
  rxState() {
    return {
      personalCourseInfo: this.infoService.personalCourseInfo$
    }
  },
  computed: {
    coachColumns,
    prices() {
      const arr = []
      this.personalCourseInfo.price_gradient.forEach(item => {
        item.prices.forEach(ele => {
          arr.push(ele)
        })
      })
      return arr
    },
    image() {
      return this.personalCourseInfo.image.image_key
    },
    saleModel() {
      return this.personalCourseInfo.sale_model === 1 // 教练谈单
    }
  },
  data() {
    return {
      shopColumns,
      priceConfigColumns,
      TRANSFER_UNIT
    }
  }
}
</script>
