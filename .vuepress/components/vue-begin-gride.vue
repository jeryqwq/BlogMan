<template>
  <div>
   
  </div>
</template>

<script>
import VueBeginGride from "vue-begin-gride"
import Vue from 'vue'
Vue.use(VueBeginGride)
export default {
  data() {
    return {
      lists: [],
    }
  },
  mounted() {
   this.lists = [
      {
        el: document.querySelectorAll(".page p")[0],
        width: "200px",
        text:
          " 第一步：简单的介绍常用的业务场景和难点,这是最基本的引导组件和配置，宽度200px,覆盖一个p标签的DOM节点",
        width: "600px",
        padding: 12,
        text: () => (
          <div style="color:white">
            第一步：简单的介绍常用的业务场景和难点,这是最基本的引导组件和配置，宽度200px,覆盖一个p标签的DOM节点;
            <div>
              ListItem配置:
              <br />
              el: document.querySelectorAll(".page p")[0], <br />
              width: "600px",
              <br />
              padding: 12,
              <br />
              text:“第一步：简单的介绍常用的业务场景和难点,这是最基本的引导组件和配置，宽度200px,覆盖一个p标签的DOM节点;
              <br />
            </div>
          </div>
        ),
      },
      {
        el: document.getElementsByClassName("language-bash")[1],
        style: "border:solid 5px red;border-radius:20px;background:white",
        text: () => (
          <div style="color:#333;padding:20px 10px  10px 10px">
            <h3>自定义渲染</h3>
            "第er步：使用npm安装插件，卡顿可切换到cnpm淘宝源（npm install -g
            cnpm --registry=https://registry.npm.taobao.org
            ）,也可以使用nrm管理你的源！----这是jsx渲染的DOM自定义节点，如果不需要外部的虚线边框，可以配置list.style属性覆盖掉默认样式"
            第2步：使用npm安装插件，卡顿可切换到cnpm淘宝源（npm install -g cnpm
            --registry=https://registry.npm.taobao.org
            ）,也可以使用nrm管理你的源！
            <br />
            <span style="margin-left:240px">
              ----这是jsx渲染的DOM自定义节点，如果不需要外部的虚线边框，可以配置list.style属性覆盖掉默认样式"
            </span>
          </div>
        ),
      },
      {
        el: document.querySelectorAll(".page p")[1],
        lineStyle: "stroke-width:5px",
        text:
          "自定义线条(lineStyle: 'stroke-width:5px',)-----这里是使用的说明详情，下面是基本模版代码，可直接赋值到你的项目查看demo并根据API作出适当的调整适配你自己的项目！(使用自定义lineStyle属性给弧线设置svg格式的线条样式，更多请查看官方文档)"
      },
      {
        el: document.querySelectorAll(".page .language-vue")[1],
        text:
          "这里就是基本的模版代码了，你可以拷贝按照上面的顺序执行下来后拷贝至你自己的项目并适当调整至你想要的效果！！！！使用愉快！！",
      },
      {
        el: document.getElementsByTagName("table")[0],
        text: () => (
          <span style="color:white">
            请仔细阅读API类型及其说明，如果使用途中有任何问题或者优化功能，欢迎在github项目地址提出issure
            <a
              href="https://github.com/jeryqwq/vue-begin-gride"
              target="_blank"
            >
              vue-begin-gride
            </a>
          </span>
        ),
      },
    ]
    this.$guide({
      lists: this.lists,
      opacity: 0.2
    })
  },
}
</script>









