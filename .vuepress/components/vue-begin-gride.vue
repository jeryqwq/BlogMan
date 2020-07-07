<template>
  <div style="">
    <PointTool :lists="lists" :opacity="0.7" />
  </div>
</template>

<script>
import PointTool from "vue-begin-gride"
export default {
  name: "vue-begin-gride",
  components: {
    PointTool,
  },
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
        text: " 第一步：简单的介绍常用的业务场景和难点",
      },
      {
        el: document.getElementsByClassName("language-bash")[1],
        text: () => (
          <span style="color:white;width:500px">
            "第er步：使用npm安装插件，卡顿可切换到cnpm淘宝源（npm install -g
            cnpm --registry=https://registry.npm.taobao.org
            ）,也可以使用nrm管理你的源！"
          </span>
        ),
      },
      {
        el: document.querySelectorAll(".page p")[1],
        text:
          "这里是使用的说明详情，下面是基本模版代码，可直接赋值到你的项目查看demo并根据API作出适当的调整适配你自己的项目！！！使用愉快！！",
      },
      // {
      //   el: document.querySelectorAll(".page .language-vue")[1],
      //   text:
      //     "这里就是基本的模版代码了，你可以拷贝按照上面的顺序执行下来后拷贝至你自己的项目并适当调整至你想要的效果！！！！使用愉快！！",
      // },
      {
        el: document.getElementsByTagName("table")[0],
        text: () => (
          <span style="color:white">
            请仔细阅读API类型及其说明，如果使用途中有任何问题或者优化功能，欢迎在github项目地址提出issure
          </span>
        ),
      },
    ]
  },
}
</script>
