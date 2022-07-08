<template>
  <div class="list-page-container">
    <!-- 标题等 -->
    <div class="title-box">
      <h1>用户列表</h1>
      <div class="actions">
        <!-- 新增商品按钮只有财务人员可见可操作。 -->
        <Button type="primary" :to="{ name: 'createAccount' }">新增用户</Button>
        <Button @click="refresh">刷新</Button>
      </div>
    </div>
    <!-- 筛选 -->
    <div class="search-box">
      <Select v-model="filterType">
        <Option
          v-for="item in filterTypeList"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
      <Input v-model="filterValue" placeholder="请输入需要搜索的内容" />
      <Button
        @click="refresh"
        style="background: #121e26; color: #fff; margin-right: 10px"
        >搜索</Button
      >
      <Button @click="clear">清空</Button>
    </div>
    <!-- 表格 -->
    <Table
      stripe
      :columns="tableFields"
      :data="accountList"
      :loading="loading"
    ></Table>

    <!-- 分页 -->
    <Page
      :total="totalCount"
      show-total
      show-elevator
      :page-size="pageSize"
      :current="pageIndex"
      @on-change="onPageChanged"
    />
  </div>
</template>

<script lang="ts">
import qs from "qs";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class AccountList extends Vue {
  // 获取用户信息
  get userInfo() {
    var items: any = sessionStorage.getItem("userInfo");
    return JSON.parse(items);
  }

  private roleType: any = {
    admin: "管理员",
    user: "用户",
  }; // 角色类别

  private filterValue: string = ""; // 搜索内容
  private filterType: string = ""; // 搜索条件

  // 搜索类
  private filterTypeList = [
    { value: "userName", label: "用户名" },
    { value: "truename", label: "真实姓名" },
    { value: "mobileNo", label: "手机号码" },
  ];

  // 表结构
  private tableFields = [
    { title: "用户名", key: "userName" },
    { title: "真实姓名", key: "truename" },
    { title: "密码", key: "password" },
    {
      title: "角色",
      key: "category",
      render: (h: any, params: any) => {
        return h(
          "div",
          params.row.category === "admin" ? "管理员" : "普通用户"
        );
      },
    },
    { title: "手机号码", key: "mobileNo" },
    {
      title: "操作",
      key: "date",
      width: 160,
      render: (h: any, params: any) => {
        const { userId, userName } = params.row;
        return h("div", [
          h(
            "Button",
            {
              props: {
                type: "text",
                size: "small",
                to: { name: "modifyAccount", params: { accountId: userId } },
              },
            },
            "编辑"
          ),
          h(
            "Button",
            {
              props: {
                type: "text",
                size: "small",
                disabled: this.userInfo.userName === userName,
              },
              on: {
                click: () => {
                  this.deleteAccount(userId, userName);
                },
              },
            },
            "删除"
          ),
        ]);
      },
    },
  ];

  // 数据加载状态
  private loading = true;

  // 列表数据
  private accountList: any = [];

  // 总数
  private totalCount = 0;

  // 当前页码
  private pageIndex = 1;

  // 每页条数
  private pageSize = 10;

  // 清空搜索内容
  private clear() {
    this.filterValue = "";
  }

  // 获取用户列表
  private getAccountlist() {
    const params: any = {
      page: this.pageIndex,
      size: this.pageSize,
    };
    if (this.filterType && this.filterValue) {
      params[this.filterType] = this.filterValue;
    }
    this.$store
      .dispatch("accountList", qs.stringify(params))
      .then((res: any) => {
        this.accountList = res.result.rows;
        this.totalCount = res.result.count;
        this.loading = false;
        console.log(res, "--login--");
      });
  }

  // 删除用户
  private deleteAccount(id: any, name: any) {
    const params = {
      userId: id,
    };
    this.$Modal.confirm({
      title: "删除确认",
      content: `是否删除${name}该用户？`,
      onOk: () => {
        this.$store.dispatch("deleteUser", qs.stringify(params)).then((res: any) => {
          this.$Message.success("删除成功！");
          this.getAccountlist();
        });
      },
    });
  }
  private created() {
    this.getAccountlist();
  }

  // 刷新
  private refresh() {
    this.getAccountlist();
  }

  // 翻页
  private onPageChanged(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.refresh();
  }
}
</script>
