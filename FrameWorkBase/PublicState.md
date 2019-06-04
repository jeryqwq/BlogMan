---
title: 状态管理
lang: en-US
---
## 管理思想
在组件化开发模式中，组件数据共享一直也是复杂应用项目的痛点，基于单向数据流的思想，组件传值变得麻烦，除去父子组件或孙子组件之外，平行组件又或者跨越层级较多的组件之间的通信变的异常繁琐，vue不是很熟悉，应该类似也有API来处理跨多层组件之间的数据共享问题，react下contextAPI可实现跨越多层组件之间的数据共享，但极大的破坏了组件的规范性，使得此类组件很难再进行任何复用，虽然redux增加了项目的复杂度，redux官方也不是很推荐在一些项目中使用react-redux，明确说明-当你还在思考你的项目要不要使用react-redux时，那说明你的项目是不需要使用的，他规定了每个修改数据的动作都要有一个action属性，然后根据action属性进行不同的操作，最终返回一个数据结果，所有有绑定的组件根据最新的状态进行更新。
## 发布订阅
发布订阅模式在任何框架中应用的地方很多，经典的开发思想，MVVM中用来存储更新DOM的操作，数据变更通知所有订阅者更新数据，redux中也不例外，存储有订阅的组件更新视图函数，数据变更时通知所有订阅的组件进行重新渲染(执行render函数)，通过一个第三方容器来跨组件管理状态。
## redux
## 手写简易的React-Redux
###  效果预览
---
<img :src="$withBase('./../imgs/redux.gif')" alt="redux效果预览图">

本章节并不实现react-redux的所有功能，主要是讲解react-redux的设计思想的大概的实现方法。
* forceUpdate:在组件内使用this.forceUpdate()来主动触发视图层更新，组件render完后向发布订阅模式订阅一个更新该组件的函数，修改公共状态时通知订阅者更新视图。
### 文件目录
>react-redux
>>index.js  --简易的发布订阅模式<br/>
>>APP.js --create-react-app入口文件<br/>
>>Child.js --订阅者<br>
### index.js
经典发布订阅模式
```js
let state={
    name:"CJ"
},arr=[];
let getState=function () {//获取最新的数据
    return state;   
}
let subscribe=function (fn) {//添加订阅者
    arr.push(fn);
}
let updateState=function (callback) {
    let newState=callback(state);//执行并传递state参数到callBack函数中
    state={...state,...newState};//保留原有参数，仅替换新的状态已有的数据
    arr.forEach((item)=>item());//通知订阅者执行
}
export  {//导出接口
    getState,
    subscribe,
    updateState
};
```
### APP.js
添加订阅者函数
```js
import React from 'react';
import {getState,
        subscribe,
        updateState} from "./react-redux";
import Child from "./Child";
class App extends React.Component{
  componentDidMount(){//渲染完成后添加更新的订阅者
    subscribe(()=>{this.forceUpdate()});
  }
  render(){//渲染函数，数据修改时会自动触发视图更新
    let {name}=getState();//容器内的state数据
    return(
      <div>
   <h2>跨组件状态共享:</h2>
        <h4>订阅的组件：</h4>
        Name:{name}
        <TestRedux/>
      </div>
    )
  }
}

function TestRedux() {//修改参数
  return(
    <div>
      <Child/>
      <input  type="text" id='test'/>
      <button  onClick={()=>{
      updateState(state=>{//调用update返回一个最新的状态
        return {name:window.test.value}
      })
    }}>点击修改name</button>
    </div>
  )
}
export default App;
```
### Child.js
与容器共享状态
```js
import React from 'react';
import {getState,
    subscribe,
    updateState} from "./../redux";
class Child extends React.Component {
    componentDidMount(){//渲染完成后添加更新的订阅者
        subscribe(()=>{this.forceUpdate()});
      }
    render() { 
        let {name}=getState();//容器内的state数据
        console.log(this.props)
        return ( <div style={{background:'orange'}}>
                <h4>订阅的组件：</h4>
                Name:{name}
                </div> );
    }
}
export default Child;
```
## 更好用的Mobx
相比react-redux，mobx简洁的语法和神奇的响应式原理
## 动手实现mobx