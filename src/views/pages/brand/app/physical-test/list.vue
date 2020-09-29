<template>
  <div :class="b()">
    <st-panel-layout :class="b('container')">
      <!-- 会员体测信息说明 -->
      <MarkteingPluginTitle pathName="brand-app-physical-test-list" />
      <!-- 会员体测表格 -->
      <div :class="b('main')">
        <div :class="b('bodyImg')">
          <div :class="b('bodyImg-header')">
            <div :class="b('bodyImg-header__title')">体态拍照设置</div>
            <div :class="b('bodyImg-header__subtitle')">
              您可以新增更多的体态图，最多支持6张
            </div>
          </div>
          <div :class="b('bodyImg-content')">
            <div :class="b('bodyImg-content-tag')">
              <div v-for="tag in labels" :key="tag.id">
                <a-tooltip :key="tag.id" :title="tag.img_name">
                  <a-tag
                    :class="b('bodyImg-content-tag-item')"
                    :key="tag.img_name"
                    :closable="!tag.is_must"
                    @close="handleRemoveTag(tag)"
                  >
                    {{ tag.img_name }}
                  </a-tag>
                </a-tooltip>
              </div>
              <a
                v-modal-link="{
                  name: 'brand-app-physical-test-new-label',
                  props: {},
                  on: { success: handleReGetBodyImg }
                }"
                v-if="labels.length < 6"
              >
                <a-tag style="background: #fff; borderStyle: dashed;">
                  <a-icon type="plus" style="margin-right: 8px;" />
                  新增体态图
                </a-tag>
              </a>
            </div>
          </div>
        </div>
        <div :class="b('physicalTestTable')">
          <div :class="b('physicalTestTable-header')">
            <div :class="b('physicalTestTable-header__title')">
              基础体测数据
            </div>
            <div :class="b('physicalTestTable-header__subtitle')">
              已创建体测数据（{{ indicatorsNum }}/50）
            </div>
          </div>
          <st-form-table>
            <thead>
              <tr>
                <th style="width: 5%"></th>
                <th style="width: 29%">数据名称</th>
                <th style="width: 29%">单位</th>
                <th style="width: 11%">展示状态</th>
                <th style="width: 11%">是否必填</th>
                <th style="width: 15%">操作</th>
              </tr>
            </thead>
            <draggable
              v-model="indicators"
              :animation="200"
              :move="checkMove"
              draggable=".canDrag"
              @start="dragStart"
              @end="dragEnd"
              tag="tbody"
              @change="handleSortIndicator"
            >
              <tr>
                <td colspan="12" class="st-form-table__add">
                  <st-button
                    type="dashed"
                    icon="add"
                    block
                    :disabled="addButtonDisable"
                    @click="handleAddIndicator"
                  >
                    新增基础数据
                  </st-button>
                </td>
              </tr>
              <tr
                :class="{ canDrag: !statusAdd && !statusEdit }"
                v-for="(indicator, index) in canEditIndicator"
                :key="index"
              >
                <td>
                  <st-icon type="tuozhuai" />
                </td>
                <td>
                  <div v-if="indicator.isEdit && !indicator.is_default">
                    <a-input
                      v-model="editIndicator.item_name"
                      placeholder="请输入名称(必填)"
                      :maxLength="8"
                      style="width: 160px;"
                    ></a-input>
                  </div>
                  <div v-else>{{ indicator.item_name }}</div>
                </td>
                <td>
                  <div v-if="indicator.isEdit && !indicator.is_default">
                    <a-input
                      v-model="editIndicator.item_unit"
                      placeholder="请输入单位(必填)"
                      :maxLength="8"
                      style="width: 160px;"
                    ></a-input>
                  </div>
                  <div v-else>{{ indicator.item_unit }}</div>
                </td>
                <td>
                  <div v-if="indicator.isEdit">
                    <st-switch v-model="editIndicator.is_show"></st-switch>
                  </div>
                  <div v-else>
                    <st-text
                      :status="{
                        success: indicator.is_show === 1,
                        default: indicator.is_show === 0
                      }"
                    >
                      {{ indicator.show_text[indicator.is_show] }}
                    </st-text>
                  </div>
                </td>
                <td>
                  <div v-if="indicator.isEdit">
                    <st-switch v-model="editIndicator.is_must"></st-switch>
                  </div>
                  <div v-else>{{ indicator.must_text[indicator.is_must] }}</div>
                </td>
                <td>
                  <div v-if="indicator.isEdit">
                    <st-table-actions>
                      <a
                        v-if="!statusAdd"
                        @click="handleSaveIndicators(indicator)"
                      >
                        保存
                      </a>
                      <a
                        v-if="statusAdd"
                        @click="handleSaveIndicators(indicator)"
                      >
                        确认
                      </a>
                      <a @click="handleCancelEditIndicators(indicator)">
                        取消
                      </a>
                    </st-table-actions>
                  </div>
                  <div v-else>
                    <st-table-actions>
                      <a
                        @click="handleEditIndicator(indicator)"
                        v-if="indicator.can_edit && auth.edit"
                      >
                        编辑
                      </a>
                      <a v-if="!indicator.is_default && auth.del">
                        <st-popconfirm
                          :title="'一旦删除则无法恢复，确认删除'"
                          @confirm="handleRemoveIndicators(indicator)"
                        >
                          删除
                        </st-popconfirm>
                      </a>
                    </st-table-actions>
                  </div>
                </td>
              </tr>
            </draggable>
          </st-form-table>
        </div>
      </div>
    </st-panel-layout>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import MarkteingPluginTitle from '@/views/pages/brand/marketing/components#/marketing-title'
