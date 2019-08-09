---
title: JS面试题
lang: en-US
---
## 题目收集
1. 找出数字数组中最大的元素（使用Match.max函数）---出自深入JS系列
2. 转化一个数字数组为function数组（每个function都弹出相应的数字）---出自深入JS系列
3. 给object数组进行排序（排序条件是每个元素对象的属性个数） ---出自深入JS系列
4. 利用JavaScript打印出Fibonacci数（不使用全局变量）  ---出自深入JS系列
5. 实现如下语法的功能：var a = (5).plus(3).minus(6); //2   ---出自深入JS系列
```js

```
6. 实现如下语法的功能：var a = add(2)(3)(4); //9   ---出自深入JS系列
```js
 function add(m){
     var sum;
      function fn(n){
         return sum+n;
     }
     return fn;
 }
```
7. 请实现数组降维（将多维数组转换为一维）并按照大小顺序排列 ---以前看到的题目
```js
let arr=[1,2,3,4,5,[6,7,7,8,[14,12,3],5,6,9,0],8,34,56,2,[45,67,3,43]]
Array.from(arr.toString().split(',').sort((a,b)=>parseInt(a-b)))
```
8. 详细讲述下JS中的异步问题，以及setTimeout和promise等异步API的执行顺序(EventLoop)? ---以前看到的题目
9. 深度遍历和广度遍历之间的差别和性能的优缺点以及对这两个算法的理解 ---以前看到的题目
10. 使用函数式编程实现fn(1)(2)(3)(4)转换为fn(1,2,3,4) ---以前看到的题目
11. 二级DOM事件相比一级有什么区别，以及事件委托的好处和实现原理。 ---以前看到的题目
12. React和Vue之间的区别？
13. 实现一个compose函数。
14. 实现数组的常用的原生方法。
15. 如何理解Vue中的MVVM双向绑定原理
16. 有尝试自己从头搭建一个脚手架吗
17. 谈谈你对前端工程话和模块化思想的理解和应用
18. React V16.8后新增的HooksAPI都用过吗，Vue3.0据说也要融入Hooks的概念来书写组件，而且还打算慢慢抛弃以往的template模板写法，这样做有什么好处？
19. 请用代码实现以下效果
```js
LazyMan(LazyMan('Tony');
// Hi I am Tony

LazyMan('Tony').sleep(10).eat('lunch');
// Hi I am Tony
// 等待了10秒...
// I am eating lunch

LazyMan('Tony').eat('lunch').sleep(10).eat('dinner');
// Hi I am Tony
// I am eating lunch
// 等待了10秒...
// I am eating diner

LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');
// Hi I am Tony
// 等待了5秒...
// I am eating lunch
// I am eating dinner
// 等待了10秒...
// I am eating junk food)
```
实现
```js
 class lazyManClass{
    constructor(name){
        this.name=name;
        this.beforeArr=[];
        this.afterArr=[];
        this.statas="BEFORE";
        console.log(`Hello I am ${this.name}`);
        return this;
    }
    sleep(num){
        this.statas='AFTER';
        setTimeout(()=>{
            console.log(`等待了${num}秒`);
            this.afterArr.forEach((item,idx)=>{
                item();
            })
        },num*1000);
        return this;
    }
    sleepFirst(num){
        this.statas='BEFORE';
    setTimeout(()=>{
        console.log(`等待了${num}秒`);
        this.beforeArr.forEach((item,idx)=>{
            item();
        })
    },num*1000)
    return this;
    }
    eat(something){
        this.statas==='AFTER'?this.afterArr.push(()=>{
            console.log(`I am eating ${something}`)
        }):this.beforeArr.push(()=>{
            console.log(`I am eating ${something}`)
        });
        return this;
    }

 }
 function LazyMan(name){
     return new lazyManClass(name);
 }
LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');


```

## 每(wu)日(liao)解决一题

