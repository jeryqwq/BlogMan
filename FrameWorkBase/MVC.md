---
title: MVC原理
lang: en-US
---
## 前言
本次仅针对React 15.8之前的代码原理解析说明，16版本以上React的fiber架构和时间分片机制使React变得极其复杂
## React原理分析
### JSX:
react中所有的类似html代码到最终都会被[babel](https://www.babeljs.cn/)编译为createElement的形式,[createElement实现](https://jeryqwq.github.io/FrameWorkBase/VisualDom.html)。
```js
<div>
  <a>
  	target
  </a>
</div>
使用babel编译后:
React.createElement("div", null, React.createElement("a", null, "target"));
```
我们再来看看函数式组件，babel会编译成什么样子
```js
function test(){
  let name="CJ";
  	return(
      	<div>
        	{name} 		
      	</div> 
      ) 	 
}
babel编译后：
"use strict";
function test() {
  var name = "CJ";
  return React.createElement("div", null, name);
}
//这样就能很好的解释为什么return内含的变量和函数能够被渲染和执行
```
我们来看看更复杂的函数组件，含有map遍历和传递参数
```js
function test(){
  let name="CJ";
  	return(
      	[1,2,3,4,5].map((item,idx)=>
        <div name={name}>
        	{name} 		
      	</div> 
       	)
      )
}
babel编译后：
"use strict";
function test() {
  var name = "CJ";
  return [1, 2, 3, 4, 5].map(function (item, idx) {//循环渲染五个div
    return React.createElement("div", {
      name: name//节点props
    }, name/*子节点的内容*/);
  });
}
```
### 组件:
在React中，组件分为两种，即函数组件和类组件。
看看比较复杂的类组件
```js
class Test extends React.Component{
	constructor(props){//es6 接收参数
		super(props);
		console.log(this.props);//{name:'CJ'}
		this.state={
			name:'CJ'
			}
		}
		render(){
			return(//编译为createElement渲染
				<div>
				{this.state.name}
				</div>
			)
		}
}
ReactDOM.render(
	<Test name='CJ'/>,//渲染改类的render函数，等同于new Test({name:'CJ'}).render()
	document.getElementById('example')
);
//等同于
ReactDOM.render(
	new Test({name:'CJ'}).render(),//渲染时调用实例化后该函数的render方法
	document.getElementById('example')
);
```
函数组件就比较简单了
```js
function Test (props){
    let name="CJ";
    return (
        <div>
            {props.name}
        </div>
    )
}
ReactDOM.render(
	<Test name="CJ"/>,//直接运行函数即可渲染
	document.getElementById('example')
);
//等同于
ReactDOM.render(
	Test({name:'CJ'}),
	document.getElementById('example')
);
```
基于上面这些特性，我们就能写出一个拥有上述功能的小小小小的react。