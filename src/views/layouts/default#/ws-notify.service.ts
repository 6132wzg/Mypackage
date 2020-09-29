import { TokenService } from '@/services/token.service'
import { UserService } from '@/services/user.service'
import { AppConfig } from '@/constants/config'
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import { State, Effect } from 'rx-state/src'
import { NotificationService } from '@/services/notification.service'
import { Injectable } from 'vue-service-app'
import { NotifyApi } from '@/api/v1/notify'
import { CabinetCallConfirmApi } from '@/api/v1/setting/cabinet/call-confirm'
import { MessageService } from '@/services/message.service'
import { tap } from 'rxjs/operators'
import { anyAll } from '@/operators'
import { TEMPERATURE_TYPE } from '@/constants/common/notify'
const uuidV1 = require('uuid/v1')
@Injectable()
export class WsNotifyService {
  private ws: any
  private token = this.tokenService.token$.value
  private count = 0
  private errCount = 0
  private timer = 0
  private key = 0
  private timerSetTimeout = 0
  private heartBeat = {
    msg_id: uuidV1(),
    msg_type: 2,
    payload: { count: this.count }
  }
  // 设置心跳时间
  private pingTimeout = 15000
  open$ = new State({})
  count$ = new State(0)
  systemList$ = new State({})
  activityList$ = new State({})
  notReadNum$ = new State(0)
  loading$ = new State({})
  messageArr: any[] = []
  message$ = new State({})
  constructor(
    private api: NotifyApi,
    private cabinetCallConfirmApi: CabinetCallConfirmApi,
    private msg: MessageService,
    private notificationService: NotificationService,
    private userService: UserService,
    private tokenService: TokenService,
    private appConfig: AppConfig
  ) {
    //
  }
  user$ = this.userService.user$

  private getWebsocketInstance(query: any) {
    return (this.ws = webSocket({
      url: `${this.appConfig.WEB_SOCKET_DOMAIN}?app-id=${query.appId}&token=${query.token}`,
      openObserver: this.open$
    }))
  }
  setHeartBeat() {
    this.send(this.heartBeat)
    this.timer = setInterval(() => {
      this.heartBeat.payload.count = this.count
      this.heartBeat.msg_id = uuidV1()
      this.send(this.heartBeat)
    }, this.pingTimeout)
  }

