---
title: React
lang: en-US
---
## 简介
## 组件声明方式
### 函数组件
### 类组件
## 生命周期
## Context
在组件化开发中，如何跨组件优雅的共享状态一直是很棘手的问题，常见的作法也有很多，使用状态管理（引入第三方react-redux,mobx等），嵌套多层的props，使用contextAPI等，用来处理平行组件或跨多层组件之间的通信问题，例如：全局的主题动态配置、处理全局状态（用户登录状态）、数据持久化(存储)等等。Context API用于多组件跨级传值，使用React.createContext()创建对象，该对象下有Provider和Consumer两个对象（生产者和消费者），生产者用于包装需要分享状态的组件，消费者用来接收参数。
```js
import React from 'react';
const {Provider,Consumer} = React.createContext();//创建生产者和消费者
export {Provider,Consumer}//导出
```
父组件从文件导入生产者
```js
import {Provider} from './xxx.js';
import React from 'react';
class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {value:'this is Context info'}
}
  render(){
    return(
      <div>
      <Provider value={this.state.value}>
        <Child></Child>
      </Provider>
      </div>
    )
  }
}
export default App;
```
组件内的所有子组件可接收并共享该数据状态,Consumer组件内函数传递的参数即为context共享的对象，即调用setState参数修改该参数时，视图层也会做出响应.
```js
import React, {Component } from 'react'
import {Consumer} from './xxx.js' //导入消费者
class HashRouter extends Component {
    render() { 
        return (
            <Consumer>
                {state=>(
                    console.log(state) //this is Context info
                )}
            </Consumer>
        );
    }
}
 
export default HashRouter;
```
## 代码切割
## 高阶组件(HOC)
## Hook
## Router
## Mobx
