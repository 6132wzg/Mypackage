<template>
  <div class="page-role-info">
    <st-form
      :form="form"
      class="page-role-info__edit"
      labelWidth="80px"
      @submit.prevent=""
    >
      <st-form-item label="角色名称">
        <a-input
          placeholder="请输入角色名称"
          v-decorator="['name', { initialValue: info.name }]"
        ></a-input>
      </st-form-item>
      <st-form-item label="角色描述">
        <a-input
          placeholder="请输入角色内容"
          v-decorator="[
            'role_description',
            { initialValue: info.role_description }
          ]"
        ></a-input>
      </st-form-item>
      <st-form-item label="数据权限">
        <a-radio-group
          name="radioGroup"
          @change="onChangeDataRegion"
          v-decorator="['data_grant', { initialValue: info.data_grant }]"
          :options="dataGrant"
        ></a-radio-group>
        <span v-if="departmentInfo">({{ departmentInfo }})</span>
      </st-form-item>
      <st-form-item label="功能权限">
        <div class="jurisdiction">
          <st-container class="brand-list">
            <p>品牌权限</p>
            <st-input-search
              placeholder="请输入"
              @change="fileterBrandList"
              round="round"
            ></st-input-search>
            <a-tree
              checkable
              :defaultSelectedKeys="['menu:1', 'menu:2', 'menu:3']"
              @expand="onExpand"
              v-model="brandIds"
              :expandedKeys.sync="expandedKeys"
              :autoExpandParent="autoExpandParent"
              :treeData="brands"
            >
              <template slot="title" slot-scope="{ title }">
                <span v-if="title.indexOf(searchValue) > -1">
                  {{ title.substr(0, title.indexOf(searchValue)) }}
                  <span style="color: #f50">{{ searchValue }}</span>
                  {{
                    title.substr(
                      title.indexOf(searchValue) + searchValue.length
                    )
                  }}
                </span>
                <span v-else>{{ title }}</span>
              </template>
            </a-tree>
          </st-container>
          <st-container class="shop-list">
            <p>门店权限</p>
            <st-input-search
              placeholder="请输入"
              @change="fileterShopList"
              round="round"
            ></st-input-search>
            <a-tree
              checkable
              :defaultSelectedKeys="['menu:1', 'menu:2', 'menu:3']"
              @expand="onExpandShop"
              v-model="shopIds"
              :expandedKeys.sync="expandedKeysShop"
              :autoExpandParent="autoExpandParentShop"
              :treeData="shops"
            >
              <template slot="title" slot-scope="{ title }">
                <span v-if="title.indexOf(searchShopValue) > -1">
                  {{ title.substr(0, title.indexOf(searchShopValue)) }}
                  <span style="color: #f50">{{ searchShopValue }}</span>
                  {{
                    title.substr(
                      title.indexOf(searchShopValue) + searchShopValue.length
                    )
                  }}
                </span>
                <span v-else>{{ title }}</span>
              </template>
            </a-tree>
          </st-container>
        </div>
      </st-form-item>
    </st-form>
    <div class="page-role-info__btn">
      <st-button type="primary" @click="onClickSubmit" class="mg-r16">
        保存
      </st-button>
      <st-button @click="onCancel">取消</st-button>
    </div>
  </div>
</template>

