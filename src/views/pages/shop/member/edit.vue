<template>
  <st-panel app class="shop-member-edit">
    <st-form :form="form" @submit="save" class="page-add-container">
      <a-row :gutter="8">
        <a-col :lg="10" :xs="22" :offset="1">
          <st-form-item label="姓名" required>
            <a-input
              placeholder="支持中英文,不超过30个字"
              v-decorator="rules.member_name"
              maxLength="30"
            >
              <a-select
                @change="minorsChange"
                v-decorator="rules.is_minors"
                slot="addonAfter"
                style="min-width: 60px"
              >
                <a-select-option
                  v-for="(item, index) in minorsType"
                  :value="item.value"
                  :key="index"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-input>
          </st-form-item>
          <st-form-item label="手机号" required v-if="!isShowParent">
            <a-input-group compact>
              <a-select style="width:30%" v-model="country_prefix">
                <a-select-option
                  :value="code.code_id"
                  v-for="code in countryList.code_list"
                  :key="code.code_id"
                >
                  +{{ code.phone_code }}
                </a-select-option>
              </a-select>
              <a-input
                style="width:70%"
                placeholder="请输入手机号"
                v-decorator="rules.mobile"
              />
            </a-input-group>
          </st-form-item>
          <st-form-item label="家长手机号" v-if="isShowParent" required>
            <a-input-group compact>
              <a-select style="width:30%" v-decorator="rules.country_prefix">
                <a-select-option
                  :value="code.code_id"
                  v-for="code in countryList.code_list"
                  :key="code.code_id"
                >
                  +{{ code.phone_code }}
                </a-select-option>
              </a-select>
              <a-input
                style="width:70%"
                placeholder="请输入手机号"
                @change="getParentInfo"
                v-decorator="rules.parent_mobile"
              />
            </a-input-group>
          </st-form-item>
          <st-form-item label="家长姓名" v-if="isShowParent" required>
            <a-input
              placeholder="支持中英文,不超过30个字"
              :disabled="isEditParent"
              v-decorator="rules.parent_username"
              maxLength="30"
            >
              <a-select
                v-decorator="rules.parent_user_role"
                slot="addonAfter"
                style="min-width: 60px"
              >
                <a-select-option
                  v-for="(item, index) in parentType"
                  :value="item.value"
                  :key="index"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-input>
          </st-form-item>
          <st-form-item label="备注">
            <st-textarea
              class="shop-member-edit-remark"
              :maxlength="300"
              :rows="3"
              v-decorator="rules.remark"
              placeholder="填写点什么吧"
            />
          </st-form-item>
        </a-col>
        <a-col :lg="10" :xs="22" :offset="1">
          <st-form-item label="用户人脸">
            <face-upload
              width="264px"
              height="264px"
              :list="faceList"
              placeholder="会员人脸信息"
            ></face-upload>
          </st-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="8">
        <a-col :offset="1" :lg="22">
          <st-hr></st-hr>
        </a-col>
      </a-row>

      <a-row :gutter="8">
        <a-col :lg="10" :xs="22" :offset="1">
          <st-form-item label="来源类别">
            <a-select
              placeholder="请选择来源类别"
              v-decorator="rules.register_type"
              @change="onChangCategory"
            >
              <a-select-option
                v-for="(item, index) in source_categorys"
                :key="index"
                :value="+item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </st-form-item>
          <st-form-item label="来源方式">
            <a-select
              placeholder="请选择来源方式"
              v-decorator="rules.register_way"
            >
              <template v-if="source_category === 1">
                <a-select-option
                  v-for="(item, index) in onlines"
                  :key="index"
                  :value="+item.value"
                  :disabled="+item.value | isOnlineDisabled"
                >
                  {{ item.label }}
                </a-select-option>
              </template>
              <template v-if="source_category === 2">
                <a-select-option
                  v-for="(item, index) in offlines"
                  :key="index"
                  :value="+item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </template>
            </a-select>
          </st-form-item>
          <st-form-item label="性别">
            <a-radio-group v-decorator="rules.sex">
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
          <st-form-item label="生日">
            <a-date-picker v-decorator="rules.birthday" style="width:100%" />
          </st-form-item>
          <st-form-item label="国籍">
            <a-select placeholder="请选择" v-decorator="rules.country_id">
              <a-select-option
                v-for="(item, index) in countryInfo"
                :key="index"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </st-form-item>
          <st-form-item label="民族">
            <a-select placeholder="请选择" v-decorator="rules.nation_id">
              <a-select-option
                v-for="(item, index) in nations"
                :key="index"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </st-form-item>
          <st-form-item label="学历">
            <a-select
              placeholder="请选择学历"
              v-decorator="rules.education_level"
            >
              <a-select-option
                v-for="(item, index) in educations"
                :key="index"
                :value="+item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </st-form-item>
          <st-form-item label="职业">
            <a-input placeholder="请输入职业" v-decorator="rules.jobs" />
          </st-form-item>
          <st-form-item label="收入水平">
            <a-input
              placeholder="请输入收入水平"
              v-decorator="rules.income_level"
            />
          </st-form-item>
          <st-form-item label="证件类型">
            <a-select
              v-decorator="rules.id_card_type"
              placeholder="请选择"
              @change="chooseType"
            >
              <a-select-option
                v-for="(item, index) in id_types"
                :key="index"
                :value="+item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </st-form-item>
          <st-form-item label="证件号">
            <a-input
              :placeholder="dateinit ? dateinit : '请输入身份证号码'"
              v-decorator="rules.id_card"
            />
          </st-form-item>
        </a-col>
        <a-col :lg="10" :xs="22" :offset="1">
          <st-form-item label="身高">
            <st-input-number
              v-decorator="rules.height"
              :float="true"
              placeholder="请输入身高"
            >
              <template slot="addonAfter">
                CM
              </template>
            </st-input-number>
          </st-form-item>
          <st-form-item label="体重">
            <st-input-number
              v-decorator="rules.weight"
              :float="true"
              placeholder="请输入体重"
            >
              <template slot="addonAfter">
                KG
              </template>
            </st-input-number>
          </st-form-item>
          <st-form-item label="健身目标">
            <a-input
              v-decorator="rules.fitness_goal"
              placeholder="请输入健身目标"
            />
          </st-form-item>
          <st-form-item label="健身等级">
            <a-rate v-decorator="rules.fitness_level" allowHalf />
          </st-form-item>
          <st-form-item label="婚姻状况">
            <a-select placeholder="请选择" v-decorator="rules.married_type">
              <a-select-option
                v-for="(item, index) in marry_status"
                :key="index"
                :value="+item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </st-form-item>
          <st-form-item label="子女状态">
            <a-select placeholder="请选择" v-decorator="rules.has_children">
              <a-select-option
                v-for="(item, index) in children_status"
                :key="index"
                :value="+item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </st-form-item>
          <st-form-item label="邮箱">
            <a-input placeholder="请输入邮箱" v-decorator="rules.email" />
          </st-form-item>
          <st-form-item label="家庭住址">
            <a-cascader
              :options="options"
              v-decorator="rules.cascader"
              :fieldNames="fieldNames"
              placeholder="请选择省/市/区/县"
            />
          </st-form-item>
          <st-form-item label="详细住址">
            <a-input
              placeholder="填写点什么吧"
              v-decorator="rules.living_address"
            ></a-input>
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
          <st-form-item labelWidth="88px" label-fix>
            <st-button
              :loading="loading.updateMemberEdit"
              type="primary"
              html-type="submit"
            >
              保存
            </st-button>
          </st-form-item>
        </a-col>
      </a-row>
    </st-form>
  </st-panel>
