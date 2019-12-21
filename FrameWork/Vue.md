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
初始化后添加项目基础依赖（全家桶）
``` BASH
  #添加路由
vue add router
# 添加状态管理
vue add vuex
# 添加请求库
vue add axios
```

## 动态路由

基于全局状态以及route下addRoutes动态添加路由实现，先来看看我们基本的router配置，既然都已经是有权限管理了，所以我们的页面要划分为两个部分，一个是定死的，无论什么用户都能看到的部门，例如404页面，主页等，还有个部分就是我们需要通过后端接口动态调整修改路由，从而实现权限的细化，这部分的路由我们只能预先配置好，不能new初始化时使用，需要在后端返回对应权限菜单后我们来进行配置。

router.js

``` JS
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
Vue.use(VueRouter)
export const authRouters=[//仅仅导出需要处理的所有权限菜单,此部分菜单的内容需要根据后端返回的数据增加
   {
    path: '/',
    name: 'admin',
    component: Layout,
    children:[
      {
        path: '/home',
        name: '首页',
        mate:{
          key:'name',
          auth:["admin"]
        },
        component: () => import('../views/home/index.vue')
      },
      {
        path: '/cusInfo',
        name: '客户资料详情',
        mate:{
          key:'cusInfo',
          auth:["admin"]
        },
        component: () => undefined
      },
      {
        path: '/cusInfo/detail',
        name: '客户信息详情',
        mate:{
          key:'detail',
          auth:["admin"]
        },
        component: () => import('../views/cusInfo/cusInfo-detail/index.vue')
      },
      {
        path: '/cusInfo/account',
        name: '客户账户详情',
        mate:{
          key:'account',
          auth:["admin"]
        },
        component: () => import('../views/cusInfo/account-detail/index.vue')
      },
      {
        path: '/userInfo/rateConfig',
        name: '费率调整',
        mate:{
          key:'rateConfig',
          auth:["admin"]
        },
        component: () => import('../views/cusInfo/rote-config/index.vue')
      }
    ]
  },
]
const routes = [//此处放置无权限配置的菜单
   {
    path: '/login',
    name: 'login',
    mate:{title:"登录"},
    component: () => import(/* webpackChunkName: "about" */ '../views/login/index.vue')
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
export default new Vuex.Store({
  state: {
    hasPermission: false,
    userInfo: {}
  },
  mutations: {//commit 处理同步
    setUserInfo(state,userInfo){
      state.userInfo=userInfo;
      Vue.axios.defaults.headers.common['token'] =userInfo.token;//将token设为header,具体看token在后端如何取值，一般header或者直接传参在数据中
    }
  },
  actions: {
    userLogin(context,userInfo) {//disptach 处理异步，接口等
      context.commit('setUserInfo',userInfo);
    },
    async getRouter() {//vue路由守卫中调用此方法，只有在没有权限时执行
      return new Promise((reslove)=>{
        Vue.axios.get('/admin/auth/info').then((result)=>{
          if(result.code===0){
            this.state.hasPermission=true;//说明有权限，拿到权限菜单后动态渲染菜单
            reslove(result.data.menus);//返回异步菜单数据
          }
        })
      })
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
        res.forEach((element) => {//处理业务逻辑，真是项目中数据接口往往是一维数组，需要手动改变数据格式为
        // [{path:'',name:'',children:[...]},{path:'',name:'',children:[...]}]
            for (let index = 0; index < authRouters.length; index++) {//使用迭代diff我们配置的菜单，仅渲染相同的部分，即有权限的菜单。
                const item = authRouters[index];
                item.path===element.path&&(route.push(item));
            }
        });
        console.log("权限验证后路由",route);
        router.addRoutes(route)//动态添加用户对应diff后的权限菜单
        next()
    }
})
```
## axios配置

使用默认的vue add axios 会生成很好格式的默认配置，只要在原来的基础上配置下即可

```js
"use strict";

import Vue from 'vue';
import axios from "axios";
import store from './../store/index'
// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
axios.defaults.headers.common['token'] ='';//添加你账户的token
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL: process.env.baseURL || process.env.apiUrl || "http://49.235.107.238:3000/mock/27",//设置baseUrl
  timeout: 60 * 1000, // Timeout超时
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent  添加自定义参数
    return config;
  },
  function(error) {
    // Do something with request error 
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data 处理全局返回时提示，如错误提示等
    console.log("axios拦截",response);
    return response.data;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {//拦截访问对象
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;

```

### 动态路由菜单过几天继续