<script>
import { EditService } from './edit.service'
import { listToTree } from '@/utils/list-to-tree.js'
import { cloneDeep } from 'lodash-es'
import RoleDepartment from '@/views/biz-modals/role/department'
const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.name === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}
export default {
  name: 'EditRole',
  modals: {
    RoleDepartment
  },
  serviceInject() {
    return {
      editService: EditService
    }
  },
  rxState() {
    return {
      loading: this.editService.loading$,
      info: this.editService.info$,
      departmentInfo: this.editService.departmentInfo$,
      brandList: this.editService.brandList$,
      shopList: this.editService.shopList$,
      dataGrant: this.editService.dataGrant$
    }
  },
  data() {
    return {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      expandedKeysShop: [],
      searchShopValue: '',
      autoExpandParentShop: true,
      form: this.$form.createForm(this),
      brandIds: [],
      department_ids: [],
      shopIds: [],
      brands: [],
      shops: []
    }
  },
  computed: {
    id() {
      return this.info.id
    }
  },
  methods: {
    a() {},
    onCancel() {
      this.$router.go(-1)
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onExpandShop(expandedKeys) {
      this.expandedKeysShop = expandedKeys
      this.autoExpandParentShop = false
    },
    fileterBrandList(e) {
      const value = e.target.value
      const expandedKeys = this.brandList
        .map(item => {
          if (item.name.indexOf(value) > -1) {
            return getParentKey(item.name, cloneDeep(this.brands))
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    },
    fileterShopList(e) {
      const value = e.target.value
      const expandedKeysShop = this.shopList
        .map(item => {
          if (item.name.indexOf(value) > -1) {
            return getParentKey(item.name, cloneDeep(this.shops))
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeysShop,
        searchShopValue: value,
        autoExpandParentShop: true
      })
    },
    onChangeDataRegion(val) {
      const that = this
      if (val.target.value === 3) {
        this.$modalRouter.push({
          name: 'role-department',
          on: {
            success(result) {
              that.departmentInfo = result.label.join(',')
              // that.departmentName = result.lable.join(',')
              that.department_ids = result.value
              if (that.department_ids.length === 0) {
                that.form.setFieldsValue({
                  data_grant: undefined
                })
              }
            }
          }
        })
      } else {
        that.departmentInfo = ''
        that.department_ids = []
      }
    },
    getSelectIds(selectIds, count) {
      const roleList = cloneDeep([...this.brandList, ...this.shopList])
      const tempList = []
      selectIds.map(id => {
        roleList.forEach(ele => {
          if (id === ele.id) {
            tempList.push(ele.parent_id)
          }
        })
      })
      const reslutArr = Array.from(new Set([...selectIds, ...tempList]))
      const length = reslutArr.length
      return length === count ? reslutArr : this.getSelectIds(reslutArr, length)
    },
    onClickSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const select_ids = this.getSelectIds(
            cloneDeep([...this.brandIds, ...this.shopIds])
          ).filter(item => item !== 'menu:0')
          const form = {
            id: this.id,
            ...values,
            select_ids,
            department_ids: this.department_ids
          }
          this.editService.update(form).subscribe(res => {
            this.$router.push({
              name: 'brand-staff-role-info',
              query: { id: this.id }
            })
          })
        }
      })
    },
    isParent(item, arr, dep) {
      // 两种情况
      // 第一种情况 当前节点有子节点且该节点没有匹配成功
      // 第二种情况 当前节点没有子节点且该节点没有匹配成功
      if (!Array.isArray(arr)) return
      for (let i = 0; i < arr.length; i++) {
        let current = arr[i]
        if (item === current.key && !current.children) {
          dep.push(item)
        } else {
          this.isParent(item, current.children, dep)
        }
      }
    }
  },
  mounted() {
    this.brands = listToTree(cloneDeep(this.brandList))
    this.brandList
      .filter(item => {
        return this.info.select_ids.includes(item.id)
      })
      .map(item => {
        return item.id
      })
      .map(item => {
        return this.isParent(item, this.brands, this.brandIds)
      })
    // 初始化跨部门 部门id
    this.department_ids = this.info.departments.map(item => item.id)
    this.shops = listToTree(cloneDeep(this.shopList))
    this.shopList
      .filter(item => {
        return (
          this.info.select_ids.includes(item.id) &&
          item.id.includes('permission')
        )
      })
      .map(item => {
        return item.id
      })
      .map(item => {
        return this.isParent(item, this.shops, this.shopIds)
      })
  }
}
</script>
