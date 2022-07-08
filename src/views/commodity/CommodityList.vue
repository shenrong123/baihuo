<template>
  <div class="list-page-container">
    <!-- 标题等 -->
    <div class="title-box">
      <h1>商品管理</h1>
      <div class="actions">
        <!-- 新增商品按钮只有财务人员可见可操作。 -->
        <Button type="primary" :to="{ name: 'createCommodity' }">新增商品</Button>
        <Button @click="refresh">刷新</Button>
      </div>
    </div>
    <!-- 筛选 -->
    <div class="search-box">
      <Select v-model="filterType">
        <Option v-for="item in filterTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
      </Select>
      <Input v-model="filterValue" placeholder="请输入需要搜索的内容"/>
      <Button @click="refresh" style="background:#121e26;color:#fff;margin-right:10px">搜索</Button>
      <Button @click="clear">清空</Button>
    </div>
    <!-- 表格 -->
    <Table stripe :columns="tableFields" :data="commodityList" :loading="loading"></Table>

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

<style lang="less">
.remarkRow .ivu-tooltip-rel {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 80px !important;
}
</style>

<script lang="ts">
import qs from 'qs';
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class CommodityList extends Vue {
  private commodityType: any = {
    kickenShops: "厨房用品",
    serverShops: "生活用品",
    steelShops: "不锈钢与铁制品"
  }; // 商品类别

  private filterValue: string = ""; // 搜索内容
  private filterType: string = ""; // 搜索条件

  // 搜索类
  private filterTypeList = [
    { value: "name", label: "商品名称" },
    { value: "code", label: "商品Code" }
  ];

  // 表结构
  private tableFields = [
    { title: "商品名称", key: "name" },
    { title: "商品Code", key: "code" },
    {
      title: "商品类别",
      key: "category",
      filters: [
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
      ],
      filterMultiple: false,
      filterRemote: (value: any) => {
        const status = value.length > 0 ? value[0] : "";
        this.getCommodityList(status);
      },
      render: (h: any, params: any) => {
        return h("div", this.commodityType[params.row.category]);
      }
    },
    {
      title: "商品状态",
      key: "status",
      render: (h: any, params: any) => {
        return h(
          "p",
          {
            style: {
              color: params.row.status ? "#32cd9c" : "#ed4014"
            }
          },
          params.row.status ? "有货" : "无货"
        );
      }
    },
    {
      title: "商品进价",
      key: "importPrice",
      render: (h: any, params: any) => {
        return h("p", "¥ " + params.row.importPrice);
      }
    },
    {
      title: "商品批发价",
      key: "exportPrice",
      render: (h: any, params: any) => {
        return h("p", "¥ " + params.row.exportPrice);
      }
    },
    {
      title: "操作",
      key: "date",
      width: 160,
      render: (h: any, params: any) => {
        const { code, name } = params.row;
        return h("div", [
          h(
            "Button",
            {
              props: {
                type: "text",
                size: "small",
                to: { name: "modifyCommodity", params: { commodityId: code } }
              }
            },
            "编辑"
          ),
          h(
            "Button",
            {
              props: {
                type: "text",
                size: "small"
              },
              on: {
                click: () => {
                  this.deleteShops(code, name);
                }
              }
            },
            "删除"
          )
        ]);
      }
    }
  ];

  // 数据加载状态
  private loading = true;

  // 列表数据
  private commodityList: any = [];

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

  // 获取商品列表
  private getCommodityList(status?: any) {
    const params: any = {
      page: this.pageIndex,
      size: this.pageSize
    };
    if (status) {
      params.category = status;
    }
    if (this.filterType && this.filterValue) {
      params[this.filterType] = this.filterValue;
    }
    this.$store.dispatch("getGoodsList", qs.stringify(params)).then((res: any) => {
      this.commodityList = res.result.rows;
      this.totalCount = res.result.count;
      this.loading = false;
      console.log(res, "--login--");
    }).catch(err=>{
      debugger
    });
  }

  // 删除商品
  private deleteShops(code: any, name: any) {
    const params = {
      code
    };
    this.$Modal.confirm({
      title: "删除确认",
      content: `是否删除${name}该商品？`,
      onOk: () => {
        this.$store.dispatch("deleteGoods", qs.stringify(params)).then((res: any) => {
          this.$Message.success("删除成功！");
          this.getCommodityList();
        });
      }
    });
  }

  private created() {
    this.getCommodityList();
  }

  // 刷新
  private refresh() {
    this.getCommodityList();
  }

  // 翻页
  private onPageChanged(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.refresh();
  }
}
</script>