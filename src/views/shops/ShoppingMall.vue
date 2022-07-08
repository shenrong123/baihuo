<template>
  <div class="create-commodity-container">
    <div style="display:inline-block;width:100%">
      <h1 style="float:left">{{orderId?'订单详情':'购物车'}}</h1>
      <Button :to="{ name: 'orderList'}" style="float:right" v-if="orderId">返回</Button>
    </div>
    <Divider></Divider>
    <Row :style="{ 'padding-top': '20px' }">
      <Col :xs="{ span: 16, offset: 4 }" :lg="{ span: 12, offset: 6 }">
        <Row>
          <Col span="20">
            <h2>共{{orderInfoNum?orderInfoNum:shopLists}}件商品</h2>
          </Col>
          <Col span="4" class="text-align">
            <Button type="primary" v-if="isManage && !orderId" @click="manageList">管理</Button>
            <Button type="primary" v-if="!isManage && !orderId" @click="manageList">完成</Button>
          </Col>
        </Row>
        <Row
          v-if="!kickenShops.length && !serverShops.length && !steelShops.length"
          style="text-align:center;margin-top:50px"
        >
          <Col span="24">
            <h1>还没有商品哦!</h1>
          </Col>
        </Row>
        <Row v-if="kickenShops.length" class="shop-model">
          <Row style="margin-bottom:10px">
            <Col span="2">
              <Checkbox
                @on-change="selectTypeAll(kickenCheckbox,'kickenShops')"
                v-model="kickenCheckbox"
                v-if="!orderId"
              ></Checkbox>
            </Col>
            <Col span="22">
              <h3>{{commodityType[kickenShops[0].category]}}</h3>
            </Col>
          </Row>
          <Col span="24" v-for="(item,index) in kickenShops" :key="index">
            <Row>
              <Col span="4">
                <Checkbox
                  :disabled="!item.status"
                  @on-change="changeChecked(item.checked,'kickenShops',index)"
                  v-model="item.checked"
                  v-if="!orderId"
                ></Checkbox>
              </Col>
              <Col span="10">{{item.name}}<span v-if="!item.status" style="color:red">(断货啦!)</span></Col>
              <Col span="4" style="color:red">¥ {{item.dealPrice}}</Col>
              <Col span="6">
                数量:
                <InputNumber
                  :max="9999"
                  :disabled="!item.status || orderId?true:false"
                  :min="1"
                  v-model="item.number"
                  @on-change="calMoney(true,item.number,'kickenShops',index)"
                ></InputNumber>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row v-if="serverShops.length" class="shop-model">
          <Row style="margin-bottom:10px">
            <Col span="2">
              <Checkbox
                @on-change="selectTypeAll(serverCheckbox,'serverShops')"
                v-model="serverCheckbox"
                v-if="!orderId"
              ></Checkbox>
            </Col>
            <Col span="22">
              <h3>{{commodityType[serverShops[0].category]}}</h3>
            </Col>
          </Row>
          <Col span="24" v-for="(item,index) in serverShops" :key="index">
            <Row>
              <Col span="4">
                <Checkbox
                  :disabled="!item.status"
                  @on-change="changeChecked(item.checked,'serverShops',index)"
                  v-model="item.checked"
                  v-if="!orderId"
                ></Checkbox>
              </Col>
              <Col span="10">{{item.name}}<span v-if="!item.status" style="color:red">(断货啦!)</span></Col>
              <Col span="4" style="color:red">¥ {{item.dealPrice}}</Col>
              <Col span="6">
                数量:
                <InputNumber
                  :max="9999"
                  :min="1"
                  :disabled="!item.status || orderId?true:false"
                  v-model="item.number"
                  @on-change="calMoney(true,item.number,'serverShops',index)"
                ></InputNumber>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row v-if="steelShops.length" class="shop-model">
          <Row style="margin-bottom:10px">
            <Col span="2">
              <Checkbox
                @on-change="selectTypeAll(steelCheckbox,'steelShops')"
                v-model="steelCheckbox"
                v-if="!orderId"
              ></Checkbox>
            </Col>
            <Col span="22">
              <h3>{{commodityType[steelShops[0].category]}}</h3>
            </Col>
          </Row>
          <Col span="24" v-for="(item,index) in steelShops" :key="index">
            <Row>
              <Col span="4">
                <Checkbox
                  :disabled="!item.status"
                  @on-change="changeChecked(item.checked,'steelShops',index)"
                  v-model="item.checked"
                  v-if="!orderId"
                ></Checkbox>
              </Col>
              <Col span="10">{{item.name}}<span v-if="!item.status" style="color:red">(断货啦!)</span></Col>
              <Col span="4" style="color:red">¥ {{item.dealPrice}}</Col>
              <Col span="6">
                数量:
                <InputNumber
                  :max="9999"
                  :min="1"
                  :disabled="!item.status || orderId?true:false"
                  v-model="item.number"
                  @on-change="calMoney(true,item.number,'steelShops',index)"
                ></InputNumber>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row class="footer">
          <Col span="24">
            <Row v-if="!orderId">
              <Col span="6">
                <Checkbox @on-change="selectAll(selectAllCheckbox)" v-model="selectAllCheckbox"></Checkbox>
                <span>全选</span>
              </Col>
              <Col class="text-align" span="18" v-if="isManage">
                <span>合计:&nbsp;&nbsp;</span>
                <span>¥ {{totalMoney}}&nbsp;&nbsp;</span>
                <Button
                  type="error"
                  size="large"
                  :disabled="!shopNumber"
                  @click="finishOrder"
                >结算({{shopNumber}})</Button>
              </Col>
              <Col class="text-align" span="18" v-else>
                <Button type="default" size="large" :disabled="!shopNumber" @click="deleteShops">删除</Button>
              </Col>
            </Row>
            <Row>
              <Col span="24" class="text-align">
                <span>合计:&nbsp;&nbsp;</span>
                <span>¥ {{totalMoney}}&nbsp;&nbsp;</span>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import mathjs from "mathjs";
