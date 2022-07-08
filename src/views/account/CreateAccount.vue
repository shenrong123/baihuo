<template>
  <div class="create-commodity-container">
    <h1>{{accountId?'编辑用户':'新增用户'}}</h1>
    <Divider></Divider>
    <Row :style="{ 'padding-top': '20px' }">
      <Col :xs="{ span: 16, offset: 4 }" :lg="{ span: 12, offset: 6 }">
        <Form ref="formItem" :model="formItem" :rules="formValidate" :label-width="100">
          <FormItem label="用户名" prop="userName">
            <Input v-model="formItem.userName" :maxlength="80" :disabled="!!accountId" placeholder="请输入用户命"></Input>
          </FormItem>``
          <FormItem label="真实姓名" prop="truename">
            <Input v-model="formItem.truename" :maxlength="80" placeholder="请输入真实姓名"></Input>
          </FormItem>
          <FormItem label="密码：" prop="password">
            <Input v-model="formItem.password" :maxlength="10" placeholder="请输入密码"></Input>
          </FormItem>
          <!-- <FormItem label="商品图片：" prop="code">
            <Input v-model="formItem.code" :maxlength="10" placeholder="请输入商品Code"></Input>
          </FormItem>-->
          <FormItem label="角色类别：" prop="category">
            <Select v-model="formItem.category" placeholder="请选择角色类别" :disabled="userInfo.userName === formItem.userName">
              <Option
                v-for="item in roleType"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="手机号码：" prop="mobileNo">
            <Input v-model="formItem.mobileNo" :maxlength="11" placeholder="请输入11位手机号码"></Input>
          </FormItem>
          <FormItem>
            <Button
              :to="{ name: 'accountList', params: { type: 'all'} }"
              style="margin-right: 8px"
            >取消</Button>
            <Button type="primary" :loading="sending" @click="handleSubmit()">
              <span v-if="!sending">提交</span>
              <span v-else>提交中...</span>
            </Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
import qs from 'qs';
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class CreateAccount extends Vue {
  // 获取用户信息
  get userInfo() {
    var items: any = sessionStorage.getItem("userInfo");
    return JSON.parse(items);
  }

  // 提交按钮状态
  private sending = false;

  private accountId: string = ""; // 商品id

  // 表单数据
  private formItem: any = {
    userName: "",
    password: "",
    truename:"",
    category: "",
    mobileNo: ""
  };

  // 初始化用户名
  private accountName = "";

  // 商品分类
  private roleType: any = [
    {
      value: "admin",
      label: "管理员"
    },
    {
      value: "user",
      label: "普通用户"
    }
  ];

  // 表单校验规则
  private formValidate = {
    userName: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
    truename: [{ required: true, message: "真实姓名不能为空", trigger: "blur" }],
    mobileNo: [
      { required: true, message: "电话号码不能为空", trigger: "blur" },
      {
        type: "string",
        pattern: /^1[0-9]{10}$/,
        message: "手机号格式输入错误！"
      }
    ],
    category: [
      { required: true, message: "角色分类不能为空", trigger: "blur" }
    ],
    password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
  };

  // 获取某商品的信息
  private getAccountDetail() {
    const params = {
      userId: this.accountId
    };
    this.$store.dispatch("accountList", qs.stringify(params)).then((res: any) => {
      const result = res.result.rows[0]
      this.formItem.userName = result.userName;
      this.formItem.truename = result.truename;
      this.formItem.password = result.password+'';
      this.accountName = result.userName;
      this.formItem.category = result.category;
      this.formItem.mobileNo = result.mobileNo;
    });
  }

  private created() {
    this.accountId = this.$route.params.accountId;
    if (this.accountId) {
      this.getAccountDetail();
    }
  }

  // 表单提交
  private handleSubmit() {
    const form: any = this.$refs.formItem;
    form
      .validate()
      .then((res: boolean) => {
        // 校验成功否
        return new Promise((resolve, reject) => {
          res ? resolve() : reject();
        });
      })
      .then(() => {
        // 按钮显示 loading 状态
        this.sending = true;

        // 调接口
        const params: any = {
          ...this.formItem
        };
        if (this.accountId) {
          params.userId = this.accountId;
          return this.$store.dispatch("editAccount", qs.stringify(params));
        } else {
          return this.$store.dispatch("addAccount", qs.stringify(params));
        }
      })
      .then(() => {
        if (this.accountId) {
          this.$Message.success("用户修改成功");
        } else {
          this.$Message.success("用户创建成功");
        }
        // 成功则跳转到列表页面
        this.$router.push({ name: "accountList" });
      })
      .catch(() => {
        // 失败弹错
        console.log("fail");
      })
      .finally(() => {
        // loading 状态还原
        this.sending = false;
      });
  }
}
</script>