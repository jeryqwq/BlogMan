---
title: ES6,ES7
lang: en-US
---
## let const

## class
### extends的n种实现方式
在读懂本篇之前，你需要对原型链和prototype有一定的了解(--proto--)

## 箭头函数
箭头函数为es6的函数另一种写法，相比原function的写法，箭头函数更能体现参数流向，且箭头函数中的this指向当前所在域的this。
* 箭头函数中没有arguments对象，需使用...args来接受为一个数组。
* 箭头函数this始终指向当前this指向。
* 箭头函数只穿一个参数时可以省略小括号。
* 箭头函数中传参可赋值一个默认参数,如果该参数没有传递时使用默认替代。
```js
var test=(name="JC")=>{
    console.log(name)
}
test(); //JC
test("CJ");//CJ
//箭头函数指针
var A =function(){
    this.test=function(){
        console.log(this)
    }
}
var a1 =new A();
a1.test.call(1);//1 function定义的函数的this指向可以使用call,apply,bind来实现
// --------
var A =function(){
    this.test=()=>{
        console.log(this);
    }
}
var a1 =new A();
a1.test.call(1);//A {test: ƒ} 箭头函数this指向无法被改变

```
## 解构赋值
快速取得对象或数组对应的参数
```js
let [a,b]=[1,2];
console.log(a,b);//1 2
let [c,[d]]=[1,[2]];
console.log(c,d);//1 2



//------------
//对对象取值
let {name}={
    name:'CJ',
    age:24,
    likes:[]
}
console.log(name)  //CJ
//使用剩余运算符接收
var {name,...args}={
    name:'CJ',
    age:24,
    likes:[]
}
console.log(name,args) //CJ {age: 24, likes: Array(0)}
```
## 模板字符串
## 对象字面量
## 展开运算符
## proxy
代理模式：为对象的访问、赋值、属性查找等启用中间层代理，先执行代理的函数，后根据情况返回具体的内容。与Object.defineprotype相似，使用get和set函数对被代理的对象进行操作。仅说明常用的get和set拦截，更多访问拦截请查看官方文档。
```js
var target = {
    name: 'CJ',
    likes: ["reading", 'coding']
}
var proxy = new Proxy(target,{
    get(target,key,value){
        if(key==="age"){
            return 23
        }else{
            return target[key]
        }
    }
});

```
## decorator(装饰器)
使用过JAVA应该都会了解装饰器，spring MVC中用来修饰类或者方法，@Controller|@RequestionMapper,对类或则方法功能进行增强。
## Babel编译
