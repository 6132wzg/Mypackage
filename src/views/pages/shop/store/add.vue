<template>
  <st-mina-panel app>
    <div slot="actions">
      <st-button
        type="primary"
        :loading="isEditMode ? loading.editGoods : loading.addGoods"
        @click="onSubmit"
      >
        保 存
      </st-button>
    </div>
    <div :class="basic()">
      <st-form :form="form" labelWidth="118px">
        <a-row :gutter="8">
          <a-col :span="10">
            <st-form-item label="商品名称" required>
              <a-input
                v-decorator="decorators.product_name"
                placeholder="请输入商品名称"
                @change="changeName"
                maxlength="30"
              >
                <span :class="basic('name--gray')" slot="suffix">
                  {{ name.length }}
                  /30
                </span>
              </a-input>
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :span="10">
            <st-form-item label="商品分类" required>
              <a-select
                showSearch
                v-decorator="decorators.category_id"
                placeholder="请选择分类"
              >
                <a-select-option
                  :value="item.category_id"
                  v-for="item in classList"
                  :key="item.category_id"
                >
                  {{ item.category_name }}
                </a-select-option>
              </a-select>
            </st-form-item>
          </a-col>
          <a-col :span="6" :class="basic('class--manage')">
            <a @click="openClass">
              分类管理
            </a>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :span="16">
            <st-form-item label="商品图片" required>
              <ul :class="basic('img--container')">
                <li
                  :class="['mg-r12', 'mg-t12', basic('img')]"
                  v-for="(item, index) in imgList"
                  :key="index"
                >
                  <img
                    :data-src="item.image_url | imgFilter({ w: 1000 })"
                    :src="item.image_url | imgFilter({ w: 126, h: 126 })"
                    width="126"
                    height="126"
                    alt="商品图片"
                  />
                  <div :class="basic('img--del')">
                    <span
                      :class="basic('img--del-text')"
                      @click="delImg(item, index)"
                    >
                      删除
                    </span>
                  </div>
                </li>
                <li :class="basic('img')">
                  <st-image-upload
                    v-if="imgList.length < 5"
                    class="mg-t12"
                    width="126px"
                    height="126px"
                    :cropperModal="cropperModal"
                    :list="fileList"
                    @change="getImage"
                    :numLimit="5"
                    :sizeLimit="2"
                    placeholder="上传图片"
                  >
                    <template v-slot:description>
                      <p>建议尺寸为750px*750px</p>
                    </template>
                  </st-image-upload>
                  <div :class="basic('img--tip')">可上传5张商品图片</div>
                </li>
              </ul>
              <div class="color-danger" v-if="isImgError">请上传商品图片</div>
            </st-form-item>
            <st-form-item label="售卖方式" required>
              <a-checkbox-group
                v-decorator="decorators.sale_type"
                @change="changeSale"
              >
                <a-checkbox
                  :value="item.value"
                  v-for="item in saleType"
                  :key="item.value"
                  style="margin-right: 16px;"
                >
                  {{ item.label }}
                </a-checkbox>
              </a-checkbox-group>
            </st-form-item>
            <st-form-item label="配送方式" required>
              <a-checkbox-group v-decorator="decorators.delivery_type">
                <a-checkbox
                  :value="item.value"
                  :disabled="
                    (isChoose && item.value === 1) ||
                      (isDisabledCourier && item.value === 2)
                  "
                  v-for="item in shippingMode"
                  :key="item.value"
                  style="margin-right: 16px;"
                >
                  {{ item.label }}
                </a-checkbox>
              </a-checkbox-group>
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :span="18">
            <st-form-item label="商品介绍">
              <st-editor
                @image-change="getImageUrl"
                @input="onChangeEditor"
                v-model="content"
              ></st-editor>
              <div class="color-danger" v-if="isEditor">请输入活动详情</div>
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :span="20">
            <!-- <a-col :span="10"> -->
            <st-form-item label="规格设置" required>
              <a-radio-group
                v-model="isMore"
                @change="changeMore"
                :disabled="isEditMode"
              >
                <a-radio :value="1">单规格</a-radio>
                <a-radio :value="2">多规格</a-radio>
              </a-radio-group>
              <st-button
                type="dashed"
                :class="basic('sku--add')"
                v-if="isMore === 2 && !isEditMode && skuList.length < 3"
                @click="addSku"
              >
                <a-icon type="plus" :class="basic('sku--add-icon')" />
                <span>新增规格项（{{ skuList.length }}/3）</span>
              </st-button>
              <div
                :class="skuItem()"
                v-for="(item, index) in skuList"
                :key="index"
              >
                <st-form-item
                  label="规格项名称"
                  :help="item.isNameErr ? '请正确填写规格项' : ''"
                  :validateStatus="item.isNameErr ? 'error' : ''"
                >
                  <a-input
                    v-model="item.spec_name"
                    placeholder="请输入规格项名称"
                    :disabled="isEditMode"
                    maxlength="20"
                    style="width: 220px;"
                  ></a-input>
                  <span
                    :class="skuItem('del')"
                    @click="delSku(index)"
                    v-if="!isEditMode"
                  >
                    <st-icon
                      type="delete"
                      :class="skuItem('icon')"
                      color="#3F66F6"
                    ></st-icon>
                    <span :class="skuItem('text')">
                      删除
                    </span>
                  </span>
                </st-form-item>
                <st-form-item
                  label="规格项设置"
                  :help="item.isErr ? '请正确填写规格' : ''"
                  :validateStatus="item.isErr ? 'error' : ''"
                >
                  <span
                    v-for="(sku, i) in item.spec_item_name"
                    :key="i"
                    :class="basic('sku--tag')"
                  >
                    {{ sku }}
                    <a-icon
                      type="close"
                      @click="delSkuItem(index, i)"
                      v-if="isEditMode ? item.spec_item_name.length > 1 : true"
                    />
                  </span>
                  <a
                    :class="skuItem('add')"
                    @click="addSkuItem(index)"
                    v-if="item.spec_item_name.length <= 10"
                  >
                    新增规格
                  </a>
                </st-form-item>
              </div>
            </st-form-item>
            <st-form-item
              label-fix
              :help="tableTips"
              :validateStatus="tableErr ? 'error' : ''"
            >
              <st-container>
                <st-table
                  rowKey="key"
                  :columns="skuColumns"
                  :dataSource="tableData"
                  :pagination="false"
                >
                  <template
                    slot="market_price"
                    slot-scope="customRender, record"
                  >
                    <div :class="basic('apply')">
                      <st-input-number
                        v-model="record.market_price"
                        :float="true"
                        style="width: 110px;"
                        @change="record.is_update = 1"
                      >
                        <template slot="addonAfter">
                          元
                        </template>
                      </st-input-number>
                      <a
                        style="margin-left: 8px;"
                        :class="basic('apply--all')"
                        v-if="isMore === 2 && tableData.length > 1"
                        @click="allApply('market_price', record.market_price)"
                      >
                        批量应用
                      </a>
                    </div>
                  </template>
                  <template
                    slot="selling_price"
                    slot-scope="customRender, record"
                  >
                    <div :class="basic('apply')">
                      <st-input-number
                        v-model="record.selling_price"
                        :float="true"
                        style="width: 110px;"
                        @change="record.is_update = 1"
                      >
                        <template slot="addonAfter">
                          元
                        </template>
                      </st-input-number>
                      <a
                        style="margin-left: 8px;"
                        :class="basic('apply--all')"
                        v-if="isMore === 2 && tableData.length > 1"
                        @click="allApply('selling_price', record.selling_price)"
                      >
                        批量应用
                      </a>
                    </div>
                  </template>
                  <template
                    slot="stock_amount"
                    slot-scope="customRender, record"
                  >
                    <div :class="basic('apply')">
                      <st-input-number
                        v-model="record.stock_amount"
                        style="width: 110px;"
                        :disabled="isEditMode"
                      ></st-input-number>
                      <a
                        style="margin-left: 8px;"
                        :class="basic('apply--all')"
                        v-if="isMore === 2 && tableData.length > 1"
                        @click="allApply('stock_amount', record.stock_amount)"
                      >
                        批量应用
                      </a>
                    </div>
                  </template>
                </st-table>
              </st-container>
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :span="10">
            <st-form-item label="上架状态" required>
              <a-radio-group v-model="shelves_status">
                <a-radio
                  :value="item.value"
                  v-for="item in shelvesStatus"
                  :key="item.value"
                >
                  {{ item.label }}
                </a-radio>
              </a-radio-group>
            </st-form-item>
          </a-col>
        </a-row>
      </st-form>
    </div>
  </st-mina-panel>
