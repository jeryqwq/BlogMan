---
title: Vue进阶
lang: en-US
---
## 简述
Vue官网的文档已经是非常详细了，基础建议直接看[官方文档](https://cn.vuejs.org/)或者烂大街的视频;

## 主要内容
* 在Vue中使用jsx实现模板语法之外的复杂逻辑和功能（开始怀疑自己到底是在写react还是vue）。
* 实现自定义组件render函数，让组件更自由
* 实现组件之间Dispatch和BroadCast（向上派发和向下广播）事件
* 实现简易vue-router和vuex

呸呸呸，还没写完Vue3.0就出来了，直接Vue3吧
前天刚出的版本，早听说vue要模仿react16.8的hooks重构，别说，重构的还很有模有样，下载了官方的代码构建了vue，引入浏览器试了一波水，虽然很多API还没迁移，但作者也说了，主要的核心功能已经完成了。
抱着好奇心的姿态使用了，当我new Vue的时候发现不对劲了，Vue is not a constructor ，这玩意已经不能new了，后来想想，也是很有道理，打开官网[Vue Composition API](https://vue-composition-api-rfc.netlify.com/api.html#setup),API风格像react靠近,如果越来越像react，那是不是总有一天会被react替代掉,希望官方还是贯彻好上手为初心，优化API使用难度。vue3=react+mobx还是很有道理的，
由于现在对应的模板解析和脚手架等都还未支持3.0，就直接使用浏览器环境引入vue3文件来使用下核心的API
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./js/vue.global.js"></script>
    <!-- 官方仓库打包后代码 -->
    <script src="./js/index.js"></script>
</head>

<body>

    <script>
        let renderVueTest=function () { 
            // reactive-定义响应式数据，使用proxy进行监听
            const state=Vue.reactive({
                count:3,
                double:Vue.computed(()=>state.count*2)
            })
            function increment(){
                state.count++;
            }
            window.increment=increment;
            Vue.watch(()=>{
                document.body.innerHTML =`
                watch your count: is ${state.count};
                    double:${state.double}<br/>
                    <input type="button" onclick="increment()" value="+1"/>
                `
            })

         }()
        //state example
            let state = Vue.reactive({
                count: 0,
                text:''
            });
            function resetCount() {
                state.count = 0;
            }
            function inerment(){
                state.count++;
            }
            function changeText(param) { 
                state.text+=param
             }
            Vue.watch(() => {
                document.body.innerHTML =
                    `watch your count: is ${state.count};
                    text:${state.text}<br/>
                    <input type="button" onclick="resetCount()" value="重置"/>
                    <input type="button" onclick="changeText('-')" value="文字累加"/>
                    `
            },state);
    </script>
</body>

</html>

```

