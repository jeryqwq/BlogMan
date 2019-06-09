---
title: ES6,ES7
lang: en-US
---
## 类
## 箭头函数
## 解构赋值
## 模板字符串
## 对象字面量
## 展开运算符
## proxy
代理模式：为对象的访问、赋值、属性查找等启用中间层代理，先执行代理的函数，后根据情况返回具体的内容。与Object.defineprotype相似，使用get和set函数对被代理的对象进行操作。
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
## Babel编译
