<template>
  <div class="login-container">
    <Row style="margin-top: 25vh;">
      <Col
        :xs="{ span: 16, offset: 4 }"
        :sm="{ span: 12, offset: 6 }"
        :md="{ span: 8, offset: 8 }"
        :lg="{ span: 6, offset: 9 }"
      >
        <Card>
          <h1>江北人百货配送中心</h1>
          <Divider></Divider>
          <Form
            ref="formItem"
            :model="formItem"
            :rules="formValidate"
            @submit="login()"
            class="loginCard"
          >
            <!-- <FormItem label="用户名："> -->
            <FormItem prop="username">
              <p style="width:70px">用户名：</p>
              <Input v-model="formItem.username" icon="md-person" placeholder="请输入用户名"></Input>
            </FormItem>
            <!-- <FormItem label="密码："> -->
            <FormItem prop="password">
              <p style="width:70px">密&nbsp;&nbsp;码：</p>
              <Input
                :type="showPassword ? 'text' : 'password'"
                v-model="formItem.password"
                placeholder="请输入密码"
              >
                <Icon
                  :type="showPassword ? 'ios-eye' : 'ios-eye-off'"
                  slot="suffix"
                  @click="toggleShowPwd"
                  class="icon-pwd"
                />
              </Input>
            </FormItem>
            <Button type="primary" long :loading="sending" @click="login()">
              <span v-if="!sending">登录</span>
              <span v-else>登录中...</span>
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<style>
.login-container {
  text-align: center;
}
.login-container .loginCard .ivu-form-item .ivu-form-item-content {
  display: flex !important;
}
.login-container
  .loginCard
  .ivu-form-item
  .ivu-form-item-content
  .ivu-form-item-error-tip {
  margin-left: 70px;
}
.icon-pwd {
  cursor: pointer;
}
</style>


<script lang="ts">
import qs from 'qs';
import { Component, Prop, Vue } from "vue-property-decorator";
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
    // HelloWorld,
  }
})
export default class Login extends Vue {
  private showPassword: boolean = false; // 默认密码加密

  // 登陆按钮状态
  private sending = false;

  // 表单数据
  private formItem = {
    username: "shenrong",
    password: "123456"
  };

  // 表单校验规则
  private formValidate = {
    username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
    password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
  };

  // 显示或加密密码
  private toggleShowPwd() {
    this.showPassword = !this.showPassword;
  }

  // 登录表单提交
  private login() {
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
        return this.$store.dispatch("login", qs.stringify({
          userName: this.formItem.username,
          password: this.formItem.password
        }));
      })
      .then((res: any) => {
        // 登录时候的订单列表的选择列显示清空
        sessionStorage.setItem("userInfo", res.result);
        localStorage.setItem('token', res.token)
        if (res.result.category === "admin") {
          this.$router.push({ name: "commodityList" });
        } else {
          this.$router.push({ name: "shopsList" });
        }
      })
      .catch(() => {
        // 失败弹错
        // this.$Message.error('Fail!');
        console.log("login fail");
      })
      .finally(() => {
        // loading 状态还原
        this.sending = false;
      });
  }
}
</script>
