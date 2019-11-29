---
title: Vue3初识
lang: en-US
---
## 关于Vue3
Vue3与10月6号左右宣布即将发布，作者也公开了底层的基于proxy语法重新构建的vue3新版本，大量使用了typescript去构建，rollup打包，风格也借鉴了react 15.8版本的hooks，相当于vue3中没有了this对象(use,mixin等基于this的API可能有改变,router和vuex也将基于inject,provid API重写--猜测)，底层响应式原理重写(delete,set等由于defineprototypeAPI的缺点产生的API也将没有)，Vue3相关的API可以看这里[Vue Composition API](https://vue-composition-api-rfc.netlify.com/api.html#setup)目前还没出中文版本，熟悉react hooks的可直接上手。个人还是更期待react17.x后的concurrent模式带来的提升，hooks也早已是react提出已久的编程思想了。
## 核心API

### reactive

响应式核心，相关核心API依赖，使用proxy代理对象并返回proxy，相当于Vue2的definePropertyAPI，避免了数组的缺陷，可劫持数据的所有操作，具体查看相关API文档

### effect

与react的useEffect用法相识，当前先触发一次，之后对数据的更改都会执行该函数，仅对所传递的函数内有响应式的数据生效，且只有函数内的变量状态改变才触发，依赖收集很巧妙的利用JS单线程的特点，极大程度上自动优化了框架性能，使用者不必太关心性能问题。

## 运行

打包一份vue3的代码，试试效果


```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./vue.global.js"></script>
    <!-- vue仓库打包的代码 -->
</head>
<body>
    <script>
        let obj1={
            name:'CJ',
            age:23
        }//原对象
        let p1=Vue.reactive(obj1);//返回代理后的proxy对象
        console.log(p1);//Proxy{name:"CJ}
        Vue.effect(()=>{//影响：当p1的name属性发生改变时触发函数执行，仅仅只有name属性更改触发
            console.log("effect1:name改变"+p1.name);
        })//立即执行一次 打印effect1:name改变CJ

        Vue.effect(()=>{//同上
            console.log("effect2:name改变"+p1.name);
        })//立即执行一次 打印effect2:name改变CJ
        Vue.effect(()=>{//影响：当p1的age属性发生改变时触发函数执行，仅仅只有age属性更改触发
            console.log("effect1:age改变"+p1.age);
        })//立即执行一次 打印effect1:age改变23
        Vue.effect(()=>{//同上
            console.log("effect2:age改变"+p1.age);
        })//立即执行一次  打印effect2:age改变23

        p1.name="CJI@";//name属性有两个effect函数，所以执行两次
        // effect1:name改变CJI@
        // effect2:name改变CJI@
        p1.name="CJI1";//同理
        // effect1:name改变CJI1
        // effect2:name改变CJI1
        p1.name="CJI2";//同理
        p1.name="CJI3";//同理
        p1.age=24;//age更改也有两个effect，也是两次。
         // 控制台结果
        // effect1:age改变24
        // effect2:age改变24
    </script>
</body>
</html>
```
开始感觉真的很奇怪，vue3是如何做到effect内的函数仅因为自己函数内有的变量改动才会触发执行，感觉好神奇，每次依赖收集都能收集如此颗粒化。




### reactive.js
```js
llet {track,trigger}=require('./track');//触发器和收集依赖
import {proxyConstructor,Handle} from './interface';//ts接口，类型约束handler和proxy
let toProxy=new WeakMap();//存储代理对象弱引用，key只能为非简单类型，key为空时方便GC机制回收对用的value
let toRaw=new WeakMap();//防止重复代理已经代理过的proxy对象做缓存检查
export function reactive(target:any){//就是想和源码一样的调用过程而已
    return createReactiveObj(target)
}
let handle:Handle={//proxy处理函数，new proxy传入处理器，建议先跳到createReactiveObj方法
    get(target,key,receiver){
        track(target,key)//effect内包裹的函数每次先执行都会获取内部被劫持变量
        //触发对应的get，执行依赖收集
        const res=Reflect.get(target,key,receiver);//Reflect能返回操作是否成功
        return res;
    },
    set(target,key,val,receiver){
        let res:boolean;
        let oldVal=target[key];
        if(!target.hasOwnProperty(key)){//没有属性为新增
        //防止劫持对象为数组时触发两次set避免不必要的更新
        //第一次改变为设置该数组的下标，如果是删除或者新增是则会触发该数组第项的length对象的改变
            trigger(target,'add',key);//通知触发器执行对应的依赖
            res=Reflect.set(target,key,val,receiver);//使用reflect能够返回操作是否成功
            return res;
        }else if(oldVal!==val){//对象已有改属性代表修改
            res=Reflect.set(target,key,val,receiver);
            trigger(target,'update',key);//通知触发器执行对应的依赖
            return res;
        }
        return false;
    },
    deleteProperty(target,key){
        return Reflect.deleteProperty(target,key)
    }
};
//代理监测
function createReactiveObj<T extends Object >(target:T|any):proxyConstructor{
    if(typeof target==='object'||target!=null){//type of null ===object===true
        const targetProxy=toProxy.get(target)//代理映射表弱引用，查看是否以及被代理过
        if(targetProxy){//防止代理重复的代理对象
            return targetProxy;
        }
        if(toRaw.has(target)){//反向映射表防止传入多次代理已代理过的对象
            return target
        }
        let observe:proxyConstructor=new Proxy(target,handle);
        toProxy.set(target,observe);//添加代理映射表
        toRaw.set(observe,target);//添加反向代理映射表
        return observe;
    }else{
        return target;
    }
}
```
### track.ts
effect函数收集监听对象effect里target对应的函数，利用执行函数时会访问到函数内监听对象的值，触发handler的get，执行收集依赖，相同的key放入同一个set集合,改变时在set函数内触发对应key的set集合的函数依次执行

```js
let {effectStacks}=require('./effect');//存储effect函数的栈接口数组
let targetMap=new WeakMap();
export function track(target,key){//收集依赖
    let effect=effectStacks[effectStacks.length-1];//得到effect内的函数
    if(effect){
        let depsMap=targetMap.get(target);//查看是否有该对象map
        if(!depsMap){//没有则新建对应target的map对象
            targetMap.set(target,depsMap=new Map());
        }
        let deps=depsMap.get(key);//得到该map下的所收集的set集合的依赖
        if(!deps){//没有则新建空set
            depsMap.set(key,deps=new Set());
        }
        if(!deps.has(effect)){//没有effect则添加
            deps.add(effect); 
        }
    }
}//函数执行一遍后targetMap内的结构就应该是这样的解构
// {
//     target:{
//         key:[effect1,effect2,effect3]//,
//         key:[effect1]
//     },
//     target2:{
//         key:[effect1,effect2,effect3]//,
//         key:[effect1]
//     }
// }
export function trigger(target,type,key){//触发依赖执行
    let depsMap=targetMap.get(target);//获取对象下的map
    if(!depsMap){

    }else{//有map的话就代表该map下有set集合的effect函数
        let deps=depsMap.get(key);//是否有该key的effect set集合
        if(deps){//有就遍历整个set对象执行对应的effect内的函数
            deps.forEach(fn => {
                fn();
            });
        } 
    }
}

```

### effect.ts
存储effect栈数组，每次effect函数调用时都会往effect栈数组推入依赖的函数，然后执行一次effect内包裹的函数去触发proxy的get，再去触发收集依赖，以特定的格式收集存储该依赖，执行完毕后移除push的effect函数。

```js
 let effectStacks:Array<Function>=[];
 function createReactiveEffect(fn:Function):void{
    let effect =function(){
        return run(effect,fn);
    }
     effect();
}
function run (effect:Function,fn:Function):void{
    try{
        effectStacks.push(effect);//effect栈推入effect函数
        fn();//首次调用，执行一次，触发get函数内的track收集依赖，此时的栈内已有effect函数。
        //track会将该函数已特定的形式存储起来
    }finally{
        effectStacks.pop();//删除push的effect，等待下次effect调用该函数，再次重新执行
    }
}
 
 function effect (fn:Function){
    return createReactiveEffect(fn);
}
export {
    effectStacks,
    effect
};
```
### 效果

使用node去执行对应的代码

```js
import {reactive} from './reactive';
import {effect } from './effect';
let obj1={name:'CJ'}
let p1=reactive(obj1);
effect(()=>{
    console.log("effect1:"+p1.name)
})
effect(()=>{
    console.log("effect2:"+p1.name)
})
p1.name="CJI@";
p1.name="CJI1";
p1.name="CJI2";
p1.name="CJI3";
//输出顺序
// effect1:CJ name effect1 首次执行
// effect2:CJ name effect2首次执行
// effect1:CJI@  name  effect1 修改触发
// effect2:CJI@  name  effect2 修改触发
// effect1:CJI1   name  effect1 修改触发
// effect2:CJI1
// effect1:CJI2
// effect2:CJI2
// effect1:CJI3
// effect2:CJI3
```