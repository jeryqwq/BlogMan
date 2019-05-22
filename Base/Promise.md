---
title: 异步 | Promise
lang: en-US
---
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
promise有三种状态：padding,reslove,reject,初始化默认是padding等待状态，且只能从padding转换到reslove或者reject，其他两种状态无法做任何转换。当异步执行成功后使用reslove(result)来传递执行后的参数，失败使用reject(msg)来传递，当在执行过程中系统捕捉到错误时，默认抛出reject(err)。接收时使用.then.catch的语法来接收返回的数据。
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
promise1=new Promise((reslove,reject)=>{
    setTimeout(()=>{
        reslove('2秒后')
    },2000)
})
promise2=new Promise((reslove,reject)=>{
    setTimeout(()=>{
        reslove('3秒后')
    },3000)
})
async function test(){
    const result=await promise1;
    const result2=await promise2;
    console.log(result);
    console.log(result2);
    console.log(result,result2)
}
test();
//3秒后同时执行
//2秒后
//3秒后
//2秒后   3秒后
```
## 手写一个Promise