import qs from 'qs';

@Component({})
export default class ShoppingMall extends Vue {
  // 订单id
  get orderId() {
    return this.$route.params.orderId;
  }

  private commodityType: any = {
    kickenShops: "厨房用品",
    serverShops: "生活用品",
    steelShops: "不锈钢与铁制品"
  }; // 商品类别

  private orderInfoNum: number = 0; // 编辑进来商品的数量
  private isManage: boolean = true; // 默认进行管理
  private kickenShops: any = [];
  private serverShops: any = [];
  private steelShops: any = [];
  private totalMoney: number = 0; // 总价
  private shopNumber: number = 0; // 商品数量
  private selectedShopId: any = []; // 选中的商品编号

  private kickenCheckbox: boolean = false; // 厨房
  private serverCheckbox: boolean = false; // 生活
  private steelCheckbox: boolean = false; // 不锈钢
  private selectAllCheckbox: boolean = false; // 全选

  get shopLists(): number {
    return this.$store.getters.shopLists;
  }

  // 获取用户信息
  get userInfo() {
    var items: any = sessionStorage.getItem("userInfo");
    return JSON.parse(items);
  }

  // 管理与完成切换
  private manageList() {
    this.isManage = !this.isManage;
  }

  // 大类的checkbox
  private selectTypeAll(value?: any, type?: any) {
    const that: any = this;
    for (const i of that[type]) {
      if (i.status) {
        i.checked = value;
      }
    }
    this.kickenCheckbox = this.kickenShops.length ? this.kickenCheckbox : true;
    this.serverCheckbox = this.serverShops.length ? this.serverCheckbox : true;
    this.steelCheckbox = this.steelShops.length ? this.steelCheckbox : true;
    if (this.kickenCheckbox && this.serverCheckbox && this.steelCheckbox) {
      this.selectAllCheckbox = true;
    } else {
      this.selectAllCheckbox = false;
    }
    this.calMoney(false);
    this.calShopsNuber();
  }

  // 全选
  private selectAll(value?: any) {
    this.kickenCheckbox = value;
    this.serverCheckbox = value;
    this.steelCheckbox = value;
    if (this.kickenShops.length) {
      this.kickenShops.filter((item: any) => {
        return (item.checked = item.status?value:item.checked);
      });
    }
    if (this.serverShops.length) {
      this.serverShops.filter((item: any) => {
        return (item.checked = item.status?value:item.checked);
      });
    }
    if (this.steelShops.length) {
      this.steelShops.filter((item: any) => {
        return (item.checked = item.status?value:item.checked);
      });
    }
    this.calShopsNuber();
    this.calMoney(false);
  }

  // 改变选择状态
  private changeChecked(value?: any, type?: any, index?: any) {
    let flag1 = false;
    let flag2 = false;
    let flag3 = false;
    if (this.kickenShops.length) {
      flag1 = this.kickenShops.some((item: any) => {
        return !item.checked && item.status;
      });
    }
    if (this.serverShops.length) {
      flag2 = this.serverShops.some((item: any) => {
        return !item.checked && item.status;
      });
    }
    if (this.steelShops.length) {
      flag3 = this.steelShops.some((item: any) => {
        return !item.checked && item.status
      });
    }
    this.kickenCheckbox = !flag1;
    this.serverCheckbox = !flag2;
    this.steelCheckbox = !flag3;
    this.selectAllCheckbox = !flag1 && !flag2 && !flag3;
    this.calShopsNuber();
    this.calMoney(false);
  }

  // 计算已选商品数量
  private calShopsNuber() {
    this.selectedShopId.length = 0;
    if (this.kickenShops.length) {
      for (const i of this.kickenShops) {
        if (i.checked) {
          this.selectedShopId.push(i.shopId);
        }
      }
    }
    if (this.serverShops.length) {
      for (const i of this.serverShops) {
        if (i.checked) {
          this.selectedShopId.push(i.shopId);
        }
      }
    }
    if (this.steelShops.length) {
      for (const i of this.steelShops) {
        if (i.checked) {
          this.selectedShopId.push(i.shopId);
        }
      }
    }
    this.shopNumber = this.selectedShopId.length;
  }

