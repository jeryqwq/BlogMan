---
title: Vue全家桶进阶
lang: en-US
---
## 简述
Vue官网的文档已经是非常详细了，基础建议直接看[官方文档](https://cn.vuejs.org/)或者烂大街的视频;
本篇主要基于vue-cli3实现大型项目中常用的动态路由，权限管理，axios拦截，权限按钮等，看了很多第三方开源脚手架，没有文档用起来还是很吃力，虽然打着开源的旗号免费公开源码，但是文档收费或者视频收费也是有点恶心，使用起来还是有点吃力，例如avue，而且往往把一些非核心的功能也添加了进来，造成源码的阅读体验极差。与其用他的，还不如我们自己从头到尾开始配置自己且拥有相关核心功能的脚手架。<div style="color:red">（主要是自己项目中用到了，没钱买视频也没钱买文档）</div>
## 主要内容
* 根据后端返回的权限菜单接口动态配置路由菜单
* 全局路由权限拦截
* axios配置，处理全局异常和token等
* 配置权限指令按钮，对应权限开放对应功能
* 在Vue中使用jsx实现模板语法之外的复杂逻辑和功能。
* 实现组件之间Dispatch和BroadCast（向上派发和向下广播）事件和公开发布订阅。
* vue-router和vuex原理

## 项目初始化

使用vue-cli3 [初始化看这里](https://cli.vuejs.org/zh/)
``` BASH
  #添加路由
vue add router
# 添加状态管理
vue add vuex
# 添加请求库
vue add axios
```

## 权限菜单

基于全局状态以及route下addRoutes动态添加路由实现，先来看看我们基本的router配置，既然都已经是有权限管理了，所以我们的页面要划分为两个部分，一个是定死的，无论什么用户都能看到的部门，例如404页面，主页等，还有个部分就是我们需要通过后端接口动态调整修改路由，从而实现权限的细化，这部分的路由我们只能配置，不能对其调用vue.use()来使用，需要在后端返回对应权限菜单后我们来进行配置。

router.js

``` JS
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
Vue.use(VueRouter)
export const authRouters=[//仅仅导出需要处理的所有权限菜单,avue中讲这两个分开存放了，一个是view，另一个是pages
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')//使用函数导入webpack会进行单独打包，使用jsonp原理进行异步按需加载
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login/index.vue')
  },
  {
    path: '/test',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login/index.vue')
  }
]
const routes = [//此处放置无权限配置的菜单
  {
    path: '/',
    name: 'home',
    component: Home
  },
 
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes//使用无须配置的路由先注册
})

export default router

```

## vuex

现在vuex中存放我们用户的状态，是否有权限以及用户信息等。

```js
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
const { axios } = Vue;
export default new Vuex.Store({
  state: {
    hasPermission: false,//是否有权限
    userInfo: {}//用户信息
  },
  mutations: {},
  actions: {
    userLogin(userInfo) {
      this.state.userInfo = userInfo;
    },
    async getRouter() {//模拟像后端获取用户权限数据
      return new Promise(res => {
        setTimeout(() => {
          this.state.hasPermission = true;
          res([
            {
              path: "/login",
              id: 123
            },
            {
              path: "/home",
              auth: "home"
            },
            {
              path: "/about",
              auto: "about"
            }
          ]);
        }, 500);
      });
    }
  },
  modules: {}
});

```
## 路由守卫

使用router的路由导航的生命周期方法可以很好的处理权限问题，每次路由变化前进行检测权限是否异常

```js
import router from './../router/index'
import store from './../store/index'
import {authRouters} from './../router/index'//引入router中需要有权限的菜单



router.beforeEach( async (to,from,next)=>{
    if(store.state.hasPermission){
        next();//有权限放过
    }else{
        let route=[];
        let res=await store.dispatch('getRouter');//得到用户权限菜单
        res.forEach((element) => {//处理业务逻辑，真是项目中数据接口往往是一维数组，需要手动改变数据格式为[{path:'',name:'',children:[...]},{path:'',name:'',children:[...]}]
            for (let index = 0; index < authRouters.length; index++) {
                const item = authRouters[index];
                item.path===element.path&&(route.push(item));
            }
        });
        console.log("权限验证后路由",route);
        router.addRoutes(route)
    }
    next()
})
```



