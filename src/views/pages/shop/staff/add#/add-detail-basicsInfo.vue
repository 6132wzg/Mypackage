<template>
  <st-form :form="form" :class="addBasicsInfo()">
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
              style="width: 100px;"
              slot="addonBefore"
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
          <a-radio-group name="radioGroup" v-decorator="decorators.sex">
            <a-radio :value="SEX.MALE">
              男
              <st-icon
                class="sex__male"
                style="color: #636aec"
                type="male"
              ></st-icon>
            </a-radio>
            <a-radio :value="SEX.FEMALE">
              女
              <st-icon
                calss="sex__female"
                style="color: #fa756c"
                type="female"
              ></st-icon>
            </a-radio>
          </a-radio-group>
        </st-form-item>
      </a-col>
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item label="员工人脸">
          <face-upload
            width="164px"
            height="164px"
            :list="faceList"
            @change="onChangeGetFace"
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
          <a-input placeholder="请输入" v-decorator="decorators.id_number">
            <a-select
              slot="addonBefore"
              style="width: 100px;"
              @change="resetID"
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
      <a-col :offset="1" :lg="23">
        <st-form-item required>
          <template slot="label">
            员工职能
            <st-help-tooltip id="TSCE002" />
          </template>
          <a-checkbox-group
            v-decorator="decorators.identity"
            @change="getIsCoach"
          >
            <a-checkbox
              v-for="(item, index) in identitys"
              :key="index"
              :value="+item.value"
            >
              {{ item.label }}
            </a-checkbox>
          </a-checkbox-group>
        </st-form-item>
      </a-col>
      <a-col :offset="1" :lg="10" :xs="22">
        <st-form-item label="部门" required>
          <department-select
            placeholder="请选择部门"
            style="width: 100%"
            useType="form"
            v-decorator="decorators.department_id"
          ></department-select>
        </st-form-item>
        <st-form-item label="工作性质">
          <a-select
            placeholder="请选择"
            v-decorator="decorators.nature_work"
            :options="nature_works"
          ></a-select>
        </st-form-item>
        <st-form-item label="系统角色" required>
          <a-select
            mode="multiple"
            placeholder="请选择"
            v-decorator="decorators.role_id"
          >
            <template v-for="item in roleList">
              <a-select-option :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </template>
          </a-select>
        </st-form-item>
        <st-form-item v-if="isShowLevel" required>
          <template slot="label">
            {{ $c('coach') }}等级
            <st-help-tooltip id="TSCE003" />
          </template>
          <coach-level-select
            :placeholder="`请选择${$c('coach')}等级`"
            style="width: 100%"
            useType="form"
            v-decorator="decorators.coach_level_id"
            @change="onChange"
          ></coach-level-select>
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
      <a-col :offset="1" :lg="10">
        <st-form-item label="系统权限">
          <a-checkbox
            @change="permissionChange"
            v-decorator="decorators.is_permission"
          >
            开通系统使用权限
          </a-checkbox>
        </st-form-item>
        <st-form-item label="登录账号" v-if="isChoosePermission">
          <a-input
            placeholder="6-18个字符，可使用字母、数字、下划线"
            v-decorator="decorators.account"
          ></a-input>
        </st-form-item>
        <st-form-item required label="登录密码" v-if="isChoosePermission">
          <a-input
            placeholder="6-15个字符，区分大小写"
            type="password"
            v-decorator="decorators.password"
          ></a-input>
        </st-form-item>
        <st-form-item required label="确认密码" v-if="isChoosePermission">
          <a-input
            placeholder="请再次填写密码"
            type="password"
            v-decorator="decorators.repeat_password"
          ></a-input>
        </st-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="8">
      <a-col :offset="1">
        <st-form-item labelFix>
          <st-button @click="goNext" :loaidng="loading.addStaff" type="primary">
            保存，继续填写细信息
          </st-button>
        </st-form-item>
      </a-col>
    </a-row>
  </st-form>
</template>
<script>
import { UserService } from '@/services/user.service'
import { MessageService } from '@/services/message.service'
import { AddService } from '../add.service'
import CoachLevelSelect from '@/views/biz-components/staff/coach-level-select'
import ShopSelect from '@/views/biz-components/shop/shop-select'
import { SEX } from '@/constants/common/form'
import { PatternService } from '@/services/pattern.service'
import { ruleOptions } from '../staff-form.config.ts'
import DepartmentSelect from '@/views/biz-components/staff/department-select'
import FaceUpload from '@/views/biz-components/face-upload/face-upload'
import StImageUpload from '@/views/components/image-upload#/image-upload.vue'
import { cloneDeep } from 'lodash-es'
export default {
  name: 'StaffDetailBasics',
  bem: {
    addBasicsInfo: 'page-shop-staff-add-detail'
  },
  serviceInject() {
    return {
      pattern: PatternService,
      userService: UserService,
      message: MessageService,
      addService: AddService
    }
  },
  rxState() {
    return {
      loading: this.addService.loading$,
      shop: this.userService.shop$,
      id_types: this.userService.getOptions$('staff.id_type'),
      nature_works: this.userService.getOptions$('staff.nature_work'),
      identitys: this.userService.getOptions$('staff.identity')
    }
  },
  components: {
    ShopSelect,
    CoachLevelSelect,
    DepartmentSelect,
    FaceUpload,
    StImageUpload
  },
  props: {
    roleList: {
      type: Array
    },
    codeList: {
      type: Array
    },
    department: {
      type: Array
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      SEX,
      fileList: [],
      faceList: [],
      isChoosePermission: false,
      isAdd: [],
      addflag: true,
      isShowLevel: false, // 是否展示教练等级

      treeExpandedKeys: [],
      value: undefined,
      id_type: 1,
      country_code_id: 37
    }
  },
  mounted() {
    this.form.setFieldsValue({
      shop_id: this.shop.id
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
    getIsCoach(data) {
      this.isShowLevel = data.includes(4)

      if (!this.isShowLevel) {
        this.$emit('deletStep')
        this.addflag = false
      } else {
        if (this.addflag) return
        this.$emit('addStep')
        this.addflag = true
      }
    },
    permissionChange(e) {
      this.isChoosePermission = e.target.checked
    },
    onChange(value) {
      console.log('选择部门', value)
      this.value = value
    },
    onSelectIdtype(e) {
      console.log('证件选择', e)
    },
    // 继续填写跳转到编辑
    goNext(e) {
      e.preventDefault()
      this.form.validate().then(values => {
        this.submit(values, 1)
      })
    },
    /**
     * saveOrgoNext 0 保存 1 跳转到编辑
     */
    submit(data) {
      data.is_permission = +this.isChoosePermission
      data.entry_date = moment(data.entry_date).format('YYYY-MM-DD')
      data.image_avatar = this.fileList[0] || {}
      data.image_face = this.faceList[0] || {}
      data.country_code_id = this.country_code_id
      data.id_type = this.id_type
      this.addService.addStaff(data).subscribe(res => {
        this.$router.push({
          name: 'shop-staff-edit',
          query: {
            id: res.staff_id,
            currentIndex: 1,
            isShowCoach:
              data.identity.includes(3) || data.identity.includes(4) ? 1 : 0
          }
        })
      })
    }
  }
}
</script>
