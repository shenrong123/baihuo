<template>
  <Modal
    :value="value"
    @input="(data) => $emit('input', data)"
    :title="title"
    @on-visible-change="visibleChanged"
  >
    <Row>
      <Col span="20" offset="2">
        <Form
          :label-width="130"
          ref="formItem"
          :model="formItem"
          :rules="formValidate"
        >
          <FormItem label="商品名称：">
            <span>{{ formItem.name }}</span>
          </FormItem>
          <FormItem label="商品类别：">
            <span>{{ shopType[formItem.category] }}</span>
          </FormItem>
          <FormItem label="商品批发价：">
            <span>{{ formItem.exportPrice }}</span>
          </FormItem>
          <FormItem label="商品成交价格：" prop="dealPrice">
            <Input
              v-model="formItem.dealPrice"
              placeholder="请输入商品成交价"
              @on-change="changeDealPrice"
            ></Input>
          </FormItem>
          <FormItem label="商品数量：">
            <InputNumber
              :max="9999"
              :min="1"
              v-model="formItem.number"
            ></InputNumber>
          </FormItem>
        </Form>
      </Col>
    </Row>
    <div slot="footer">
      <Button type="text" size="large" @click="handleCancel">取消</Button>
      <Button type="primary" size="large" @click="handleSubmit">提交</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import qs from "qs";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class CartMall extends Vue {
  @Prop(Boolean) private value!: boolean; // 接收父组件传值 是否显示弹窗
  @Prop() private shopInfo!: any; // 客户ID
  private title: string = "购物车";
  private shopType: any = {
    kickenShops: "厨房用品",
    serverShops: "生活用品",
    steelShops: "不锈钢与铁制品",
  };

  // 获取用户信息
  get userInfo() {
    var items: any = sessionStorage.getItem("userInfo");
    return JSON.parse(items);
  }

  // 表单校验规则
  private formValidate = {
    dealPrice: [
      { required: true, message: "进价不能为空", trigger: "blur" },
      {
        type: "string",
        pattern: /^([1-9]\d*|(0\.\d{1,2}|[1-9]\d*\.\d{1,2}))$/,
        message: "输入格式不正确",
      },
    ],
  };

  private formItem: any = {
    status: null,
    name: "",
    checked: false,
    code: "",
    category: "",
    exportPrice: "",
    shopId: "",
    dealPrice: "",
    number: 1,
  };

  // 显示状态改变时
  private visibleChanged(visiablity: boolean) {
    if (visiablity) {
      this.formItem.name = this.shopInfo.name;
      this.formItem.code = this.shopInfo.code;
      this.formItem.category = this.shopInfo.category;
      this.formItem.exportPrice = this.shopInfo.exportPrice;
      this.formItem.dealPrice = this.shopInfo.exportPrice + "";
      this.formItem.shopId = this.shopInfo.goodId;
      this.formItem.status = this.shopInfo.status;
    }
    this.formItem.number = 1;
  }

  // 成交价改变时
  private changeDealPrice(event: any) {
    this.formItem.dealPrice = event.target.value;
  }

  // 取消
  private handleCancel() {
    const form: any = this.$refs.formItem;
    // 提交成功后重置表单为空
    form.resetFields();
    this.$emit("input", false); // 关闭弹窗
  }

  // 下一步
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
        const params = {
          customerId: this.userInfo.userId,
          truename: this.userInfo.truename,
          orders: { ...this.formItem },
        };
        return this.$store.dispatch("addOrderList", qs.stringify(params));
      })
      .then(() => {
        this.$Message.success("商品添加成功");
        const params = {
          customerId: this.userInfo.userId,
        };
        setTimeout(() => {
          this.$store.dispatch("shopmallLists", {});
        }, 2000);

        this.$emit("input", false); // 关闭弹窗
      });
  }
}
</script>
