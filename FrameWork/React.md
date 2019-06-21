---
title: React
lang: en-US
---
## 简介
## 组件声明方式
### 函数组件
函数组件没有自己状态和生命周期，但基于函数的概念可以延展出很多React的高级玩法，HOC、纯展示组件、或者16.8版本后HOOK增强后对函数组件新增的多个API几乎大部分类组件的功能都能通过HOOK来很好的解决。
```js
  function App(){
  return(
    <div>123123</div>
  )
}
```
### 类组件
#### Component
使用该方式继承的组件有React的生命周期函数和状态等特性
例子：
```js
class ReactComponent extends React.component{
  constructor(props){//ES6类构造函数 用于接收传递的参数，不接受React默认接收并传递给props对象
    super(props)//调用父类的构造方法
    //执行react类组件初始化代码，如接收props并赋值到状态中
    this.state={
      name:"CJ"
    }
  }
  render(){//渲染的JSX语法结果
    return(
      <div> this is a react component{this.state.name}</div>
    )
  }
}
```
#### PureComponent
PureComponent是对Component的性能优化，只做接收props并展示的功能，但是比函数组件多了状态和生命周期，就像是使用了shouldComponentUpdate()函数对props类型为对象时不渲染改变的结果，所以使用PureComponent的组件接收的props父组件中改动了自身也不会有任何变动。
具体使用方法和原Component一样。
## 生命周期
借由官网[生命周期图标](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
先来看看再React类组件中的各种钩子函数：
* constructor: 类构造器函数，最先执行，组件初始化等，用来接受props和其他值(已默认接收)
* componentWillMount:组件挂载前执行
* render: 执行渲染函数，返回JSX功能（Babel编译成createElement形式）
* componentDidMount:组件挂载完毕的函数。
* componentWillReceiveProps:即将废弃：组件所接受的props发生改变时执行的函数,只要父组件render被调用，该函数就会被触发
组件更新时依次执行的函数
* shouldComponentUpdate:性能优化函数，主要用来控制该组件是否重新渲染。
* componentWillUpdate:传递状态改变前的值
* render：重新调用渲染函数渲染。
* componentDidUpdate：
* componentWillUnmount：卸载组件
## Context
contextAPI为16.3后新增，在组件化开发中，如何跨组件优雅的共享状态一直是很棘手的问题，常见的作法也有很多，使用状态管理（引入第三方react-redux,mobx等），嵌套多层的props，使用contextAPI等，用来处理平行组件或跨多层组件之间的通信问题，例如：全局的主题动态配置、处理全局状态（用户登录状态）、数据持久化(存储)等等。Context API用于多组件跨级传值，使用React.createContext()创建对象，该对象下有Provider和Consumer两个对象（生产者和消费者），生产者用于包装需要分享状态的组件，消费者用来接收参数。
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
组件内的所有子组件可接收并共享该数据状态,Consumer组件内函数传递的参数即为context共享的对象，即调用setState参数修改该参数时，视图层也会做出响应。
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
高阶组件类似与高阶函数，用与对组件添加增强功能，如：操纵原组件props，增强生命周期函数，增加额外的状态,以及类似vue中的mixin组件增强，react中并没有此类API，可通过代码实现mixins功能，更多HOC高阶特性玩法还有很多。。。
### 操纵组件props
```js
import React from 'react';
import ReactDom from 'react-dom';
class App extends React.Component{
  render(){
    return(
      <div>{this.props.name}{this.props.age}</div>
    )
  }
}
function HocPropsFunc(WrapComponent){
  let props={
    name:'CJ',
    age:23
  }
  return <WrapComponent {...props} />;//添加props给原组件使用
}
ReactDOM.render(
  HocPropsFunc(App),
  document.getElementById('root')
);
```
### 再次返回类组件增强更多功能
```js
class App extends React.Component{
    state={};
    componentDidMount(){
      console.log('didmount')
    }
    render(){
      return(
        <div>{this.props.name}</div>
      )
    }
  }
  function HOCClassFunction(WrapComponent){
    return class extends React.Component{
        componentDidMount(){
            console.log("WrapComponetn init")//此处可在返回的组件中执行更多
            //组件的操作，从而扩展更多功能
        }
        state={
            name:'CJ',
            age:23
        }
      render(){
        return <WrapComponent {...this.state} />
      }
    }
  }
  ReactDOM.render(
  HOCClassFunction(App),
  document.getElementById('root')
);
```
### 修改组件生命周期函数或修改state状态(mixins)
```js
let ReactMinxins={//自定义mixins对象，可添加React生命周期函数或者一些辅助函数等
    componentDidMount(){
        console.log(" minxins COmponentWillMount");
    }
}
class App extends React.Component{
    state={};//此处必须有一个state对象，否则增强状态时报错找不到对象函数
    componentDidMount(){
      console.log('class didmount')//原生命周期函数
    }
    render(){
      return(//显示增强后的name
        <div>{this.state.name}</div>
      )
    }
  }
  function mixinFunction(WrapComponent){//手写基于React的mixins功能
    let prevFn=WrapComponent.prototype.componentDidMount;//暂存componentDidMount函数
    WrapComponent.prototype.componentDidMount=function(){//重写该函数，此处不能使用
    //箭头函数，否则this指向mixinFunction
      prevFn();//执行暂存的原组件的生命周期方法
      this.setState({//像原组件添加状态
        name:"DJ",
        age:23
      })
      ReactMinxins.componentDidMount();//调用执行mixins方法
    };
    return WrapComponent//返回增强后组件
  }
    ReactDOM.render(
    mixinFunction(App),
  document.getElementById('root')
```
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
