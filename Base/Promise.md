---
title: 异步 | Promise
lang: en-US
---
## 同步异步
* 浏览器是多线程的，JS是单线程的（浏览器仅分配一个线程来执行JS，JS无法同时执行多个任务）
* 多个线程组成一个进程，例如浏览器多个标签页面。线程用于执行JS代码就，加载Dom树，加载其他资源等。
### 同步
在一个线程上同一个时间只能做做一件事，当前事件完成才能进行下一个任务（先将任务推进队列，执行后出栈--先进先出）。
### 异步
队列中执行任务，发现该任务是异步的，例如setTimeout、ajax、事件绑定、async/await、Promise等，js会将他移除任务队列，放入等待任务队列中，浏览器监听该异步任务是否有到指定的触发执行条件，如果主任务队列执行完后，浏览器监听会将已经满足异步触发条件的任务再次放入到任务队列中执行，所以JS中不可能出现同时执行多个任务。

## Promise用法
从刚学前端的那会，记得那时候的异步控制还是使用callBack来控制，个人觉得callBack也挺好用的，也不会说什么存在什么回调地狱这种情况，可能是没有处理一些复杂的业务吧，直到后来promise，async await此处跳过中间还有个es7的叫什么名字忘记了，最后async await的问世才被成为js异步的终结者，大家开始使用这种方法来处理异步，前端感觉没怎么用到，koa、egg和express等后端框架中，async几乎成为各大node后端框架的标配。
### callBack
```js
function cbFn(option,cb){
    setTimeout(()=>{
        cb(123);
    },2000)
}
cbFn({},(res)=>{
    console.log('callBack',res)
})
```
过2秒后输出了callBack,123。
### Promise
promise有三种状态：pedding,fulfilled,rejectd,初始化默认是padding等待状态，且只能从padding转换到fulfilled或者rejectd，其他两种状态无法做任何转换。当异步执行成功后使用reslove(result)来传递执行后的参数，失败使用reject(msg)来传递，当在执行过程中系统捕捉到错误时，默认抛出reject(err)。接收时使用.then.catch的语法来接收返回的数据。
#### then reslove触发
```js
var test=new Promise((reslove,reject)=>{
    setTimeout(()=>{
        reslove('CJ');
    },2000)
})
test.then((res)=>{
    console.log(res);//  接收成功后的参数
}).catch((err)=>{
    console.log('捕捉到错误：'+err);
})
//两秒后打印CJ
```
#### catch reject触发
```js
var test=new Promise((reslove,reject)=>{
    setTimeout(()=>{//手动判定失败
        reject('这是手动判断的失败');
    },2000)
})
test.then((res)=>{
    console.log(res);//接收成功后的参数
}).catch((err)=>{
    console.log('捕捉到错误：'+err);//接收失败后的参数或者系统错误
})
//两秒后打印：捕捉到错误：这是手动判断的失败
```
#### catch 捕捉错误
```js
var test=new Promise((reslove,reject)=>{
    throw new Error('这是手动抛出的错误');
    setTimeout(()=>{
        reslove('CJ');
    },2000)
})
test.then((res)=>{
    console.log(res);//接收成功后的参数
}).catch((err)=>{
    console.log('捕捉到错误：'+err);//接收失败后的参数或者系统错误
})
//打印：捕捉到错误：Error: 这是手动抛出的错误
```
## 链式Promise
Promise支持链式回调，then或者catch后可再次返回一个Promise可继续使用.then.catch的语法进行接收数据和处理。
```js
promise1=function(){
    return new Promise((reslove,reject)=>{
    setTimeout(()=>{
        reslove('2秒后')
    },2000)
  })
}
promise2=function(){
    return new Promise((reslove,reject)=>{
    setTimeout(()=>{
        reslove('3秒后')
    },3000)
})
}
promise1().then((res)=>{
  console.log(res);
   return promise2();
}).then((res)=>{
    //上一轮管控的异步方法只要没报错都执行此次函数
  console.log(res)
})
//2秒后 两秒后输出
//3秒后 五秒后输出

```
## Promise.all
Promise.all用于处理多个异步情况，处理时间取决于最长的异步处理时间，只有全部成功后才会跳转到then中，并传递一个数组存储多个promise执行后的结果，任何一个无论手动抛出还是捕捉到的错误都会执行到catch中捕捉到错误信息。
```js
var test=Promise.all([new Promise((reslove)=>{
    setTimeout(()=>{
        reslove(1);
    },1000)}),new Promise((reslove,reject)=>{
    setTimeout(()=>{
        reslove(2);
    },2000)
})])
test.then(res=>{
    console.log(res)  // 两秒后输出[1, 2]
}).catch((err)=>{
    console.log(err)
})
```
当数组中的任何一个promise状态改变为reject或者捕捉到错误，会立即跳转到catch方法中且不执行其他的promise，故在错误的promise之后的其他promise都不执行，直接返回undefined
```js
var test=Promise.all([new Promise((reslove,reject)=>{
    setTimeout(()=>{
        reject(1);
    },1000)}),new Promise((reslove,reject)=>{
    setTimeout(()=>{
        reject(2);
    },2000)
})])
test.then(res=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
})
//仅输出1
```
## Async await
层次深的promise感觉还是有点深层嵌套的感觉，一层套一层，直到ES8的 async await 的出现使js的异步更加易于书写，便于理解。只要在函数定义前加一个async关键词，说明该函数是一个异步函数，在定义异步变量前添加await，在此之后所有对该变量的引用都将等待所有异步获取的变量成功的reslove后。与Promise.all相似，运行时间取决于最长的异步的时间，要求更高的性能的话只能使用单独的promise进行异步流程控制。
```js
promise1=function(){
    console.log(' enter promise1')
    return new Promise((reslove,reject)=>{
    setTimeout(()=>{
        console.log('promise1 exec')
        reslove('2秒后')
    },2000)
  })
}
promise2=function(){
    console.log(' enter promise2')
    return new Promise((reslove,reject)=>{
    setTimeout(()=>{
        console.log('promise2 exec')
        reslove('3秒后')
    },3000)
})
}
async function test(){
    const result=await promise1();
    // 先把await后的函数执行
    const result2=await promise2();
    console.log(result);
    console.log(result2);
    console.log(result,result2)
}
console.log('begin')
test();
// begin     //执行
// enter promise1 //两秒后
// promise1 exec  两秒后
// enter promise2  两秒后
// promise2 exec  三秒后
// 2秒后   三秒后
// 3秒后   三秒后
// 2秒后 3秒后   三秒后
```
发现async挺神奇的，总觉得他似乎能追踪到异步所执行的时间，我所认为的输出应该是begin=>enter promise1=>enter promise2=>promise1 exec=>promise2 exec=>输出结果,但是它似乎好像追踪到了promise2的reslove的激活时间，promise1 exec和enter promise2竟然是同时输出的，可能内部已经提前运行了一遍。
## 宏任务 macro task
* 定时器
* 事件绑定
* ajax
* 回掉函数
* Node下fs模块文件读取操作
## 微任务 micor task
* Promise Promise并不是完全异步，只有在执行reslove或者reject的时候，此时才是异步，函数内的操作还是基于同步的;
* process.nextTick:优先于其他的异步操作。主任务队列之后，其他任务之前执行，例如做一些初始化并不影响系统服务正常开启的功能代码时。

## 执行顺序
在挂起任务时，JS 引擎会将所有任务按照类别分到这两个队列中，首先在 macrotask（宏任务） 的队列中取出第一个任务，执行完毕后取出 microtask（微任务）队列中的所有任务顺序执行；之后再取 macrotask 任务，周而复始，直至两个队列的任务都取完。执行顺序：同步任务=>异步任务=>宏任务=>微任务

## 手写一个Promise
### Promise A+规范
