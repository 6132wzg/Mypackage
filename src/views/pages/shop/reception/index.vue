<template>
  <div :class="reception()">
    <div :class="reception('wrapper')">
      <div :class="reception('main')">
        <shortcut-nav></shortcut-nav>
        <div class="member">
          <div class="member-wrapper">
            <div class="member-title">会员入离场</div>
            <div class="member-search">
              <a-select
                v-model="selectMember"
                class="member-search-select"
                showSearch
                allowClear
                :showArrow="false"
                placeholder="输入手机号码、姓名、卡号进行搜索"
                :defaultActiveFirstOption="true"
                :filterOption="false"
                :open="memberSearchOpen"
                dropdownClassName="member-search-select-dropdown"
                @popupScroll="scroll"
                @select="onMemberSelect"
                @search="onMemberSearch"
                @inputKeydown="onMemberEnter"
                @blur="onMemberBlur"
                @focus="onMemberFocus"
                ref="searchSelect"
              >
                <a-spin
                  size="small"
                  v-if="loading.getMemberList"
                  slot="notFoundContent"
                ></a-spin>
                <span slot="notFoundContent" v-else-if="isSearchNone">
                  查无此用户，
                  <a @click="onAddUser">新增新用户？</a>
                </span>
                <span slot="notFoundContent" v-else>无搜索结果</span>
                <a-select-option v-for="item in memberList" :key="item.id">
                  <span
                    v-html="
                      `${selectItemLabel(item)}`.replace(
                        new RegExp(lastMemberSearchText, 'g'),
                        `\<span class='global-highlight-color'\>${lastMemberSearchText}\<\/span\>`
                      )
                    "
                  >
                    {{ selectItemLabel(item) }}
                  </span>
                </a-select-option>
                <!-- !isSearchNone && page.current_page < page.total_pages  -->
                <!-- <a-select-option
                  disabled
                  :class="reception('member-search-tip')"
                  :key="new Date() + Math.random()"
                  v-if="!isSearchNone && page.current_page >= page.total_pages"
                >
                  已经到底啦
                </a-select-option> -->
              </a-select>
              <st-button
                class="search"
                :disabled="!isSelectMember"
                @click="handleMemberSearch"
              >
                <a-icon type="search"></a-icon>
              </st-button>
            </div>
          </div>
        </div>
        <shortcut-model></shortcut-model>
      </div>
      <div :class="reception('aside')">
        <member-online v-if="auth.checkinPage" @refresh="handleRefresh" />
        <todo-list />
      </div>
    </div>
  </div>