</template>
<script>
import { EditService } from './edit.service'
import { UserService } from '@/services/user.service'
import { RegionService } from '@/services/region.service'
import { MessageService } from '@/services/message.service'
import { PatternService } from '@/services/pattern.service'
import FaceUpload from '@/views/biz-components/face-upload/face-upload'
import { SEX } from '@/constants/common/form'
export default {
  bem: {
    edit: 'shop-member-edit'
  },
  components: {
    FaceUpload
  },
  serviceInject() {
    return {
      editService: EditService,
      userService: UserService,
      regionService: RegionService,
      messageService: MessageService,
      pattern: PatternService
    }
  },
  rxState() {
    return {
      info: this.editService.info$,
      loading: this.editService.loading$,
      source_categorys: this.userService.getOptions$('member.source_category'),
      onlines: this.userService.getOptions$('member.online'),
      offlines: this.userService.getOptions$('member.offline'),
      // FIXME: 会员使用的员工枚举，需和后端讨论后修改
      children_status: this.userService.getOptions$('staff.children_status'),
      marry_status: this.userService.getOptions$('staff.marry_status'),
      id_types: this.userService.getOptions$('staff.id_type'),
      educations: this.userService.getOptions$('staff.education'),
      sexs: this.userService.getOptions$('staff.sex'),
      countryInfo: this.editService.countryInfo$,
      nations: this.editService.nations$,
      countryList: this.editService.countryList$,
      minorsType: this.editService.minorsType$,
      parentType: this.editService.parentType$
    }
  },
  filters: {
    isOnlineDisabled(val) {
      return [1, 2, 3].includes(val)
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      SEX,
      dateinit: '',
      isShowParent: false,
      rules: {
        md: ['md'],
        remark: [
          'remark',
          {
            rules: [
              {
                max: 300,
                message: '支持输入至多300字的备注信息'
              }
            ]
          }
        ],
        member_name: [
          'member_name',
          {
            rules: [
              {
                required: true,
                message: '请输入姓名'
              }
            ]
          }
        ],
        country_prefix: ['country_prefix', { initialValue: 37 }],
        mobile: [
          'mobile',
          {
            rules: [
              {
                required: true,
                message: '请输入手机号',
                pattern: this.pattern.MOBILE
              }
            ]
          }
        ],
        // 来源渠道
        register_type: ['register_type'],
        // 来源方式
        register_way: ['register_way'],
        image_face: ['image_face'],

        sex: ['sex'],
        birthday: ['birthday'],
        country_id: ['country_id'],
        nation_id: ['nation_id'],
        education_level: ['education_level'],
        jobs: ['jobs'],
        income_level: ['income_level'],
        id_card_type: ['id_card_type'],
        id_card: [
          'id_card',
          {
            rules: [{ validator: this.idCardValidator }]
          }
        ],

        height: ['height', { rules: [{ validator: this.height_validator }] }],
        weight: ['weight', { rules: [{ validator: this.weight_validator }] }],
        fitness_goal: ['fitness_goal'],
        fitness_level: ['fitness_level'],
        married_type: ['married_type'],
        has_children: ['has_children'],
        email: [
          'email',
          {
            rules: [
              { message: '请输入正确的邮箱地址', pattern: this.pattern.EMAIL }
            ]
          }
        ],
        cascader: ['cascader'],
        living_address: ['living_address'],
        is_minors: [
          'is_minors',
          {
            rules: [
              {
                required: true
              }
            ],
            initialValue: 0
          }
        ],
        parent_username: [
          'parent_username',
          {
            rules: [
              {
                required: true,
                message: '请输入家长姓名'
              }
            ]
          }
        ],
        parent_mobile: [
          'parent_mobile',
          {
            rules: [
              {
                required: true,
                message: '请输入手机号',
                pattern: this.pattern.MOBILE
              }
            ]
          }
        ],
        parent_user_role: ['parent_user_role', { initialValue: 1 }]
      },
      options: [],
      fieldNames: { label: 'name', value: 'id', children: 'children' },
      faceList: [],
      country_prefix: 37,
      source_category: -1,
      isEditParent: false
    }
  },
  methods: {
    minorsChange(val) {
      this.isShowParent = val
      if (!val) {
        this.form.setFieldsValue({
          mobile: ''
        })
      }
    },
    getParentInfo(e) {
      setTimeout(() => {
        this.form.validateFields(['parent_mobile']).then(values => {
          if (values.parent_mobile) {
            this.getParentInfoByPhone(values.parent_mobile)
          }
        })
      })
    },
    getParentInfoByPhone(phone) {
      let query = {
        mobile: phone
      }
      return this.editService.getParentInfoByPhone(query).subscribe(res => {
        if (res.exists) {
          this.isEditParent = true
          this.form.setFieldsValue({
            parent_username: res.info.member_name
          })
        } else {
          this.isEditParent = false
          this.form.setFieldsValue({
            parent_username: ''
          })
        }
      })
    },
    idCardValidator(rule, value, callback) {
      const type = this.form.getFieldValue('id_card_type')
      if (type === 1 && value && !this.pattern.ID.test(value)) {
        callback('请填写正确的身份证号')
      } else if (type === 2 && value && !this.pattern.PASSPORT.test(value)) {
        callback('请填写正确的护照号码')
      } else {
        callback()
      }
    },
    height_validator(rule, value, callback) {
      if (value && (+value < 20 || +value > 250)) {
        // eslint-disable-next-line
        callback('请输入正确身高，范围20~250cm')
      } else {
        // eslint-disable-next-line
        callback()
      }
    },
    weight_validator(rule, value, callback) {
      if (value && (+value < 10 || +value > 200)) {
        // eslint-disable-next-line
        callback('请输入正确体重，范围10~200kg')
      } else {
        // eslint-disable-next-line
        callback()
      }
    },
    // 来源方式发生改变
    onChangCategory(event) {
      this.source_category = event
    },
    chooseType(e) {
      let { tip1, tip2 } = {
        tip1: '请输入身份证号码',
        tip2: '请输入护照号码'
      }
      e === 1 ? (this.dateinit = tip1) : (this.dateinit = tip2)
      // 重置证件号
      this.form.setFieldsValue({ id_card: '' })
    },
    save(e) {
      e.preventDefault()
      this.form.validateFields().then(values => {
        console.log('values', values)
        values.birthday = values.birthday
          ? values.birthday.format('YYYY-MM-DD')
          : ''

        if (values.cascader && values.cascader.length > 0) {
          const cascader_name = this.getDistrictInfo(values.cascader)
          values.province_id = values.cascader[0]
          values.province_name = cascader_name.province_name
          values.city_id = values.cascader[1]
          values.city_name = cascader_name.city_name
          values.district_id = values.cascader[2]
          values.district_name = cascader_name.district_name
        }
        // 身份前缀
        values.id_card_type = values.id_card_type
        // 人脸信息
        values.image_face = this.faceList[0] || {}
        // 手机前缀
        values.height = values.height || undefined
        values.weight = values.weight || undefined
        values.album_id = this.info.album_id // 这个给后端快捷找到相册使用，前端不需要处理使用
        delete values.cascader
        this.editService.updateMemberEdit(this.id, values).subscribe(res => {
          this.messageService.success({ content: '修改成功' })
          this.$router.push({
            name: 'shop-member-info-basic',
            query: {
              id: this.$searchQuery.id
            }
          })
        })
      })
    },
    getDistrictInfo(cascader = []) {
      const province = this.options.filter(item => item.id === cascader[0])
      const city = province[0].children.filter(item => item.id === cascader[1])
      const district = city[0].children.filter(item => item.id === cascader[2])
      return {
        province_name: province[0].name,
        city_name: city[0].name,
        district_name: district[0] ? district[0].name : ''
      }
    },
    setEditInfo(obj) {
      this.isShowParent = !!obj.is_minors
      const cascader = []
      if (obj.province_id) {
        cascader.push(obj.province_id)
      }
      if (obj.city_id) {
        cascader.push(obj.city_id)
      }
      if (obj.district_id) {
        cascader.push(obj.district_id)
      }
      this.$nextTick(function() {
        this.form.setFieldsValue({
          member_name: obj.member_name,
          sex: +obj.sex || undefined,
          country_id: +obj.country.id || undefined,
          nation_id: +obj.nation.id || undefined,
          birthday: obj.birthday ? moment(obj.birthday) : null,
          education_level: +obj.education_level || undefined,
          id_card_type: +obj.id_card_type || undefined,
          height: obj.height || '',
          weight: +obj.weight === 0 ? '' : +obj.weight,
          jobs: obj.jobs,
          id_card: obj.id_card,
          income_level: obj.income_level,
          married_type: +obj.married_type || undefined,
          fitness_goal: obj.fitness_goal,
          has_children: +obj.has_children || undefined,
          register_type: +obj.register_type || undefined,
          register_way: +obj.register_way || undefined,
          fitness_level: obj.fitness_level,
          email: obj.email,
          mobile: obj.mobile,
          wechat: obj.wechat,
          cascader: cascader.length > 0 ? cascader : undefined,
          country_prefix: +obj.country_prefix || undefined,
          living_address: obj.living_address,
          is_minors: obj.is_minors,
          parent_username: obj.parent_info.username,
          parent_mobile: obj.parent_info.mobile,
          parent_user_role: obj.parent_user_role,
          remark: obj.remark
        })
      })

      this.id = obj.id
      if (obj.image_face && obj.image_face.image_id) {
        this.faceList = [obj.image_face]
      } else {
        this.faceList = []
      }
      this.source_category = +obj.register_type
    }
  },
  mounted() {
    const regions = window.localStorage.getItem('regionTree')
    if (!regions) {
      this.regionService.getRegions().subscribe(() => {
        this.options = JSON.parse(window.localStorage.getItem('regionTree'))
      })
    } else {
      this.options = JSON.parse(window.localStorage.getItem('regionTree'))
    }
    this.editService.serviceInit(this.$searchQuery.id).subscribe(res => {
      setTimeout(() => {
        this.setEditInfo(this.info)
        this.form.validateFields()
        this.getParentInfo()
      })
    })
  }
}
</script>
