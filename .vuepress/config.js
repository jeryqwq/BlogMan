module.exports = {
  title: "小陈小陈，心想事成",
  description: "一本正经的学习",
  themeConfig: {
    nav: [
      {
        text: "前端",
        link: "/",
      },
      {
        text: "时间安排",
        link: "/nav/Time",
      },
      {
        text: "阅读",
        link: "/nav/Reading",
      },
      {
        text: "作品",
        link: "/nav/MY",
      },
      {
        text: "GitHub",
        link: "https://github.com/jeryqwq",
      },
    ],
    sidebar: [
      {
        title: "基础",
        children: [
          "/Base/JS",
          "/Base/CSS",
          "/Base/ES6",
          "/Base/CMDAMD",
          "/Base/NODE",
          "/Base/Promise",
          "/Base/Render",
          "/Base/Git",
        ],
      },
      {
        title: "JS深入系列",
        children: [
          "/JS/design-mode",
          "/JS/review-question",
          "/JS/data-structure",
          "/JS/js-module",
        ],
      },
      {
        title: "框架必知",
        children: [
          "/FrameWorkBase/MVVM",
          "/FrameWorkBase/MVC",
          "/FrameWorkBase/VisualDom",
          "/FrameWorkBase/DomDiff",
          "/FrameWorkBase/reactRoute",
          "/FrameWorkBase/VueRouter",
          "/FrameWorkBase/reactPublicState",
          "/FrameWorkBase/VueState",
        ],
      },
      {
        title: "框架",
        children: [
          "/FrameWork/Typescript",
          "/FrameWork/Vue",
          "/FrameWork/Vue3",
          "/FrameWork/React",
          "/FrameWork/ReactHooks",
          "/FrameWork/Koa",
        ],
      },
      {
        title: "数据库",
        children: ["/DataBase/Mongod", "/DataBase/MySQL"],
      },
      {
        title: "前端大杂烩",
        children: [
          "/Others/AntdForm",
          "/Others/PrivateNpm",
          "/Others/IceFusion",
          "/Others/vue-begin-gride",
        ],
      },
      {
        title: "三大浪漫",
        children: ["/romantics/compile", "/romantics/system","/romantics/graphics"]
      },
    ],
  },
}