</template>
<script>
import { IndexService } from './index.service'
import { cloneDeep, debounce, get } from 'lodash-es'
import moment from 'moment'
import FrontAddMember from '@/views/biz-modals/front/add-member'
import ShopReceptionEntrance from '@/views/biz-modals/shop/reception/entrance'
import TodoList from './components#/todolist'
import MemberOnline from './components#/member-online'
import ShortcutNav from './components#/shortcut-nav'
import ShortcutModel from './components#/shortcut-model'
import { enumFilter } from '../../../../filters/other.filters'
import { tap } from 'rxjs/operators'
export default {
  name: 'PageShopReception',
  bem: {
    reception: 'page-shop-reception'
  },
  modals: {
    FrontAddMember,
    ShopReceptionEntrance
  },
  serviceInject() {
    return {
      indexService: IndexService
    }
  },
  rxState() {
    return {
      auth: this.indexService.auth$,
      memberList: this.indexService.memberList$,
      hasNext: this.indexService.hasNext$,
      page: this.indexService.page$,
      loading: this.indexService.loading$,
      parent_types: this.indexService.parent_types$
    }
  },
  components: {
    TodoList,
    MemberOnline,
    ShortcutNav,
    ShortcutModel
  },
  data() {
    return {
      // 搜索会员的关键字
      memberSearchText: '',
      // 搜索会员的最后一次关键字
      lastMemberSearchText: '',
      // 选择的会员
      selectMember: undefined,
      // memberId
      memberId: undefined,
      page: {
        current_page: 1,
        size: 10
      },
      memberSearchOpen: false
    }
  },
  computed: {
    isSearchNone() {
      return this.memberSearchText !== '' && !this.memberList.length
    },
    // 是否确定了会员
    isSelectMember() {
      return this.selectMember && this.memberId && this.memberList.length
    }
  },
  mounted() {
    if (this.auth.checkinPage) {
      this.indexService.getMemberOnlineList().subscribe(res => {
        setTimeout(() => {
          this.$refs.searchSelect.$el.click()
        }, 200)
      })
    }
  },
  methods: {
    handleRefresh() {
      this.indexService.getMemberOnlineList().subscribe(() => {
        setTimeout(() => {
          this.$refs.searchSelect.$el.click()
        }, 200)
      })
    },
    handleMemberSearch() {
      console.log('handleMemberSearch', this.memberId)
      this.lastMemberSearchText = ''
      this.memberSearchText = ''
      this.$modalRouter.push({
        name: 'shop-reception-entrance',
        props: {
          member_id: this.memberId
        },
        on: {
          done: () => {
            this.selectMember = undefined
            this.memberId = undefined
            this.lastMemberSearchText = ''
            this.memberSearchText = ''
            this.indexService.setMemberList([])
            if (this.auth.checkinPage) {
              this.indexService.getMemberOnlineList().subscribe(res => {
                setTimeout(() => {
                  this.$refs.searchSelect.$el.click()
                }, 200)
              })
            } else {
              setTimeout(() => {
                this.$refs.searchSelect.$el.click()
              }, 200)
            }
          }
        }
      })
    },
    selectItemLabel(item) {
      if (item.is_minors === 1) {
        return `${item.member_name}(未成年) ${
          item.parent_mobile
        }(${this.filterParentUserRole(item)})`
      }
      return `${item.member_name} ${item.mobile}`
    },
    filterParentUserRole(item) {
      return this.parent_types.filter(i => i.value === item.parent_user_role)[0]
        .label
    },
    // 搜索会员
    onMemberSearch(data) {
      this.memberSearchOpen = true
      if (!this.hasNext && this.memberSearchText === data.trim()) {
        return
      }
      if (this.memberSearchText !== data.trim()) {
        this.page.current_page = 1
        this.indexService.setMemberList([])
      }
      this.memberSearchText = data.trim()
      if (data.trim() !== '') {
        this.lastMemberSearchText = data.trim()
        this.indexService.memberListAction$.dispatch({
          keyword: data,
          current_page: this.page.current_page,
          size: this.page.size
        })
      }
    },
    // 选择了会员
    onMemberSelect(data) {
      this.selectMember = data
      this.memberId = data
      this.handleMemberSearch()
    },
    // 监听回车入场
    onMemberEnter(e) {
      let keyCode = e.keyCode
      if (
        keyCode === 13 &&
        !this.memberList.length &&
        !this.loading.getMemberList
      ) {
        this.indexService
          .getMemberList({
            keyword: this.lastMemberSearchText
          })
          .subscribe(res => {
            let list = res.list
            let id = list.length ? list[0]['id'] : undefined
            if (id) {
              this.onMemberSelect(id)
            } else {
              this.selectMember = undefined
              this.memberId = undefined
              this.lastMemberSearchText = ''
              this.memberSearchText = ''
              this.indexService.setMemberList([])
              this.$refs.searchSelect.$children[0]['setInputValue']('')
            }
          })
      }
    },
    // 会员搜索框失去焦点
    onMemberBlur() {
      this.memberId = undefined
      this.selectMember = undefined
      this.lastMemberSearchText = ''
      this.memberSearchText = ''
      this.memberSearchOpen = false
      this.indexService.setMemberList([])
    },
    onMemberFocus() {
      if (!this.memberSearchText) {
        this.memberSearchOpen = false
        return
      }
      if (!this.memberSearchOpen) this.memberSearchOpen = true
    },
    // 新增会员
    onAddUser() {
      this.$modalRouter.push({
        name: 'front-add-member',
        on: {
          success: res => {
            this.onMemberSelect(res.id)
            this.onMemberSearch(res.name)
          }
        }
      })
    },
    scroll: debounce(function(e) {
      const { target } = e
      if (
        Math.floor(target.scrollTop) + target.clientHeight >
        target.scrollHeight - 20
      ) {
        if (this.hasNext) {
          this.page.current_page++
          this.onMemberSearch(this.memberSearchText)
        }
      }
    }, 200)
  }
}
</script>