</template>
<script>
import { ruleOptions, skuColumns } from './add.config'
import StImageUpload from '@/views/components/image-upload#/image-upload.vue'
import StEditor from '@/views/components/editor#/editor.vue'
import StoreClassManage from '@/views/biz-modals/store/class-manage.vue'
import { PatternService } from '@/services/pattern.service'
import { AddService } from './add.service.ts'
import StoreAddSku from '@/views/biz-modals/store/add-sku'
import { result } from 'lodash-es'
import { UserService } from '@/services/user.service'
import { cloneDeep } from 'lodash-es'
export default {
  bem: {
    basic: 'shop-store-add',
    skuItem: 'sku-item'
  },
  serviceInject() {
    return {
      pattern: PatternService,
      addService: AddService,
      userService: UserService
    }
  },
  rxState() {
    return {
      loading: this.addService.loading$,
      saleType: this.userService.getOptions$('cloud_store.sale_type'),
      shippingMode: this.userService.getOptions$('cloud_store.shipping_mode'),
      shelvesStatus: this.userService.getOptions$(
        'cloud_store.edit_shelves_status'
      )
    }
  },
  modals: { StoreClassManage, StoreAddSku },
  props: {
    isEditMode: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      cropperModal: {
        cropper: {
          aspectRatio: 1
        }
      },
      name: '', // 商品名称
      isMore: 1, // 是否是多规格
      tableData: [
        {
          market_price: '',
          selling_price: '',
          stock_amount: '',
          key: parseInt(Math.random() * 999999).toString()
        }
      ],
      skuList: [],
      content: '',
      isEditor: false,
      fileList: [], // 商品图片组件中
      imgList: [], //上传的图片
      isImgError: false,
      shelves_status: 1,
      product_images_del: [],
      product_images_add: [],
      classList: [],
      tableErr: false,
      tableTips: '',
      isChoose: false,
      isDisabledCourier: false
    }
  },
  components: {
    StEditor,
    StImageUpload
  },
  computed: {
    skuColumns,
    sku() {
      let list = []
      this.skuList.forEach((item, index) => {
        let skuItem = {
          title: item.spec_name,
          dataIndex: index
        }
        list.push(skuItem)
      })
      return list
    }
  },
  mounted() {
    this.addService.getList().subscribe(res => {
      this.classList = res.list
    })
    if (this.isEditMode) {
      this.goodDetail()
    }
  },
  methods: {
    changeSale(event) {
      let type = this.form.getFieldValue('delivery_type')
      let deliveryType = []
      if (event.indexOf(1) !== -1) {
        this.isChoose = true
        if (type !== undefined) {
          deliveryType = type
        }
        if (deliveryType.indexOf(1) === -1) {
          deliveryType.push(1)
          this.form.setFieldsValue({
            delivery_type: deliveryType
          })
        }
      } else {
        this.isChoose = false
      }
      if (event.indexOf(1) !== -1 && event.indexOf(2) === -1) {
        this.isDisabledCourier = true
      } else {
        this.isDisabledCourier = false
      }
    },
    // 保存
    onSubmit() {
      let isReturn = false
      let tableError = false
      if (!this.imgList.length) {
        this.isReturn = true
        this.isImgError = true
      }
      this.skuList.forEach(item => {
        item.isErr = false
        item.isNameErr = false
        if (!item.spec_item_name.length) {
          item.isErr = true
          isReturn = true
        }
        if (!item.spec_name) {
          item.isNameErr = true
          isReturn = true
        }
      })
      this.tableData.forEach(item => {
        if (
          !item.market_price ||
          !item.selling_price ||
          (!this.isEditMode && !item.stock_amount)
        ) {
          tableError = true
          this.tableTips = '请正确填写表格'
          this.tableErr = true
          isReturn = true
        }
      })
      if (!tableError) {
        this.tableTips = ''
        this.tableErr = false
      }
      this.form.validate().then(values => {
        if (isReturn) {
          return
        }
        if (this.isEditMode) {
          this.editGoodOld(values)
        } else {
          this.addGoodNew(values)
        }
      })
    },
    addGoodNew(values) {
      let data = {}
      let product_sku = []
      let spec_name_arr = []
      this.tableData.forEach((item, index) => {
        let skuItem = {}
        skuItem.market_price = item.market_price
        skuItem.selling_price = item.selling_price
        skuItem.stock_amount = item.stock_amount
        skuItem.spec_arr = []
        if (this.skuList.length > 0) {
          skuItem.spec_arr.push({
            spec_name: this.skuList[0].spec_name,
            spec_item_name: item['0']
          })
        }
        if (this.skuList.length > 1) {
          skuItem.spec_arr.push({
            spec_name: this.skuList[1].spec_name,
            spec_item_name: item['1']
          })
        }
        if (this.skuList.length > 2) {
          skuItem.spec_arr.push({
            spec_name: this.skuList[2].spec_name,
            spec_item_name: item['2']
          })
        }
        product_sku.push(skuItem)
      })
      this.skuList.forEach(item => {
        spec_name_arr.push(item.spec_name)
      })
      data = {
        product_images: this.imgList, // 商品图片
        product_intro: this.content, // 商品介绍
        product_sku: product_sku, // 规格设置
        shelves_status: this.shelves_status, // 上架状态
        product_name: values.product_name, // 商品名称
        category_id: values.category_id, // 分类id
        delivery_type:
          values.delivery_type.length === this.shippingMode.length
            ? -1
            : values.delivery_type[0], // 配送方式
        sale_type:
          values.sale_type.length === this.saleType.length
            ? -1
            : values.sale_type[0], // 售卖方式
        spec_name_arr
      }
      this.addService.addGoods(data).subscribe(res => {
        this.$router.push({
          path: './list'
        })
      })
    },
    editGoodOld(values) {
      let data = {}
      let product_sku = []
      this.tableData.forEach((item, index) => {
        let skuItem = {}
        skuItem.market_price = item.market_price
        skuItem.selling_price = item.selling_price
        skuItem.stock_amount = item.stock_amount
        if (item.sku_id) {
          skuItem.is_update = item.is_update
          skuItem.sku_id = item.sku_id
        }
        skuItem.spec_arr = []
        if (this.skuList.length > 0) {
          let sku = {}
          this.info.all_spec[0].spec_item_arr.forEach(spec => {
            sku.spec_id = this.info.all_spec[0].spec_id
            if (spec.spec_item_name === item['0']) {
              sku.spec_item_id = spec.spec_item_id
            }
          })
          sku.spec_name = this.skuList[0].spec_name
          sku.spec_item_name = item['0']
          skuItem.spec_arr.push(sku)
        }
        if (this.skuList.length > 1) {
          let sku = {}
          this.info.all_spec[1].spec_item_arr.forEach(spec => {
            sku.spec_id = this.info.all_spec[1].spec_id
            if (spec.spec_item_name === item['1']) {
              sku.spec_item_id = spec.spec_item_id
            }
          })
          sku.spec_name = this.skuList[1].spec_name
          sku.spec_item_name = item['1']
          skuItem.spec_arr.push(sku)
        }
        if (this.skuList.length > 2) {
          let sku = {}
          this.info.all_spec[2].spec_item_arr.forEach(spec => {
            sku.spec_id = this.info.all_spec[2].spec_id
            if (spec.spec_item_name === item['2']) {
              sku.spec_item_id = spec.spec_item_id
            }
          })
          sku.spec_name = this.skuList[2].spec_name
          sku.spec_item_name = item['2']
          skuItem.spec_arr.push(sku)
        }
        product_sku.push(skuItem)
      })
      data = {
        product_images_del: this.product_images_del, // 商品图片
        product_images_add: this.imgList.filter(item => item.isNew), // 商品图片
        product_intro: this.content, // 商品介绍
        product_sku: product_sku, // 规格设置
        shelves_status: this.shelves_status, // 上架状态
        product_name: values.product_name, // 商品名称
        category_id: values.category_id, // 分类id
        delivery_type:
          values.delivery_type.length === this.shippingMode.length
            ? -1
            : values.delivery_type[0], // 配送方式
        sale_type:
          values.sale_type.length === this.saleType.length
            ? -1
            : values.sale_type[0] // 售卖方式
      }
      this.addService.editGoods(this.$route.query.id, data).subscribe(res => {
        this.$router.push({
          path: './list'
        })
      })
    },
    goodDetail() {
      this.form.setFieldsValue({
        product_name: this.info.product_name,
        category_id: this.info.category_id,
        delivery_type:
          this.info.delivery_type === -1
            ? this.shippingMode.map(item => item.value)
            : [this.info.delivery_type],
        sale_type:
          this.info.sale_type === -1
            ? this.saleType.map(item => item.value)
            : [this.info.sale_type]
      })
      this.name = this.info.product_name
      this.isMore = this.info.all_spec ? 2 : 1
      this.imgList = this.info.product_images
      this.content = this.info.product_intro
      this.shelves_status = this.info.shelves_status
      this.skuList = []
      if (this.info.all_spec) {
        this.info.all_spec.forEach(item => {
          let list = []
          if (item.spec_item_arr) {
            item.spec_item_arr.forEach(it => {
              list.push(it.spec_item_name)
            })
            this.skuList.push({
              spec_name: item.spec_name,
              spec_item_name: list,
              isErr: false,
              isNameErr: false
            })
          }
        })
      }
      let tableData = []
      this.info.product_sku.forEach((item, index) => {
        let tableItem = {}
        tableItem.market_price = item.market_price
        tableItem.selling_price = item.selling_price
        tableItem.stock_amount = item.stock_amount
        tableItem.sku_id = item.sku_id
        tableItem.is_update = 0
        tableItem.key = parseInt(Math.random() * 999999).toString()
        if (item.spec_arr) {
          item.spec_arr.forEach((item, index) => {
            tableItem[index] = item.spec_item_name
          })
        }

        tableData.push(tableItem)
      })
      this.tableData = tableData
    },
    // 为了同步字数
    changeName(e) {
      this.name = e.target.value
    },
    delImg(item, index) {
      if (this.isEditMode && item.image_id) {
        this.product_images_del.push(item.image_id)
      }
      this.imgList.splice(index, 1)
    },
    addSku() {
      this.skuList.push({
        spec_name: '',
        spec_item_name: [],
        isErr: false,
        isNameErr: false
      })
    },
    addSkuItem(index) {
      this.$modalRouter.push({
        name: 'store-add-sku',
        props: { list: this.skuList[index].spec_item_name },
        on: {
          success: result => {
            this.skuList[index].spec_item_name.push(result)
            this.changeTable()
          }
        }
      })
    },

    delSkuItem(index, i) {
      this.skuList[index].spec_item_name.splice(i, 1)
      this.changeTable()
    },
    delSku(index) {
      this.skuList.splice(index, 1)
      if (!this.skuList.length) {
        this.isMore = 1
        this.tableData = [
          {
            market_price: '',
            selling_price: '',
            stock_amount: '',
            key: parseInt(Math.random() * 999999).toString()
          }
        ]
      }
    },
    getImageUrl(imageUrl) {
      const imgEl = `<img src='${imageUrl.url}' width='400' height='400'>`
      this.content = this.content + imgEl
    },
    onChangeEditor() {
      this.isEditor = this.content.length === 0
      return this.content.length === 0
    },
    getImage(data) {
      let img = {
        image_id: data[0].image_id,
        image_key: data[0].image_key,
        image_url: data[0].image_url,
        is_cover: 0
      }
      this.imgList.push(img)
      if (this.isEditMode) {
        img.isNew = true
      }
      this.isImgError = false
      this.fileList = []
    },
    // 规格发生改变时列表数据相应改变
    changeTable() {
      let list = []
      let skuList = []
      this.skuList.forEach((item, index) => {
        if (item.spec_item_name.length !== 0) {
          skuList.push(item)
        }
      })
      skuList[0].spec_item_name.forEach((item, index) => {
        let skuItem = { market_price: '', selling_price: '', stock_amount: '' }
        skuItem['0'] = item
        if (skuList[1] && skuList[1].spec_item_name.length) {
          skuList[1].spec_item_name.forEach((ite, inde) => {
            skuItem['1'] = ite
            if (skuList[2] && skuList[2].spec_item_name.length) {
              skuList[2].spec_item_name.forEach((it, ind) => {
                skuItem['2'] = it
                list.push(cloneDeep(skuItem))
              })
            } else {
              list.push(cloneDeep(skuItem))
            }
          })
        } else {
          list.push(cloneDeep(skuItem))
        }
      })
      list.forEach(o => {
        o.key = parseInt(Math.random() * 999999).toString()
      })
      this.tableData = list
      console.log(this.tableData, 'tableDatatableData')
    },
    openClass() {
      this.$modalRouter.push({
        name: 'store-class-manage',
        props: { shopList: 1 },
        on: {
          success: res => {
            this.addService.getList().subscribe(res => {
              this.classList = res.list
              let data = this.form.getFieldsValue()
              if (!this.classList.some(item => item.id === data.category_id)) {
                this.form.setFieldsValue({ category_id: '' })
              }
            })
          }
        }
      })
    },
    changeMore() {
      this.skuList = []
      this.tableData = [
        {
          market_price: '',
          selling_price: '',
          stock_amount: '',
          key: parseInt(Math.random() * 999999).toString()
        }
      ]
    },
    allApply(attr, value) {
      this.tableData.map(item => (item[attr] = value))
    }
  }
}
</script>
