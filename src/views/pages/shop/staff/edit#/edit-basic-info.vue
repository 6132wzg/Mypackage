<template>
  <st-form :form="form" :class="editBasicInfo()">
    <a-row :gutter="8">
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item class="upload-staff-image" label="员工头像">
          <st-image-upload
            width="164px"
            height="164px"
            :list="fileList"
            @change="onChangeGetAvatar"
            :sizeLimit="2"
            placeholder="上传头像"
          ></st-image-upload>
          <div class="page-course-photo-des mg-l16">
            <div class="page-course-item">
              <div class="page-course-item-tip">1.</div>
              <div class="page-course-item-cont">
                图片格式必须为：png,bmp,
                jpeg,jpg,gif,建议使用png格式图片，以保存最佳效果
              </div>
            </div>
            <div class="page-course-item">
              <div class="page-course-item-tip">2.</div>
              <div class="page-course-item-cont">
                建议尺寸为200px * 200px， 不大于200KB
              </div>
            </div>
          </div>
        </st-form-item>
        <st-form-item label="姓名" required>
          <a-input
            placeholder="支持中英文、数字、不超过15个字"
            max="15"
            v-decorator="decorators.staff_name"
          />
        </st-form-item>
        <st-form-item label="手机号" required>
          <a-input v-decorator="decorators.mobile" placeholder="请输入手机号">
            <a-select
              slot="addonBefore"
              style="width: 100px;"
              v-model="country_code_id"
            >
              <a-select-option
                v-for="item in codeList"
                :key="item.code_id"
                :value="item.code_id"
              >
                +{{ item.phone_code }}
              </a-select-option>
            </a-select>
          </a-input>
        </st-form-item>
        <st-form-item label="性别" required>
          <a-select placeholder="请选择" v-decorator="decorators.sex">
            <template v-for="(item, index) in sexs">
              <a-select-option :key="index" :value="+item.value">
                {{ item.label }}
              </a-select-option>
            </template>
          </a-select>
        </st-form-item>
      </a-col>
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item label="员工人脸">
          <face-upload
            width="164px"
            height="164px"
            :list="faceList"
            placeholder="上传头像"
          ></face-upload>
        </st-form-item>
        <st-form-item required>
          <template slot="label">
            昵称
            <st-help-tooltip id="TSCE001" />
          </template>
          <a-input
            placeholder="支持中英文、数字,不超过10个字"
            v-decorator="decorators.nickname"
          />
        </st-form-item>
        <st-form-item label="邮箱">
          <a-input placeholder="请输入邮箱" v-decorator="decorators.mail" />
        </st-form-item>
        <st-form-item label="证件">
          <a-input v-decorator="decorators.id_number" placeholder="请输入">
            <a-select
              slot="addonBefore"
              @change="resetID"
              style="width: 100px;"
              v-model="id_type"
            >
              <a-select-option
                v-for="(item, index) in id_types"
                :key="index"
                :value="+item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-input>
        </st-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="8">
      <a-col :offset="1" :lg="22">
        <st-hr></st-hr>
      </a-col>
    </a-row>

    <a-row :gutter="8">
      <a-col :offset="1" :lg="10" :xs="22">
        <st-form-item label="部门">
          <department-select
            placeholder="请选择部门"
            useType="form"
            v-decorator="decorators.department_id"
          ></department-select>
        </st-form-item>
        <st-form-item label="工作性质">
          <a-select placeholder="请选择" v-decorator="decorators.nature_work">
            <template v-for="(item, index) in nature_works">
              <a-select-option :key="index" :value="+item.value">
                {{ item.label }}
              </a-select-option>
            </template>
          </a-select>
        </st-form-item>
        <st-form-item label="系统角色" required>
          <a-select
            mode="multiple"
            placeholder="请选择"
            v-decorator="decorators.role_id"
            @change="roleChange"
            :disabled="isSuperAdmin"
          >
            <template v-for="item in roleList">
              <a-select-option :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </template>
          </a-select>
        </st-form-item>
      </a-col>
      <a-col :offset="1" :lg="10" :xs="22">
        <st-form-item label="工号">
          <a-input
            placeholder="请输入员工工号"
            v-decorator="decorators.staff_num"
          ></a-input>
        </st-form-item>
        <st-form-item label="入职时间">
          <a-date-picker
            style="width:100%"
            v-decorator="decorators.entry_date"
          />
        </st-form-item>
        <st-form-item label="所属门店">
          <shop-select
            mode="multiple"
            useType="form"
            placeholder="所属门店"
            :disabled="true"
            v-decorator="['shop_id']"
          />
        </st-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="8">
      <a-col :offset="1" :lg="22">
        <st-hr></st-hr>
      </a-col>
    </a-row>

    <a-row :gutter="8">
      <a-col :offset="1">
        <st-form-item labelFix>
          <st-button
            type="primary"
            :loading="loading.updateBasicInfo"
            ghost
            @click="save"
          >
            提交
          </st-button>
          <st-button
            class="mg-l16"
            :loading="loading.updateBasicInfo"
            @click="goNext"
            type="primary"
          >
            保存,继续填写
          </st-button>
        </st-form-item>
      </a-col>
    </a-row>
  </st-form>
