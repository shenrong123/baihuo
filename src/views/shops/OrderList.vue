<template>
  <div class="list-page-container">
    <!-- 标题等 -->
    <div class="title-box">
      <h1>订单列表</h1>
    </div>
    <!-- 表格 -->
    <Table
      stripe
      :columns="tableFields"
      :data="orderLists"
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

@Component({})
export default class OrderList extends Vue {
  // 数据加载状态
  private loading = true;

  // 总数
  private totalCount = 0;

  // 当前页码
  private pageIndex = 1;

  // 每页条数
  private pageSize = 10;

  private orderLists: any = []; // 订单列表

  // 表结构
  private tableFields = [
    { title: "订单编号", key: "orderId" },
    { title: "创建人", key: "truename" },
    {
      title: "订单状态",
      key: "status",
      render: (h: any, params: any) => {
        return h(
          "p",
          {
            style: {
              color: params.row.finishTime ? "#32cd9c" : "#ed4014",
            },
          },
          params.row.finishTime ? "已完成" : "未完成"
        );
      },
    },
    {
      title: "订单总价",
      key: "totalMoney",
      render: (h: any, params: any) => {
        return h(
          "p",
          "¥ " + (params.row.totalMoney ? params.row.totalMoney : 0)
        );
      },
    },
    {
      title: "完成时间",
      key: "finishTime",
      render: (h: any, params: any) => {
        return params.row.finishTime
          ? h("Time", {
              props: {
                time: new Date(params.row.finishTime),
                type: "datetime",
              },
            })
          : "";
      },
    },
    {
      title: "操作",
      key: "date",
      width: 160,
      render: (h: any, params: any) => {
        const { orderId, finishTime } = params.row;
        return h("div", [
          h(
            "Button",
            {
              props: {
                type: "text",
                size: "small",
                to: { name: "orderInfo", params: { orderId } },
                disabled: !finishTime,
              },
            },
            "详情"
          ),
        ]);
      },
    },
  ];

  // 获取用户信息
  get userInfo() {
    var items: any = sessionStorage.getItem("userInfo");
    return JSON.parse(items);
  }

  // 获取订单列表
  private getOrderList() {
    const params: any = {
      page: this.pageIndex,
      size: this.pageSize,
    };
    if (this.userInfo.category !== "admin") {
      params.customerId = this.userInfo.userId;
    }
    this.$store
      .dispatch("getOrderList", qs.stringify(params))
      .then((res: any) => {
        this.loading = false;
        const result = res.result || {};
        this.orderLists = result.rows || [];
        this.totalCount = result.count;
      });
  }

  // 翻页
  private onPageChanged(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.getOrderList();
  }

  private created() {
    this.getOrderList();
  }
}
</script>
