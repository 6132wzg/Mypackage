<template>
  <st-modal title="推广码" v-model="show" width="400px" :footer="null">
    <div :class="basic()">
      <st-image :src="posterUrl" :class="basic('qrcode')"></st-image>
      <div :class="basic('btn-group')">
        <st-button
          :class="basic('button')"
          @click="downloadFile(url, 'qrcode.png')"
        >
          下载小程序码
        </st-button>
        <st-button
          type="primary"
          :class="basic('button')"
          @click="downloadFile(posterUrl, 'qrcode.png')"
        >
          下载推广海报
        </st-button>
      </div>
    </div>
  </st-modal>
</template>
<script>
import { ShsService } from '@/services/shs.service'

export default {
  name: 'BrandMarketingDownloadQrcode',
  bem: {
    basic: 'brand-marketing-download-qrcode'
  },
  serviceInject() {
    return {
      shsService: ShsService
    }
  },
  props: {
    url: String,
    name: String,
    title: String,
    subTitle: String
  },
  data() {
    return {
      posterUrl: '',
      show: false
    }
  },
  created() {
    let shsData = {
      title: this.title,
      sub_title: this.subTitle,
      name: this.name,
      qrcode_url: this.url
    }
    this.shsService
      .getShsImage(shsData, '/saas/activity_qrcode')
      .subscribe(res => {
        this.posterUrl = res
      })
  },
  methods: {
    downloadFile(url, filename = '') {
      fetch(url, {
        headers: new Headers({
          Origin: location.origin
        }),
        mode: 'cors'
      })
        .then(res => res.blob())
        .then(blob => {
          const blobUrl = window.URL.createObjectURL(blob)
          this.download(blobUrl, filename)
          window.URL.revokeObjectURL(blobUrl)
        })
    },
    download(blobUrl, filename) {
      const a = document.createElement('a')
      a.href = blobUrl
      a.target = '_blank'
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
    }
  }
}
</script>
