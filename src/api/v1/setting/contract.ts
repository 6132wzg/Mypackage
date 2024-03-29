import { Api } from '../../api'

export class ContractApi extends Api {
  /**
   * 合同模版列表
   */
  getList() {
    return this.http.get('/v1/setting/contract')
  }
  /**
   * 合同模版信息
   */
  getInfo(id: number) {
    return this.http.get(`/v1/setting/contract/${id}`, {})
  }
  /**
   * 合同设置更新
   */
  update(params: ContractInput) {
    return this.http.put(`/v1/setting/contract/${params.id}`, { params })
  }
  add(params: ContractInput) {
    return this.http.post('/v1/setting/contract', { params })
  }
  /**
   * 获取合同章程
   */
  getConstitutionInfo(id: number) {
    return this.http.get(`/v1/setting/contract/constitution/${id}`, {})
  }
  /**
   * 更新合同章程
   */
  updateConstitution(params: ContractConstitutionInput) {
    return this.http.put(`/v1/setting/contract/constitution/${params.id}`, {
      params
    })
  }
  /**
   * 获取合同编码信息
   */
  getCodeInfo(id: number) {
    return this.http.get(`/v1/setting/contract/code/${id}`, {})
  }
  /**
   * 更新合同编号
   */
  updateCode(params: any) {
    return this.http.put(`/v1/setting/contract/code/${params.id}`, { params })
  }
  /**
   * 合同编号自动生成
   */
  getCodeNumber(id: string) {
    return this.http.get(`/v1/setting/contract/codenumber/${id}`)
  }
}

export interface ContractInput {
  id?: number
  /**
   * 合同标题
   */
  contract_title: string
  /**
   * 页面缩放
   */
  contract_page: number
  /**
   * 页面边距
   */
  contract_marget: number
  /**
   * 品牌logo 开启 0 关闭 1 开启
   */
  is_brand_logo: number
  /**
   * 合同编号 开启 0 关闭 1 开启
   */
  is_contract_number: number
  /**
   * 会员照 开启 0 关闭 1 开启
   */
  is_member_pic: number
  /**
   * 会员姓名 开启 0 关闭 1 开启
   */
  is_member_name: number
  /**
   * 会员手机 开启 0 关闭 1 开启
   */
  is_member_mobile: number
  /**
   * 会员卡号 开启 0 关闭 1 开启
   */
  is_member_card: number
  /**
   * 会员性别 开启 0 关闭 1 开启
   */
  is_member_sex: number
  /**
   * 会员身份证号 开启 0 关闭 1 开启
   */
  is_member_id_card: number
  /**
   * 会员家庭住址 开启 0 关闭 1 开启
   */
  is_member_address: number
  /**
   * 销售人员 开启 0 关闭 1 开启
   */
  is_salesman_name: number
  /**
   * 备注信息
   */
  contents: number
}

export interface ContractConstitutionInput {
  /**
   *  合同id
   */
  id: number
  /**
   * 合同章程
   */
  brand_law_content: string
}
