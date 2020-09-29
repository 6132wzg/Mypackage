<template>
  <!-- 原有小程序大转盘预览布局，暂时保留 -->
  <div>
    <div :class="bPage('lottery')">
      <div :class="bPage('swiper')" v-if="isStopSwiper === STOP_SWIPER.DEFAULT">
        <swiper :options="sliderOptions">
          <swiper-slide v-for="(item, index) in prizeInfoList" :key="index">
            <span :class="bPage('swiper-text')">{{ item }}</span>
          </swiper-slide>
        </swiper>
      </div>
      <img
        :class="bPage('lottery-banner')"
        src="~@/assets/img/brand/marketing/lottery/bg.png"
      />
      <img
        :class="bPage('lottery-title-bg')"
        src="~@/assets/img/brand/marketing/lottery/title_bg.png"
      />
      <span :class="bPage('lottery-subtitle')">{{ preview.title }}</span>
      <div :class="bPage('lottery-turntable')">
        <div style="position:relative" v-if="prizeList.length > 0">
          <div
            class="img-wrap"
            :class="'run-item-' + index"
            v-for="(item, index) in prizeListFilters"
            :key="index"
          >
            <img class="img" :src="item.prize.image_url" alt="奖品图片" />
            <div class="text">{{ item.prize_name }}</div>
          </div>
        </div>
        <div v-if="notPrize.prize_name" class="img-wrap run-item-7">
          <div class="img">
            <img
              style="width: 100%;height:100%"
              :src="
                notPrizeImgType === NOT_PRIZE_IMG_TYPE.CUSTOM
                  ? notPrize.prize.image_url
                  : lucky[0].image_url
              "
              alt="奖品图片"
            />
          </div>
          <div class="text">{{ notPrize.prize_name }}</div>
        </div>
      </div>
      <div :class="bPage('lottery-footer')">
        <div :class="bPage('lottery-title')">活动规则</div>
        <div class="mg-b24">
          <span class="mg-r8">活动时间:</span>
          <span>{{ preview.startTime }}--{{ preview.endTime }}</span>
        </div>
        <div class="mg-b24">
          <span class="mg-r8">抽奖规则:</span>
          <span v-if="timesType === 1">
            每人每天有{{ preview.perTimes }}次机会
          </span>
          <span v-else>每人总共有{{ preview.totalTimes }}次机会</span>
        </div>
        <div class="mg-b24">
          <span class="mg-r8">活动说明:</span>
          <span>{{ preview.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
