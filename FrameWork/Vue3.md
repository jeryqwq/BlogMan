---
title: Vue3初识
lang: en-US
---
## 关于Vue3
Vue3与10月6号左右宣布即将发布，作者也公开了底层的基于proxy语法重新构建的vue3新版本，大量使用了typescript去构建，rollup打包，风格也借鉴了react 16.8版本的hooks，相当于vue3中没有了this对象(use,mixin等基于this的API可能有改变,router和vuex也将基于inject,providAPI重写--猜测)，底层响应式原理重写(delete,set等由于defineprototypeAPI的缺点产生的API也将没有)，Vue3相关的API可以看这里[Vue Composition API](https://vue-composition-api-rfc.netlify.com/api.html#setup)目前还没出中文版本，熟悉react hooks的可直接上手
#### reactive.js
```js
let {effect}=require('./effect');
let {track,trigger}=require('./track');
let toProxy=new WeakMap();//存储代理对象弱引用，key只能为非简单类型，key为空时方便GC机制回收
let toRaw=new WeakMap();//防止重复代理已经代理过的proxy对象做缓存检查
function reactive(target){
    return createReactiveObj(target)
}
function createReactiveObj(target){
    if(typeof target==='object'||target!=null){//type of null ===object===true
        const targetProxy=toProxy.get(target)
        if(targetProxy){//防止代理重复的代理对象
            return targetProxy;
        }
        if(toRaw.has(target)){//反向映射表防止传入多次代理已代理过的对象
            return target
        }
        let observe=new Proxy(target,{
            get(target,key,receiver){
            console.log('get'+key)
                track(target,key)
                const res=Reflect.get(target,key,receiver);//Reflect能返回操作是否成功
                return res;
            },
            set(target,key,val,receiver){
                let res;
                let oldVal=target[key];
                // console.log('set'+key,val);
                if(!target.hasOwnProperty(key)){//没有属性为新增
                    trigger(target,'add',key);
                }else if(oldVal!==val){//对象已有改属性代表修改
                    res=Reflect.set(target,key,val,receiver);
                    trigger(target,'update',key);
                }
                return res;
            },
            deleteProperty(target,key){
                return Reflect.deleteProperty(target,key)
            }
        });
        toProxy.set(target,observe);//添加代理映射表
        toRaw.set(observe,target);//添加反向代理映射表
        return observe;
    }else{
        return target;
    }
}

let obj=reactive({name:"CJ"});
effect(()=>{//与react effect使用相识，先执行一便
    console.log('effect响应+'+obj.name)//
});
effect(()=>{//与react effect使用相识，先执行一便
    console.log('effect响应2+'+obj.name)//
});
obj.name="CJ2";
obj.name="CJ3";
obj.name="CJ4";
obj.name="CJ5";

//数组类型
// let ar=[1,2,34];
// let p1=reactive(ar);
// p1.length=4
// console.log(ar)

//简单类型
// let t1={name:'CJ'}
// let p1=reactive(t1);
// let p2=reactive(t1);
// let p3=reactive(t1);
// p1.name=123;
// p1.name=345;
// console.log(p1,p2,p3)
```
#### track.js
```js
let {effectStacks}=require('./effect');
let targetMap=new WeakMap();
function track(target,key){//收集依赖
    let effect=effectStacks[effectStacks.length-1];
    if(effect){
        let depsMap=targetMap.get(target);
        if(!depsMap){
            targetMap.set(target,depsMap=new Map());
        }
        let deps=depsMap.get(key);
        if(!deps){
            depsMap.set(key,deps=new Set());
        }
        if(!deps.has(effect)){
            deps.add(effect); 
        }
    }
    
}
function trigger(target,type,key){
    let depsMap=targetMap.get(target);
    if(!depsMap){

    }else{
        let deps=depsMap.get(key);
        if(deps){
            deps.forEach(fn => {
                fn();
            });
        } 
    }
}
module.exports={
    track,
    trigger
}
```

#### effect.js
```js
let effectStacks=[]//effect栈数组
function createReactiveEffect(fn){
    let effect= function(){
        return run(effect,fn)
    };
    effect();
}
function run(effect,fn){
    try {
        effectStacks.push(effect);
    fn();
    } finally{
        effectStacks.pop();
    }
}

module.exports= {
    effect:createReactiveEffect,
    effectStacks
}
```
