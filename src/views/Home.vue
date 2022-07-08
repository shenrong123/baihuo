<template>
  <Layout>
    <Sider
      ref="side1"
      hide-trigger
      collapsible
      :collapsed-width="78"
      v-model="isCollapsed"
    >
      <AppSider></AppSider>
    </Sider>
    <Layout>
      <Header class="layout-header-bar">
        <AppHeader></AppHeader>
      </Header>
      <Content :style="{ margin: '20px', padding: '20px', background: '#fff', minHeight: '100vh' }">
        <router-view v-if="isDepDataLoaded" />
      </Content>
    </Layout>
  </Layout>
</template>

<style scoped>
.layout-header-bar {
  background: #fff;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppHeader from '@/views/AppHeader.vue';
import AppSider from '@/views/AppSider.vue';

@Component({
  components: {
    AppHeader,
    AppSider,
  },
})
export default class App extends Vue {
  private isCollapsed = false;
  private isDepDataLoaded: boolean = false;

  private created() {
    const userInfo = sessionStorage.getItem('userInfo');
    if(userInfo) {
      this.isDepDataLoaded = true;
    }else {
      this.$router.push({name:'login'})
    }
  }

}
</script>
