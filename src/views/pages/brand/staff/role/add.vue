<template>
  <div class="page-role-info">
    <st-form :form="form" class="page-role-info__add" labelWidth="80px">
      <st-form-item label="角色名称">
        <a-input placeholder="请输入角色名称" v-decorator="['name']"></a-input>
      </st-form-item>
      <st-form-item label="角色描述">
        <a-input
          placeholder="请输入角色内容"
          v-decorator="['role_description']"
        ></a-input>
      </st-form-item>
      <st-form-item label="数据权限">
        <a-radio-group
          name="radioGroup"
          @change="onChangeDataRegion"
          v-decorator="['data_grant']"
          :options="dataGrant"
        ></a-radio-group>
        <span v-if="departmentName">({{ departmentName }})</span>
      </st-form-item>
      <st-form-item label="功能权限">
        <div class="role-list">
          <st-container class="brand-list mg-r16 pd-x24">
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
          <st-container class="shop-list pd-x24">
            <p>门店权限</p>
            <st-input-search
              @change="fileterShopList"
              placeholder="请输入"
              round="round"
            ></st-input-search>
            <a-tree
              checkable
              :defaultSelectedKeys="['menu:1', 'menu:2', 'menu:3']"
              @expand="onExpand"
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
import { listToTree } from '@/utils/list-to-tree.js'
import { RoleService } from '../role.service'
import { cloneDeep } from 'lodash-es'
import { AddService } from './add.service'
import RoleDepartment from '@/views/biz-modals/role/department'
export default {
  name: 'AddRole',
  modals: {
    RoleDepartment
  },
  serviceInject() {
    return {
      roleService: RoleService,
      addService: AddService
    }
  },
  rxState() {
    return {
      brandList: this.addService.brandList$,
      shopList: this.addService.shopList$,
      dataGrant: this.addService.dataGrant$
    }
  },
  data() {
    return {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      expandedKeysShop: [],
      searchShopValue: '',
      departmentName: '',
      autoExpandParentShop: true,
      form: this.$form.createForm(this),
      brandIds: [],
      department_ids: [],
      shopIds: [],
      brands: [],
      shops: []
    }
  },
  methods: {
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
              that.departmentName = result.label.join(',')
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
        that.departmentName = ''
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
            ...values,
            select_ids,
            department_ids: this.department_ids
          }
          this.roleService.add(form).subscribe()
          this.$router.push({ name: 'brand-staff-role' })
        }
      })
    }
  },
  mounted() {
    this.brands = listToTree(cloneDeep(this.brandList))
    this.shops = listToTree(cloneDeep(this.shopList))
  }
}
</script>