  getSystemList() {
    return this.api.getNewAnnouncementSystem().pipe(
      tap((res: any) => {
        this.systemList$.commit(() => res.list)
      })
    )
  }
  getActivityList() {
    return this.api.getNewAnnouncementActivity().pipe(
      tap((res: any) => {
        this.activityList$.commit(() => res.list)
      })
    )
  }
  @Effect()
  getCabinetConfirm(msg_id: any, device_id: any) {
    return this.cabinetCallConfirmApi.confirm(msg_id, {
      device_id
    })
  }
  setRead() {
    return this.api.setRead()
  }
  init() {
    return anyAll(this.getActivityList(), this.getSystemList())
  }
  public initWs() {
    this.getWebsocketInstance({ token: this.token, appId: 10000 })
    this.message()
    this.setHeartBeat()
  }
  private getMaMessage(msg: any, maxLength: number) {
    const args = msg.payload.args
    const content = msg.payload.content
    // 人体测温警告
    const temperature =
      args.temperature_type_value === TEMPERATURE_TYPE.DANGER
        ? 'temperature-danger'
        : 'temperature-safety'
    const danger =
      args.temperature_type_value === TEMPERATURE_TYPE.DANGER
        ? 'danger'
        : 'safety'
    const title =
      msg.payload.msg_sub_type !== 8 ? msg.payload.title : args.member_name
    const config = {
      customClass: temperature,
      title,
      content: (h: any) => {
        return msg.payload.msg_sub_type !== 8
          ? h('div', { attrs: { class: 'st-ws-notice-description' } }, [
              h(
                'div',
                {
                  attrs: { class: 'st-ws-notice-description__content' }
                },
                content
              )
            ])
          : h('div', { attrs: { class: `st-ws-notice-description` } }, [
              h(
                'div',
                {
                  attrs: { class: 'st-ws-notice-description__content' }
                },
                `成功进入(${args.area_name})`
              ),
              h(
                'div',
                {
                  attrs: { class: 'st-ws-notice-description__cunsume  mg-t8' }
                },
                [
                  h('div', { attrs: { class: 'label' } }, '消费方式: '),
                  h('div', { attrs: { class: 'value' } }, args.proof_name)
                ]
              ),
              h(
                'div',
                {
                  attrs: { class: 'st-ws-notice-description__detail mg-t8' }
                },
                [
                  h(
                    'div',
                    {
                      attrs: {
                        class: 'st-ws-notice-description__member mg-r8'
                      }
                    },
                    [
                      h('div', { attrs: { class: 'label' } }, '跟进会籍: '),
                      h('div', { attrs: { class: 'value' } }, args.seller_name)
                    ]
                  ),
                  h(
                    'div',
                    {
                      attrs: { class: 'st-ws-notice-description__coach' }
                    },
                    [
                      h('div', { attrs: { class: 'label' } }, '跟进教练: '),
                      h('div', { attrs: { class: 'value' } }, args.coach_name)
                    ]
                  ),
                  args.temperature_type_value === 0
                    ? h('div')
                    : h(
                        'div',
                        {
                          attrs: {
                            class: `st-ws-notice-description__temperature ${danger}`
                          }
                        },
                        [
                          h(
                            'span',
                            { attrs: { class: 'temperature-text' } },
                            `${args.temperature_type_text}`
                          ),
                          h(
                            'span',
                            { attrs: { class: 'temperature-value' } },
                            `${args.temperature}`
                          )
                        ]
                      )
                ]
              )
            ])
      },
      icon: (h: any) => {
        return msg.payload.msg_sub_type !== 8
          ? h('st-icon', {
              attrs: {
                type: 'success',
                width: '22',
                color: '#52C41A',
                height: '100%'
              }
            })
          : h('img', {
              attrs: {
                src: args.image_url,
                width: '96',
                height: '100%'
              }
            })
      },
      duration: 5,
      onClose: () => {
        const oldMessage = this.messageArr.shift()
        this.notificationService.close(oldMessage.key)
      },
      key: uuidV1()
    }
    this.closeMessageIsOverLimit(maxLength)
    msg.payload.msg_sub_type === 8
      ? this.notificationService.open(config)
      : this.notificationService.openNormal(config)
    this.messageArr.push(config)
  }
  private getCabinetNotificationConfig(msg: any) {
    const args = msg.payload.args
    const title = msg.payload.title
    const content = msg.payload.content
    const key = uuidV1()
    const config = {
      customClass: 'st-notification-cabinet-call',
      title,
      content: (h: any) => {
        return h('div', { attrs: { class: 'st-ws-notice-description' } }, [
          h('div', {
            attrs: { class: 'st-ws-notice-description__content' },
            domProps: {
              innerHTML: content
            }
          })
        ])
      },
      btn: h => {
        let loading: any = this.loading$.snapshot()
        return h(
          'a-button',
          {
            props: {
              type: 'primary',
              loading: loading.getCabinetConfirm
            },
            on: {
              click: () => {
                // 请求接口
                this.getCabinetConfirm(
                  msg.payload.msgId,
                  args.device_id
                ).subscribe(res => {
                  const oldMessage = this.messageArr.filter(
                    message => message.key === key
                  )[0]
                  this.messageArr = this.messageArr.filter(
                    message => message.key !== key
                  )
                  this.notificationService.close(oldMessage.key)
                })
              }
            }
          },
          '收到'
        )
      },
      icon: (h: any) => {
        return h('st-icon', {
          attrs: {
            type: 'warning',
            color: '#FF5E41',
            width: '22',
            height: '100%'
          }
        })
      },
      duration: 30,
      key
    }
    return config
  }
  private closeMessageIsOverLimit(maxLength: number) {
    if (this.messageArr.length >= maxLength) {
      const oldMessage = this.messageArr.shift()
      this.notificationService.close(oldMessage.key)
    }
  }
  message() {
    this.ws.subscribe(
      (msg: any) => {
        this.count++
        this.count$.commit(() => this.count)
        this.message$.commit(() => msg)
        if (msg.msg_type === 2) {
          this.errCount = 0
          return
        }
        const maxLength = 3
        if (msg.msg_type === 1) {
          this.notReadNum$.commit(() => msg.payload.not_read_num)
        } else if (msg.msg_type === 3) {
          this.notReadNum$.commit(() => msg.payload.total)
          return
        } else if (msg.msg_type === 5) {
          // 月月付
          return false
        } else if (msg.msg_type === 6) {
          console.log('msg', msg)
          // 获取提示的config
          let config = this.getCabinetNotificationConfig(msg)
          // 是否超出消息展示上限
          this.closeMessageIsOverLimit(maxLength)
          // 开启消息通知
          this.notificationService.openNormal(config)
          // 将消息的配置信息放入消息队列中
          this.messageArr.push(config)
          return
        }
        this.getMaMessage(msg, maxLength)
      },
      (err: any) => {
        this.reconnection(err)
      },
      () => {
        clearInterval(this.timer)
      }
    )
  }
  reconnection(err: any) {
    clearTimeout(this.timerSetTimeout)
    this.errCount++
    let rangeTime = 5000
    this.timerSetTimeout = setTimeout(() => {
      console.log(
        `重连第${this.errCount}次, 重连时间${rangeTime / 1000}s, 正在重连...`,
        '只重连三次'
      )
      this.errCount === 3 ? clearTimeout(this.timerSetTimeout) : this.initWs()
    }, rangeTime)
    this.errCount === 3 && console.log('websocket关闭连接')
  }
  creatMsgId() {
    return uuidV1()
  }
  send(content?: any) {
    this.ws.next(content || this.count)
  }
  complete() {
    this.ws.complete((res: any) => {
      console.log('complete', res)
    })
  }
  error() {
    this.ws.error({ code: 4000, reason: 'I think our app just broke!' })
  }
}
