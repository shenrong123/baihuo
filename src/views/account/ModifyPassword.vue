<template>
  <div class="list-page-container modify-passwprd-container">
    <div class="title-box">
      <h1>修改密码</h1>
      <Divider></Divider>
    </div>
    <row type="flex" justify="center" class="code-roe-bg info-content-box">
      <Col
        :xs="{ span: 22, offset: 1 }"
        :md="{ span: 16, offset: 2 }"
        :lg="{ span: 13, offset: 1 }"
      >
        <Form ref="formItem" :model="formItem" :rules="formValidate" :label-width="120">
          <FormItem label="请输入旧密码：" prop="oldPassword">
            <Input
              :type="isShowPwd.oldPassword ? 'text' : 'password'"
              v-model="formItem.oldPassword"
              placeholder="请输入旧密码"
            >
              <Icon
                :type="isShowPwd.oldPassword ? 'ios-eye' : 'ios-eye-off'"
                slot="suffix"
                @click="toggleShowPwd('oldPassword')"
                class="icon-pwd"
              />
            </Input>
          </FormItem>
          <FormItem label="设置新密码：" prop="newPassword">
            <Input
              :type="isShowPwd.newPassword ? 'text' : 'password'"
              v-model="formItem.newPassword"
              placeholder="请输入新密码"
            >
              <Icon
                :type="isShowPwd.newPassword ? 'ios-eye' : 'ios-eye-off'"
                slot="suffix"
                @click="toggleShowPwd('newPassword')"
                class="icon-pwd"
              />
            </Input>
          </FormItem>
          <FormItem label="确认新密码：" prop="newPasswordChecked">
            <Input
              :type="isShowPwd.newPasswordChecked ? 'text' : 'password'"
              v-model="formItem.newPasswordChecked"
              :maxlength="12"
              placeholder="请输入新密码"
            >
              <Icon
                :type="isShowPwd.newPasswordChecked ? 'ios-eye' : 'ios-eye-off'"
                slot="suffix"
                @click="toggleShowPwd('newPasswordChecked')"
                class="icon-pwd"
              />
            </Input>
          </FormItem>
          <FormItem>
            <Row type="flex" justify="end">
              <Col>
                <Button type="primary" :loading="sending" @click="handleSubmit()">
                  <span v-if="!sending">确认</span>
                  <span v-else>提交中...</span>
                </Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Col>
    </row>
  </div>
  <!-- 编辑头像对话框 -->
</template>

<style lang="less">
.modify-passwprd-container {
  .info-content-box {
    padding: 50px;
    border: solid 1px #dde6e8;
    background: #f4f7f7;
  }
  .icon-pwd {
    cursor: pointer;
  }
}
</style>

<script lang="ts">
import { Form } from 'iview';
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import qs from 'qs';

interface PwdShowType {
  [index: string]: boolean;
}

@Component({
  components: {
  }
})
export default class AccountInfo extends Vue {
  private formRef: any = {}; // 表单验证

  private submitOk: string = "确定";
  private submitLoading: string = "提交中...";

  // 当前用户所在的id
  get accountId() {
    return this.$store.state.account.userInfo.principal.id;
  }

  // 是否显示密码
  private isShowPwd: PwdShowType = {
    oldPassword: false,
    newPassword: false,
    newPasswordChecked: false
  };

  // 表单数据
  private formItem = {
    oldPassword: "",
    newPassword: "",
    newPasswordChecked: ""
  };
  // 表单校验规则
  private formValidate = {
    oldPassword: [{ required: true, message: "不能为空" }],
    newPassword: [
      { required: true, message: "不能为空" },
      { validator: this.validateNewPass }
    ],
    newPasswordChecked: [
      { required: true, message: "不能为空" },
      { validator: this.validateNewPassChecked }
    ]
  };

  // 提交按钮状态
  private sending = false;
  // 是否显示密码
  private toggleShowPwd(type: string) {
    this.isShowPwd[type] = !this.isShowPwd[type];
  }

  // 校验新密码
  private validateNewPass(rule: any, value: any, callback: any) {
    if (this.formItem.newPasswordChecked) {
      const formRef = this.$refs.formItem as Form;
      formRef.validateField("newPasswordChecked");
    }
    callback();
  }

  // 两个新密码是否一样的校验
  private validateNewPassChecked(rule: any, value: any, callback: any) {
    if (value !== this.formItem.newPassword) {
      callback(new Error("两次密码输入不一致！"));
    }
    callback();
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
        const { oldPassword, newPassword } = this.formItem;
        const params = {
          userName: JSON.parse(sessionStorage.getItem("userInfo") as string).userName,
          userId: JSON.parse(sessionStorage.getItem("userInfo") as string).userId,
          oldPassword: oldPassword,
          password: newPassword
        };
        return this.$store.dispatch("editAccount", qs.stringify(params));
      })
      .then(() => {
        console.log("success");
        this.$Modal.success({
          content: `密码修改成功`,
          onOk: () => {
            // 提交成功后重置表单为空
            form.resetFields();
          }
        });
      })
      // .catch(() => {
      //   // 失败弹错
      //   this.$Message.error('Fail!');
      // })
      .finally(() => {
        // loading 状态还原
        this.sending = false;
      });
  }
}
</script>
