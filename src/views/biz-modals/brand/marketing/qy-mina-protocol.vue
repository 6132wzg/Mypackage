<template>
  <st-modal title="商户服务协议" v-model="show" @cancel="cancel" width="660px">
    <div :class="b()">
      <p>特别声明：</p>
      <p>
        在签署本协议前，您确认已经仔细阅读并完全同意《轻嘤平台用户服务条款》之全部内容。同时，作为商户，您承诺仔细阅读并全面遵守本协议之全部内容（特别是以粗体和/或下划线等突出显示方式展示的内容）。如果您对本协议的条款有疑问的，请通过轻嘤平台客服渠道进行询问，轻嘤平台网将向您解释条款内容。如果您不同意本协议的任意内容，或者无法准确理解轻嘤平台网对条款的解释，请不要同意本协议或使用本协议项下的服务，否则，表示您已接受了以下所述的条款和条件，同意受本协议约束。届时您不应以未阅读本协议的内容或者未获得轻嘤平台网对您问询的解答等理由，主张本协议无效，或要求撤销本协议。
      </p>
      <p>
        考虑到互联网信息服务性质和内容的不断发展和演进，您同意轻嘤平台网有权对本协议
        条款进行修改，并将修改后的协议以在线公布、通过您注册时提供的通讯工具发送或者其他任何合理方式通知您。您同意承担及时查阅最新协议的义务。在该等修改发生后，若您不同意该最新协议，您应放弃注册、停止使用或主动取消本公司提供的服务。您继续使用本公司提供的服务的行为将被视为对该最新协议的全部内容予以接受和同意。如轻嘤平台网需要商家与轻嘤平台网另行签署协议的，则商家还应遵守另行签署的协议，若本协议与商家另行签署协议不一致的，以双方另行签署的协议为准。
      </p>
      <p>第一条 签约背景</p>
      <p>
        为更好的为轻嘤平台网商户提供服务,同时为更好的规范商户认领现有商户信息（包括新发布商户信息）、发布与商户相关的内容信息、推广信息行为，以及更好的使用轻嘤平台网提供的基于商户中心的其他增值服务，特签署本协议。
      </p>
      <p>第二条 签约主体</p>
      <p>
        本协议由“轻嘤平台网”与通过认领现有商户信息、新发布商户信息或者其他方式获得
        轻嘤平台网授权使用轻嘤平台网商户中心服务功能的商家签署。
      </p>
      <p>第三条 协议订立、生效及其适用范围</p>
      <p>
        3.1.
        您通过网络页面点击确认本协议或以勾选等其他方式选择接受本协议，包括但不限于未确认本协议而使用了轻嘤平台网商户中心服务功能，均表示您与轻嘤平台网已就本协议达成一致并同意接受本协议的全部约定内容。
      </p>
      <p>3.2.本协议自您确认或使用本协议之时即生效。</p>
      <p>
        3.3.您了解并同意，根据您实施的不同行为，您将受到本协议不同条款的约束。
      </p>
      <p>第四条 定义</p>
      <p>4.1.轻嘤平台网:网址为 chi.styd.cn 的网站。</p>
      <p>
        4.2.商户信息：由轻嘤平台网用户、商户发布的商户基本信息，包括但不限于商户名称、地址、联系方式等，简称
        POI。
      </p>
      <p>
        4.3.商户认领：指商户主张现有 POI
        对应的实体商户为其所经营管理，或将其经营管理的实体商户在轻嘤平台网发布新的
        POI，从而取得该 POI 一定的管理权限并使用该 POI 商户中心服务功能的行为。
      </p>
      <p>
        4.4.商户：通过商户认领功能取得该 POI 一定的管理权限并使用该 POI
        商户中心服务功能的实体商户的经营管理者。
      </p>
      <p>4.5.商户中心：轻嘤平台网提供给商户的用于管理其 POI 的软件台。</p>
      <p>第五条 商户服务的内容及功能</p>
      <p>
        轻嘤平台网通过商户中心后台管理系统为商户提供基础服务（包括商户信息编辑、维护等），现有以及后续可能提供的增值服务、推广技术服务（包括但不限于预约预定服务、电子优惠券推广技术服务、电子会员卡推广技术服务、团购服务等）。商户接受除商户中心基础服务之外的增值服务、推广技术服务时，应当与轻嘤平台网（或具体服务提供商）以书面或在线签署的方式另行签订服务协议以明确双方的具体权利义务。
      </p>
      <p>第六条 商户陈述与保证</p>
      <p>6.1.商户承诺其是其认领 POI 对应的实体商户的真实经营管理者；</p>
      <p>6.2.商户承诺其是其发布新的 POI 对应的实体商户的真实经营管理者；</p>
      <p>
        6.3.商户承诺其在商户认领环节向轻嘤平台网提交的证明材料合法、真实、准确详尽。否则商
        户承诺独立承担因此导致的相应责任及后果，使轻嘤平台网免责；
      </p>
      <p>
        6.4.商户承诺其通过商户中心发布、编辑、更新的商户信息（包括但不限于文字、图片等）真
        实准确，并且不侵犯任何人的合法权益；
      </p>
      <p>
        6.5.商户承诺在其接受除商户中心基础服务之外的增值服务、推广技术服务时，严格遵守相关
        服务协议的相关约定；
      </p>
      <p>
        6.6.商户同意在使用轻嘤平台网商户服务的同时接受轻嘤平台网向其登记的电子邮件手
        机、通信地址发送商业信息。
      </p>
      <p>
        6.7.商户确认已经仔细阅读、充分理解并自愿遵守网络购买商品七日无理由退货暂行办法之全
        部规定。所有商户均认可并授权轻嘤平台网按照《轻嘤商城用户争议处理规范》之规定进行相关争议调解和解决。
      </p>
      <p>
        6.8.若商户对轻嘤平台网实施侵权行为或者商户违反与轻嘤平台网的约定导致轻嘤平
        台网受损，且该商户有任何存储于轻嘤平台的付款、预付款、应收款等资产或者利益，则该商户同意并授权轻嘤平台从该资产或者利益中优先扣除该商户之侵权或者违约行为应支付给轻嘤平台的赔偿金，以履行其赔偿义务。
      </p>
      <p>
        6.9.商户知悉并同意：商家因其经营需要、履行本协议义务而向轻嘤平台网提交的任何
        信息和数据，以及商家在经营过程中产生的交易数据、用户点击、店铺及商品评价数据，轻嘤平台网有权在本协议终止后继续保留，同时，无论本协议终止前还是终止之后，轻嘤平台网均有权合理使用，使用方式包括但不限于依据数据进行市场分析和调研，或就分析、调研结果以产品形式售卖或免费提供给第三方；商家进一步知悉并同意：该等数据，无论本协议终止前还是终止之后，轻嘤平台网均无义务返还商家、也无义务删除原始数据及其备份、同时无义务就使用该数据的行为向商家支付任何费用。
      </p>
      <p>第七条 轻嘤平台网的权利及责任限制</p>
      <p>
        7.1.轻嘤平台网致力于不断提高商户服务的产品与技术质量、优质的用户体验以及系统的安
        全稳定；
      </p>
      <p>
        7.2.轻嘤平台作为商户服务的技术服务提供商将按“现状”和按“可得到”的状态提供服务。
        轻嘤平台网在此明确声明对商户服务不作任何明示或暗示的保证，包括但不限于对该服务的可适用性、没有错误或疏漏、持续性、准确性、可靠性、适用于某一特定用途之类的保证、声明或承诺。
      </p>
      <p>
        7.3.在所适用的法律允许的范围内，轻嘤平台网不做任何明示的或默示的声明，也不给予任
        何明示的或默示的保证或条件，包括但不限于：
      </p>
      <p>
        (1) 关于适用性、特定用途适用性、准确性和无侵权行为的任何保证或条件；
      </p>
      <p>(2) 在服务使用过程或行业惯例中产生的任何保证或条件；</p>
      <p>(3) 在访问或使用商户服务时不受干扰、没有错误的任何保证或条件；</p>
      <p>
        (4) 在任何书面或者口头的帮助、答疑过程中所作出的陈述、指导或者展示。
      </p>
      <p>
        7.4.在法律允许的最大免责范围内，在任何情况下轻嘤平台网均不对源于、基于或因本
        协议或使用商户服务而导致的数据丢失和/或任何损害赔偿负责，包括但不限于直接的、间
        接的、特殊的、附带性的或惩罚性的损害赔偿或其他任何形式的损害赔偿，即使轻嘤平台网已被告知此等损害赔偿的可能性。
      </p>
      <p>
        7.5.轻嘤平台网对商户的任何通知，不论是口头还是书面的，均不表示轻嘤平台网承担在本协议陈述以外的任何担保责任。
      </p>
      <p>7.6.对下列情形，轻嘤平台网在法律允许的最大免责范围内予以免责：</p>
      <p>(1) 并非轻嘤平台网的故意或过失而导致服务或者软件、信息无法使用。</p>
      <p>(2) 由于商户或第三人的故意或过失导致其及/或任何第三方遭受损失。</p>
      <p>
        (3)
        因轻嘤平台网合理控制范围以外的原因，包括但不限于不可抗力、政府行为和电力电信中断等，导致轻嘤平台网未能履行或未能完全履行本合同的。
      </p>
      <p>
        7.7.在法律允许的最大免责范围内，轻嘤平台网保留随时修改或中断服务而不需通知商
        户的权利，不需对商户或任何无直接关系的第三方负责。除非法律另有规定或者双方另有特别约定。
      </p>
      <p>
        7.8.如商户违反本协议第八条约定的承诺及保证，轻嘤平台网有权采取一切必要的措施，
        包括但不限于：删除商户发布的内容、取消商户在网站获得的星级、荣誉以及虚拟财富，
        暂停或查封商户帐号，取消因违规所获利益，终止本服务协议，乃至通过诉讼形式追究商户法律责任等。
      </p>
      <p>第八条 知识产权及其它权利</p>
      <p>
        8.1.您确认，您已经明确阅读，充分理解并自愿遵守本网站的《知识产权声明》。
      </p>
      <p>
        8.2.任何商户接受本协议，即表明该商户主动将其在任何时间段在本站发表的任何形式的信息的著作财产权，包括并不限于：复制权、发行权、出租权、展览权、表演权、放映权、广播权、信息网络传播权、摄制权、改编权、翻译权、汇编权等，以及应当由著作权人享有的其他可转让权利无偿独家转让给轻嘤平台网运营商所有，同时表明该商户许可轻嘤平台网有权利就任何主体侵权而单独提起诉讼，并获得全部赔偿。本协议已经构成《著作权法》或者相关法律法规所规定的书面协议，其效力及于商户在轻嘤平台网发布的任何受著作权法保护的作品内容，无论该内容形成于本协议签订前还是本协议签订后。
      </p>
      <p>
        8.3.轻嘤平台网拥有此网站内容及资源的版权,受国家知识产权保护,享有对本网站各种协议、声明的修改权；未经轻嘤平台网的明确书面许可，任何第三方不得为任何非私人或商业目的获取或使用本网站的任何部分或通过本网站可直接或间接获得的任何内容、服务或资料。任何第三方违反本协议的规定以任何方式，和/或以任何文字对本网站的任何部分进行发表、复制、转载、更改、引用、链接、下载或以其他方式进行使用，或向任何其他第三方提供获取本网站任何内容的渠道，则对本网站的使用权将立即终止，且任何第三方必须按照轻嘤平台网的要求，归还或销毁使用本网站任何部分的内容所创建的资料的任何副本。
      </p>
      <p>
        8.4.轻嘤平台网未向任何第三方转让本网站或其中的任何内容所相关的任何权益或所有权，且一切未明确向任何第三方授予的权利均归轻嘤平台网所有。未经本协议明确允许而擅自使用本网站任何内容、服务或资料的，构成对本协议的违约行为，且可能触犯著作权、商标、专利和/或其他方面的法律法规，轻嘤平台网保留对任何违反本协议规定的第三方（包括单位或个人等）提起法律诉讼的权利。
      </p>
      <p>第九条 适用法律与争议解决</p>
      <p>
        9.1.因商户使用轻嘤平台网站商户服务而引起或与之相关的一切争议均应依照中华人民共和国大陆地区法律（不包括冲突法）予以处理，并以上海市徐汇区人民法院为第一审管辖法院。
      </p>
      <p>
        9.2.如本协议的任何条款被视作无效或无法执行，则上述条款可被分离，其余部份则仍具有法律效力。
      </p>
      <p>
        9.3.轻嘤平台网于商户过失或违约时未行使本协议规定的权利的，不得视为其对商户
        的其他或以后同类之过失或违约行为弃权。
      </p>
    </div>
    <template slot="footer">
      <st-button @click="cancel">不同意</st-button>
      <st-button @click="agree" :loading="loading.agree" type="primary">
        同意
      </st-button>
    </template>
  </st-modal>
</template>
<script>
import { MinaProtocolService } from './qy-mina-protocol.service'
export default {
  name: 'BrandMarketingQyMina',
  bem: {
    b: 'brand-marketing-qy-mina-protocol'
  },
  serviceInject() {
    return {
      minaService: MinaProtocolService
    }
  },
  rxState() {
    return {
      loading: this.minaService.loading$
    }
  },
  props: {
    title: {
      type: String,
      default: () => ''
    },
    shop_id: {
      type: [Number, String],
      default: () => ''
    }
  },
  methods: {
    cancel() {
      this.show = false
      this.$router.push({
        path: '/brand/marketing/plugin'
      })
    },
    agree() {
      this.minaService.agree().subscribe(() => {
        this.show = false
      })
    }
  },
  data() {
    return {
      show: false
    }
  }
}
</script>