  // 计算总价格
  private calMoney(apply?: any, value?: any, type?: any, index?: any) {
    const that: any = this;
    this.totalMoney = 0;
    if (type) {
      that[type][index].number = value;
    }
    if (this.kickenShops.length) {
      for (const i of this.kickenShops) {
        if (i.status && i.checked) {
          const money = mathjs.round(
            mathjs
              .chain(i.dealPrice)
              .multiply(i.number)
              .done(),
            2
          );
          this.totalMoney = +mathjs.round(
            +mathjs.add(money, this.totalMoney),
            2
          );
        }
      }
    }
    if (this.serverShops.length) {
      for (const i of this.serverShops) {
        if (i.status && i.checked) {
          const money = mathjs.round(
            mathjs
              .chain(i.dealPrice)
              .multiply(i.number)
              .done(),
            2
          );
          this.totalMoney = +mathjs.round(
            +mathjs.add(money, this.totalMoney),
            2
          );
        }
      }
    }
    if (this.steelShops.length) {
      for (const i of this.steelShops) {
        if (i.status && i.checked) {
          const money = mathjs.round(
            mathjs
              .chain(i.dealPrice)
              .multiply(i.number)
              .done(),
            2
          );
          this.totalMoney = +mathjs.round(
            +mathjs.add(money, this.totalMoney),
            2
          );
        }
      }
    }
    if (apply) {
      const params = {
        customerId: this.userInfo.userId,
        shopId: that[type][index].shopId,
        number: value
      };
      this.$store.dispatch("addOrderList", qs.stringify(params));
    }
  }

  // 删除商品
  private deleteShops() {
    const params = {
      customerId: this.userInfo.userId,
      shopIds: this.selectedShopId,
      type: 'delete'
    };
    this.$store.dispatch("addOrderList", qs.stringify(params)).then(() => {
      if (this.kickenShops.length) {
        this.kickenShops = this.kickenShops.filter((item: any) => {
          return this.selectedShopId.indexOf(item.shopId) === -1;
        });
      }
      if (this.serverShops.length) {
        this.serverShops = this.serverShops.filter((item: any) => {
          return this.selectedShopId.indexOf(item.shopId) === -1;
        });
      }
      if (this.steelShops.length) {
        this.steelShops = this.steelShops.filter((item: any) => {
          return this.selectedShopId.indexOf(item.shopId) === -1;
        });
      }
      this.$store.dispatch("shopmallLists", {});
      this.calShopsNuber();
    });
  }

  // 结算
  private finishOrder() {
    this.$Modal.confirm({
      title: "订单确认",
      content: `共计${this.shopNumber}件商品,总价¥${
        this.totalMoney
      }元,是否确定订单？`,
      onOk: () => {
        const params = {
          customerId: this.userInfo.userId,
          totalMoney: this.totalMoney,
          finishTime: new Date(),
          shopIds: this.selectedShopId,
          type: 'finish'
        };
        this.$store.dispatch("addOrderList", qs.stringify(params)).then((res: any) => {
          this.$Message.success("新建成功成功！");
            setTimeout(() => {
          this.$store.dispatch("shopmallLists", {});
            }, 2000);
          this.$router.push({ name: "orderList" });
        });
      }
    });
  }

  // 获取购物车列表
  private getShoppingList() {
    const params: any = {};
    let url = "";
    if (this.orderId) {
      params.orderId = this.orderId;
      url = "getOrderList";
    } else {
      params.customerId = this.userInfo.userId;
      params.finishTime = null;
      url = "getOrderList";
    }
    this.$store.dispatch(url, qs.stringify(params)).then(res => {
      const result = res.result || {};
      let that: any = this;
      this.kickenShops.length = 0;
      this.serverShops.length = 0;
      this.steelShops.length = 0;
      this.orderInfoNum = 0;
      this.totalMoney = 0;
      if (this.orderId) {
        const result = res.result.rows[0] || {};
        this.orderInfoNum = (JSON.parse(result.orders) || []).length;
        this.totalMoney = result.totalMoney;
        for (const i of (JSON.parse(result.orders) || [])) {
          that[i.category].push({ ...i });
        }
      } else {
        const list = JSON.parse(result.rows[0].orders);
        this.orderInfoNum = list.length;
        list.forEach((item: { category: string|number; }) => {
          that[item.category].push({ ...item, checked: false });
        })
      }
    });
  }

  private created() {
    // this.getShoppingList();
          this.$store.dispatch("shopmallLists", {});
    
    this.routeChange();
  }

  @Watch("$route")
  private routeChange() {
    this.getShoppingList();
  }
}
</script>
<style lang="less">
.footer {
  position: fixed;
  bottom: 20px;
  background: #f8f8f9;
  height: 50px;
  width: inherit;
  line-height: 50px;
  padding: 0 20px;
}
.text-align {
  text-align: right;
}
.shop-model {
  background: #f8f8f9;
  padding: 20px;
  margin-top: 20px;
  line-height: 32px;
}
</style>