</template>
<script>
import ShopSelect from '@/views/biz-components/shop/shop-select'
import DepartmentSelect from '@/views/biz-components/staff/department-select'
import { MessageService } from '@/services/message.service'
import { ListService } from '../list.service'
import { AppConfig } from '@/constants/config'
import { EditService } from '../edit.service'
import { PatternService } from '@/services/pattern.service'
import { ruleOptions } from '../staff-form.config.ts'
import FaceUpload from '@/views/biz-components/face-upload/face-upload'
import { cloneDeep } from 'lodash-es'
import { UserService } from '@/services/user.service'
import StImageUpload from '@/views/components/image-upload#/image-upload.vue'
export default {
  name: 'EditBasicInfo',
  bem: {
    editBasicInfo: 'page-shop-staff-edit-basic'
  },
  serviceInject() {
    return {
      pattern: PatternService,
      appConfig: AppConfig,
      listservice: ListService,
      editservice: EditService,
      message: MessageService,
      userService: UserService
    }
  },
  rxState() {
    return {
      roleList: this.editservice.roleList$,
      codeList: this.editservice.codeList$,
      loading: this.editservice.loading$,
      id_types: this.userService.getOptions$('staff.id_type'),
      nature_works: this.userService.getOptions$('staff.nature_work'),
      sexs: this.userService.getOptions$('staff.sex')
    }
  },
  components: {
    ShopSelect,
    DepartmentSelect,
    FaceUpload,
    StImageUpload
  },
  props: {
    data: {
      type: Object
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      fileList: [],
      faceList: [],
      country_code_id: 37,
      id_type: '',
      value: '' // 部门选择
    }
  },
  computed: {
    isSuperAdmin() {
      return !!this.data.is_super_admin
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setData(this.data)
    })
  },
  methods: {
    resetID() {
      this.form.setFieldsValue({
        id_number: undefined
      })
    },
    onChangeGetAvatar(imageFiles) {
      this.fileList = cloneDeep(imageFiles)
    },
    onChangeGetFace(imageFiles) {
      this.faceList = cloneDeep(imageFiles)
    },
    roleChange(v) {
      if (v && v.length > 10) v.pop()
    },
    onChange(value) {
      this.value = value
    },
    goNext(e) {
      this.form.validate().then(values => {
        this.submit(values, 1)
      })
    },
    save(e) {
      this.form.validate().then(values => {
        this.submit(values)
      })
    },
    /**
     * saveOrgoNext 0 保存 1 下一个
     */
    submit(data, saveOrgoNext) {
      data.entry_date = moment(data.entry_date).format('YYYY-MM-DD')
      data.album_id = this.data.album_id
      data.image_avatar = this.fileList[0] || {}
      data.image_face = this.faceList[0] || {}
      data.country_code_id = this.country_code_id
      data.id_type = this.id_type
      data.department_id = +data.department_id
      this.editservice
        .updateBasicInfo(this.data.staff_id, data)
        .subscribe(res => {
          if (saveOrgoNext === 1) {
            this.$emit('gonext')
            this.$emit('updateStaffInfo')
          } else {
            this.message.success({ content: '编辑成功' })
            this.$router.push({
              path: '/shop/staff/info/basic',
              query: {
                id: this.data.staff_id
              }
            })
          }
        })
    },
    setData(obj) {
      this.form.setFieldsValue({
        staff_name: obj.staff_name,
        nickname: obj.nickname,
        department_id: String(obj.department_id),
        mobile: obj.mobile,
        staff_num: obj.staff_num,
        sex: obj.sex,
        id_number: obj.id_number,
        nature_work: obj.nature_work || undefined,
        role_id: obj.role_id,
        entry_date: obj.entry_date ? moment(obj.entry_date) : undefined,
        mail: obj.mail,
        shop_id: obj.shop_id
      })
      this.country_code_id = obj.country_code_id
      this.id_type = obj.id_type
      this.fileList = Array.isArray(obj.image_avatar)
        ? obj.image_avatar
        : [obj.image_avatar]
      this.faceList = Array.isArray(obj.image_face)
        ? obj.image_face
        : [obj.image_face]
    }
  }
}
</script>
