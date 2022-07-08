<template>
  <div class="create-commodity-container">
    <h1>{{commodityId?'编辑商品':'新增商品'}}</h1>
    <Divider></Divider>
    <Row :style="{ 'padding-top': '20px' }">
      <Col :xs="{ span: 16, offset: 4 }" :lg="{ span: 12, offset: 6 }">
        <Form ref="formItem" :model="formItem" :rules="formValidate" :label-width="100">
          <FormItem label="商品名称：" prop="name">
            <Input v-model="formItem.name" :maxlength="80" placeholder="请输入商品名称"></Input>
          </FormItem>
          <FormItem label="商品Code：" prop="code">
            <Input v-model="formItem.code" :maxlength="10" :disabled="!!commodityId" placeholder="请输入商品Code"></Input>
          </FormItem>
          <!-- <FormItem label="商品图片：" prop="code">
            <Input v-model="formItem.code" :maxlength="10" placeholder="请输入商品Code"></Input>
          </FormItem>-->
          <FormItem label="商品类别：" prop="category">
            <Select v-model="formItem.category" placeholder="请选择商品类别">
              <Option
                v-for="item in commodityCategoryMap"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="是否有货：">
            <i-switch size="large" v-model="formItem.status" @on-change="changeStatus">
              <span slot="open">有货</span>
              <span slot="close">无货</span>
            </i-switch>
          </FormItem>
          <FormItem label="进价：" prop="importPrice">
            <Input v-model="formItem.importPrice" :maxlength="10" placeholder="请输入商品进价"></Input>
          </FormItem>
          <FormItem label="批发价：" prop="exportPrice">
            <Input v-model="formItem.exportPrice" :maxlength="10" placeholder="请输入商品批发价"></Input>
          </FormItem>
          <FormItem label="商家电话：">
            <Input v-model="formItem.mobile" :maxlength="11" :minlength="11" type="number" placeholder="请输入商品批发价"></Input>
          </FormItem>
          <FormItem>
            <Button
              :to="{ name: 'commodityList', params: { type: 'all'} }"
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
export default class CreateCommodity extends Vue {
  // 提交按钮状态
  private sending = false;

  private commodityId: string = ""; // 商品id

  // 表单数据
  private formItem: any = {
    name: "",
    code: "",
    category: "",
    importPrice: "",
    exportPrice: "",
    status:false,
    mobile: ''
  };

  // 初始化商品名称
  private commodityName = "";

  // 商品分类
  private commodityCategoryMap: any = [
    {
      value: "kickenShops",
      label: "厨房用品"
    },
    {
      value: "serverShops",
      label: "生活用品"
    },
    {
      value: "steelShops",
      label: "不锈钢与铁制品"
    }
  ];

  // 表单校验规则
  private formValidate = {
    name: [{ required: true, message: "商品名称不能为空", trigger: "blur" }],
    importPrice: [
      { required: true, message: "进价不能为空", trigger: "blur" },
      {
        type: "string",
        pattern: /^([1-9]\d*|(0\.\d{1,2}|[1-9]\d*\.\d{1,2}))$/,
        message: "输入格式不正确"
      }
    ],
    // exportPrice: [
    //   { required: true, message: "批发价不能为空", trigger: "blur" },
    //   {
    //     type: "string",
    //     pattern: /^([1-9]\d*|(0\.\d{1,2}|[1-9]\d*\.\d{1,2}))$/,
    //     message: "输入格式不正确"
    //   }
    // ],
    category: [{ required: true, message: "商品分类不能为空", trigger: "blur" }],
    code: [{ required: true, message: "商品code不能为空", trigger: "blur" }],
  };

  // 改变商品的状态
  private changeStatus(value:any) {
    console.log(value,111111)
  }

  // 获取某商品的信息
  private getShopDetail() {
    const params = {
      code: this.commodityId
    };
    this.$store.dispatch("getGoodsList", qs.stringify(params)).then((res: any) => {
      const result = (res.result.rows || [])[0] || {}
      this.formItem.name = result.name;
      this.formItem.code = result.code;
      this.commodityName = result.name;
      this.formItem.status = result.status;
      this.formItem.category = result.category;
      this.formItem.importPrice = result.importPrice + "";
      this.formItem.exportPrice = result.exportPrice + "";
      this.formItem.mobile = result.mobile;
    });
  }

  private created() {
    this.commodityId = this.$route.params.commodityId;
    if (this.commodityId) {
      this.getShopDetail();
    }
  }

  // 表单提交
  private handleSubmit() {
    console.log(this.formItem, "222222");
    const form: any = this.$refs.formItem;
    form
      .validate()
      .then((res: boolean) => {
        // 校验成功否
        return new Promise((resolve, reject) => {
          res ? resolve() : reject();
        });
      })
      // .then(() => {
      //   if (this.commodityName === this.formItem.name) {
      //     return true;
      //   }
      //   const params = {
      //     name: this.formItem.name
      //   };
      //   return this.$store.dispatch("judgeOne", params);
      // })
      .then(() => {
        // 按钮显示 loading 状态
        this.sending = true;

        // 调接口
        const params: any = {
          ...this.formItem
        };
        if (this.commodityId) {
          params.code = this.commodityId;
          return this.$store.dispatch("editGoods",qs.stringify(params));
        } else {
          return this.$store.dispatch("addGoods", qs.stringify(params));
        }
      })
      .then(() => {
        if (this.commodityId) {
          this.$Message.success("商品修改成功");
        } else {
          this.$Message.success("商品创建成功");
        }
        // 成功则跳转到列表页面
        this.$router.push({ name: "commodityList" });
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