import { Api } from '@/api/api'
import { map } from 'rxjs/operators'
const url = '/v1/common/menu'

export class MenuApi extends Api {
  /**
   * 获取菜单列表
   */
  getList() {
    return this.http.get(url)
  }
  /**
   * 标记为常用菜单
   * @param id
   */
  addFavorite(id: number) {
    return this.http.post(`${url}/favorite/${id}`)
  }
  /**
   * 删除常用菜单
   * @param id
   */
  delFavorite(id: number) {
    return this.http.delete(`${url}/favorite/${id}`)
  }
}