import BrandAppPhysicalTestNewLabel from '@/views/biz-modals/brand/app/physical-test/new-label'
import { ListService } from './list.service'
import { cloneDeep } from 'lodash-es'
export default {
  name: 'brand-app-physical-test',

  bem: {
    b: 'brand-app-physical-test'
  },

  components: { MarkteingPluginTitle },

  modals: { BrandAppPhysicalTestNewLabel },

  serviceInject() {
    return {
      physicalTestService: ListService
    }
  },

  rxState() {
    return {
      loading: this.physicalTestService.loading$,
      indicators: this.physicalTestService.list$,
      labels: this.physicalTestService.labelList$,
      auth: this.physicalTestService.auth$
    }
  },

  props: {},

  data() {
    return {
      statusAdd: false,
      statusEdit: false,
      tags: [],
      editIndicator: {}
    }
  },

  computed: {
    indicatorsNum() {
      let len = this.indicators.length
      if (len === 1) {
        return 0
      } else {
        return this.statusAdd ? len - 2 : len - 1
      }
    },
    canEditIndicator() {
      return this.indicators.slice(1)
    },
    addButtonDisable() {
      if (this.auth.add) {
        return this.statusAdd
      } else {
        return true
      }
    }
  },

  methods: {
    checkMove(evt) {
      const { draggedContext, relatedContext, dragged, from, to } = evt
      const draggedElement = draggedContext.element
      const relatedElement = relatedContext.element
      console.log('statusEdit', this.statusEdit)
      // 新增状态不可拖拽
      if (this.statusAdd) return false
      // 编辑状态不可拖拽
      if (this.statusEdit) return false
      return (!relatedElement || !relatedElement.isAdd) && !draggedElement.isAdd
    },
    resetIndicator() {
      this.editIndicator = {
        item_name: '',
        item_unit: '',
        is_show: 1,
        is_must: 1,
        isEdit: true
      }
    },
    handleReGetBodyImg() {
      this.$message.success({ content: '体态图新增成功' })
      this.physicalTestService.getBodyImgLableList().subscribe()
    },
    handleRemoveTag(tag) {
      this.physicalTestService
        .removePhysicalTestBodyImgLabel(tag.id)
        .subscribe(res => {
          this.$message.success({ content: '体态图删除成功' })
          this.physicalTestService.getBodyImgLableList().subscribe()
        })
    },
    handleAddIndicator() {
      this.indicators = this.indicators.map(i => {
        i.isEdit = false
        return i
      })
      this.statusAdd = true
      this.resetIndicator()
      this.indicators.splice(1, 0, this.editIndicator)
    },
    handleEditIndicator(indicator) {
      this.statusEdit = true
      // 如果是从新增状态,点击编辑按钮时
      if (this.statusAdd) {
        this.indicators.splice(1, 1)
        this.statusAdd = false
      }
      this.editIndicator = cloneDeep(indicator)
      this.indicators = this.indicators.map(i => {
        if (i.id === indicator.id) {
          i.isEdit = true
        } else {
          i.isEdit = false
        }
        return i
      })
    },
    handleRemoveIndicators(indicator) {
      this.physicalTestService
        .deleteBodyIndicator(indicator.id)
        .subscribe(res => {
          this.statusEdit = false
          this.indicators = this.indicators.filter(i => i.id !== indicator.id)
        })
    },
    handleSaveIndicators(indicator) {
      console.log('handleSaveIndicators', indicator)
      if (this.statusAdd) {
        this.physicalTestService
          .addBodyIndicator({
            item_name: indicator.item_name,
            item_unit: indicator.item_unit,
            is_show: indicator.is_show,
            is_must: indicator.is_must
          })
          .subscribe(res => {
            // 保存新增的基础提测数据
            this.statusEdit = false
            this.statusAdd = false
            this.resetIndicator()
            this.physicalTestService.getBodyIndicatorList().subscribe()
            console.log('res')
          })
      } else {
        // 保存修改的基础提测数据
        this.physicalTestService
          .editBodyIndicator({
            id: this.editIndicator.id,
            item_name: this.editIndicator.item_name,
            item_unit: this.editIndicator.item_unit,
            is_show: this.editIndicator.is_show,
            is_must: this.editIndicator.is_must
          })
          .subscribe(res => {
            this.statusEdit = false
            this.indicators = this.indicators.map(i => {
              if (i.id === indicator.id) {
                this.editIndicator.isEdit = false
                i = this.editIndicator
                this.resetIndicator()
              }
              return i
            })
          })
      }
    },
    handleCancelEditIndicators(indicator) {
      this.statusEdit = false
      if (this.statusAdd) {
        this.indicators.splice(1, 1)
        this.resetIndicator()
        this.statusAdd = false
      } else {
        this.indicators = this.indicators.map(i => {
          i.isEdit = false
          return i
        })
      }
    },
    handleSortIndicator() {
      let indicators = this.indicators.slice(1)
      this.physicalTestService
        .moveBodyIndicators({
          item_sort: indicators
        })
        .subscribe()
    },
    dragStart(ev) {
      ev.item.classList.add('dragged')
    },
    dragEnd(ev) {
      ev.item.classList.remove('dragged')
    }
  }
}
</script>

<style lang="less" scoped></style>
