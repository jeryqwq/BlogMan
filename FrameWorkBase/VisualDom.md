---
title: 虚拟DOM
lang: en-US
---
## 简介
### 概念
虚拟DOM是浏览器DOM与JS对象的形成的映射关系，由JS对象来描述一个DOM的所有信息，使用函数将对象渲染为浏览器真实DOM，正是由于VDOM的特性，使得DOM脱离了浏览器端，衍生了react-native、weex、ionic等前端组件化跨平台应用，用来使用vue,react,angular前端框架开发拥有原生性能体验的原生跨平台APP。甚至是近年来流行的跨多种平台的打包工具([Taro](https://nervjs.github.io/taro/docs/README.html),[chameleon](https://cmljs.org/doc/quick_start/quick_start.html))等。

## createElement
一段HTML代码会被编译为一个对象，在React中俗称JSX语法，即HTML in JS ，我们来看看Babel是将一段HTML代码编译为JS对象的吧
```html
<div class="test">
  <span>text2</span>
  <span>text2</span>
  <span>text2</span>
  <span>text2</span>
</div>
```
编译后:
```js
"use strict";
    React.createElement("div", {
    class: "test"
    }, 
    React.createElement("span", null, "text2"),
    React.createElement("span", null, "text2"),
    React.createElement("span", null, "text2"),
    React.createElement("span", null, "text2")
);
```
## 动手实现createElement
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./VDom.js"></script>
</head>
<body>
    <div id='app'></div>
</body>
<script>
//创建DOM节点
    let el = createElement('div', {
        class: "test",
        style: 'color:red'
    }, [
        ['div', {
            class: 'child1'
        }, "子节点1"],
        ['div', {
                class: 'child2'
            },
            [
                ['li', {
                    class: 'li1'
                }, "li1"],
                ['li', {
                    class: 'li2'
                }, 'li2']
            ]
        ]
    ])
    //挂载
    window.app.appendChild(el);
</script>
</html>
```
VDOM.js
```js
function createElement(elType, attrs, children) {//对应参数：(DOM类型，节点属性，子节点数组或者字符串)
    let el;
    //新增节点并赋值节点类型
    typeof elType==="string"?el=document.createElement(elType): new Error("is not a String");
    for (const key in  attrs) {//便利所有属性，为当前节点赋值
        if (attrs.hasOwnProperty(key)) {
            const element = attrs[key];
            el.setAttribute(key,element);//键值对的形式
        }
    }
    if(typeof children==="string"){
        el.textContent=children;//是字符串直接赋予textContent属性
    }else{
        children.forEach(element => {//否则数组进行递归调用该方法深层渲染
           let subEl= createElement(...element);
           el.appendChild(subEl);//添加到父元素中
        });
    }
    return el;//返回当前元素
}
```
## React中的虚拟DOM

```js
function App(){
    return <div>123</div>
}
//等价于下方
React.createElement('div',{name:'CJ',age:23},['123'])
//所以每次当我们调用指定的类或者函数返回的虚拟DOM时，babel会将他转换为createElement的形式去执行
//渲染一个函数或者组件我们只要使用<App></App>即可
React.render(<App/>,'#app');
//也等价于
React.render({App(arg1,arg2)},'#app');
//转换后：
React.render(React.createElement('div',{name:'CJ',age:23},['123']),'#app');


//使用class的组件
class App extends React.Component{
    constructor(props){
        super(props);
        console.log(props.name)
    }
    render(){
        return{
            <div>123</div>
        }
    }
}
React.render(<App/>,'#app');
//也等价于
React.render({new App({name:'cj'})},'#app');
//转换后：
React.render(React.createElement('div',{name:'CJ',age:23},['123']),'#app');

```
