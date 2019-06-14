---
title: ES6,ES7
lang: en-US
---
## 类

## 箭头函数
箭头函数为es6的函数另一种写法，相比原function的写法，箭头函数更能体现参数流向，且箭头函数中的this指向当前所在域的this。
```js
function test(){

} 
```
## 解构赋值
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
