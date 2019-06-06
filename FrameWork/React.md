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
React 16.8Hook的出现，官方极力推崇函数式编程，在不使用类的情况下使函数组件也有自己的state，由此新增了多个API，极大增强了函数组件。原有create-react-app 创建的项目只要将react和react-dom升级到16.8以上版本即可使用Hook特性。
### useState
顾名思义，该API是函数组件最常用的，他替代了类组件的this.state,使得函数组件也有自己的状态，调用解构的第二个函数传递新参数时刷新视图。
<br>
一个简单的累加计数：
```js
import React ,{useState}from 'react';

function App(){
  const [count,setCount]=useState({num:0,name:'CJ'});
  //解构出第一个参数为对象，第二个修改参数的方法（该方法并不会像是setState那样自动合并对象
  //而是整个替换掉，所以当第一个参数为对象时，最好使用{...count,xxx:'changeObj'}
  return(
    <div>
        {count.num}
        <button  onClick={()=>{
          setCount({...count,num:count.num+1})
        }}>increment</button>
    </div>
  )
}
```
延迟加载:
```js
  const [count,setCount]=useState(()=>{
    return initPams(5)//调用函数初始化状态
  });
  function initPams(arg){
    return arg+5
  }
  return(
    <div>
        {count}
        <button  onClick={()=>{
          setCount(count+1)
        }}>increment</button>
    </div>
  )
```
### useEffect
useEffect用来监听一些非DOM渲染数据也需要进行更改时，例如document.title,window.href,或者添加监听事件等，返回事件在组件清除时对监听事件解除绑定。函数内数据每次触发一次渲染修改，会自动执行该函数。
```js
import React ,{useState,useEffect}from 'react';
export default function (){
  const [title,setTitle]=useState('is Title');
  useEffect(()=>{
    document.title=title;
    return()=>{
      document.title='React app'
    }
  });
  return(
    <div>
        {title}
        <button  onClick={()=>{
            setTitle(title+'+')
        }}>AddTitle</button>
   
    </div>
  )
};
```
### useMemo
useMemo类似Vue中的computed，监听多个函数，在函数变动时触发指定的函数执行。在vue中只要该函数内的data变动后便会立即执行，重新渲染最新的结果，复杂的业务中，并不是所有结果都是由其本身的影响生成，亦可能是其他数据的变动改变导致重新渲染，useMemo与computed最大的差别就是是否自动检测渲染。
```js
import React ,{useState,useMemo}from 'react';
export default function (){
  const [count,setCount]=useState(0);
  useMemo(()=>{
    console.log(count)//此时的取值是更新之前的值
  },[count])//第二个参数决定哪些数据变动触发函数执行
  return(
    <div>
        {count}
        <button  onClick={()=>{
            setCount(count+1)
        }}>Increment</button>
   
    </div>
  )
};
```
### useCallBack
useCallBack类似于类组件每次setState完后传递的callBakc函数，用来获取最新的值，在类组件中异步改变state中的数据后必须在回调函数中才能获取最新的状态，例：
```js
this.setState({count:0},()=>{
  console.log(this.count)//此时才能获取罪行的状态
})
```
使用useCallBack:
```js
import React ,{useState,useCallBack} from 'react';
 function App(){
      const [count,setCount]=useState(0);
      let countCb=useCallback(()=>{
      console.log(count)
      },[count])
      countCb();
      return(
          <div>
              {count}
              <button  onClick={()=>{
                  setCount(count+1)
              }}>Increment</button>
        
          </div>
        )
 }
```
## Router