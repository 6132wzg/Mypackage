import { State, Effect } from 'rx-state'
import { OssService } from './oss.service'
import { Injectable } from 'vue-service-app'
import { AppConfig } from '@/constants/config'
import { HttpService } from './http.service'
import { tap, switchMap, map, catchError } from 'rxjs/operators'
import { Observable, pipe, BehaviorSubject } from 'rxjs'
import { NotificationService } from './notification.service'

interface UploadImageParams {
  // base64图片地址
  qrcode_url: string
  // 商品logo
  brand_logo: string
  // 商品名称
  brand_name: string
  // 商品价钱
  price: number
}
interface UploadLotteryImageParams {
  // base64图片地址
  qrcode_url: string
  // 商品logo
  sub_name: string
}
/**
 * shs相关服务
 */
@Injectable()
export class ShsService {
  /**
   * 是否处于加载过程
   */
  token$ = new State('')
  loading$ = new State(true)
  constructor(
    private ossService: OssService,
    private http: HttpService,
    private appConfig: AppConfig,
    private notification: NotificationService
  ) {}

  /**
   * 处理图片
   */

  getShsImage(params: UploadImageParams, shsUrl = '/saas/poster') {
    return this.getToken().pipe(
      // switchMap(() => {
      //   return this.ossService.put({
      //     business: 'image',
      //     isPrivate: false,
      //     file: this.convertBase64UrlToBlob(params.qrcode_url)
      //   })
      // }),
      switchMap(() => {
        return this.http.originalPost(
          `${this.appConfig.SHS_API_ENV}${shsUrl}`,
          {
            ...params,
            token: this.token$.snapshot()
          }
        )
      }),
      switchMap((res: any) => {
        console.log(res)
        const imageUrl = `${this.appConfig.SHS_API_ENV}${res.response.data.url}`
        return this.loadImage(imageUrl)
      })
    )
  }
  loadImage(url: string) {
    this.loading$.commit(() => true)
    return new Observable(observer => {
      const _img = new Image()
      _img.src = url
      _img.onload = () => {
        observer.next(url)
        this.loading$.commit(() => false)
        observer.complete()
      }
      _img.onerror = e => {
        this.loading$.commit(() => false)
        observer.error(e)
        observer.complete()
      }
    })
  }
  /**
   * 将base64位生成blob
   * @param urlData
   */
  convertBase64UrlToBlob(urlData: string) {
    if (!urlData) {
      this.notification.error({
        title: '海报',
        content: 'is not qrcode url'
      })
    }
    const bytes = window.atob(urlData.split(',')[1])
    const ab = new ArrayBuffer(bytes.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i)
    }
    return new Blob([ab], { type: 'image/png' })
  }
  /**
   * 获取shs token
   */
  private getToken() {
    return this.http
      .originalPost(`${this.appConfig.SHS_API_ENV}/user/token`)
      .pipe(
        tap((res: any) => {
          this.token$.commit(() => res.response.data.token)
        })
      )
  }
}
