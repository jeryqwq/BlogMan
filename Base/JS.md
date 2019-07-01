---
title: JS
lang: en-US
---
##  this指向(call,apply,bind重写)
this指向一直是老生常谈的问题，在非箭头函数内this指向一直指向调用他的那个对象，setTimeout等异步操作中this指向全局window对象，使用call和apply可以改变this的指向，也可以使用bind返回一个改变this指向后的函数。
```js{4}
var Obj={
    name:'CJ',
    sayName:function(){
        console.log(this.name)
    }
}
var name="DJ";
var f1=Obj.sayName;
console.log(Obj.sayName());//CJ  this指向Obj，故输出Obj的name属性
console.log(f1());//DJ  this指向window，故输出window.name
```
call、apply、bind的使用
```js{4}
var Obj={
    name:'CJ',
    sayName:function(){
        console.log(this.name)
    }
}
var name="DJ";
var f1=Obj.sayName;
Obj.sayName.call(window);//DJ 将this指向全局window，后面可依次传递更多参数
Obj.sayName.apply(window);//DJ 将this指向全局window，后面传递的参数必须为数组对象
let fn1=Obj.sayName.bind(window);// 将this指向window并返回一个新函数
fn1();//DJ
```
重写call,apply和bind
```js{4}
Function.prototype.call=function(that,...args){
   that['_fn']=this;
   this(...args);
   delete that['_fn'];
}
Function.prototype.apply=function(that,arr){
   that['_fn']=this;
   this(...arr);
   delete that['_fn'];
}
Function.prototype.bind=function(that){
   that['_fn']=this;
   setTime  out(function(){
       delete that['_fn'];
   },0)
   return this;
}
var Obj={
    name:'CJ',
    sayName:function(){
        console.log(this.name)
    }
}
var name="DJ";
var f1=Obj.sayName;
Obj.sayName() //CJ
Obj.sayName.call(window,1,2,3);//DJ 将this指向全局window，后面可依次传递更多参数Obj.sayName
Obj.sayName.call(window,[1,2,3]);//DJ 将this指向全局window，参数传递数组
var fn1=Obj.sayName.bind(window);// 将this指向window并返回一个新函数
fn1();//DJ

```
##  原型链
* 所有的函数数据类型都有一个属性：prototype，这是一个对象，浏览器会默认给他开辟一个堆内存。(用来存储一些公共的属性或者方法提供给实例调用)
* 在开辟的内存中，有一个自带的constaructor属性，存储当前属性本身。Array.prototype.constructor===Array //true
* 每一个对象都有一个__protot__属性，指向当前实例所属类的prototype，如果不能确定是谁的，都是Object的实例
### 原型链机制
每个对象都有一个__proto__属性，指向该对象的原型,即p1__proto__===Person.prototype表达式成立
```js
var Person=function(){
    this.say=function(){
        console.log('saying...')
    }
    this.eat=function(){
        console.log('eating...')
    }
}
Person.prototype.name="Person"
var p1=new Person();
var p2=new Person();
p1.__proto__===Person.prototype; //true 实例的__proto__指向该对象的原型
p1.__proto__.constructor===Person //true 实例的原型上的构造函数指向父类
Person.__proto__.constructor===Function //true Person的原型上的构造函数指向Function，String,Array,RegExp等均指向Function
p1.name===p2.__proto__.name//true 都是查找到原型上的name属性  查找顺序为
// p1.name=>p1.__proto__.name(已找到)=>p1.__proto__.__proto__.name   
//即：p1.name=>Person.prototype.name=>Object.prototype.name
Object.hasOwnProperty===p1.hasOwnProperty //true  此处都是为Object原型上的属性
p1.say===p2.say//false  this指向两个不同的函数
```
搞不懂为什么p1__proto__会等于Person.prototype,p1__proto__.constructor会等于Person,而Person.prototype.constructor会等于Person,实例没有prototype属性，所以只能使用__proto__访问原型？

## 对象拷贝
JS一些基本的数据类型和引用拷贝就不说了，直接进入主题，深度拷贝吧。
1. 针对Object对象的深度拷贝
```js
JSON.parse(JSON.stringfy(obj));
```
## 闭包
闭包在应用中非常常见，他的好处也有相当多，例如：
1. 他开辟了新的作用域，可以获取到外部函数和变量，而外部却无法访问到闭包内部的作用域内容，减少了代码变量冲突等问题。
2. 可以存储该函数的信息，会保存在内存中不被GC回收,使用完务必将对象指向null。
```js{4}
function f1(){
    var num1=1;
    return function(){
        console.log(num1)
    }
}
let f2=f1();
f2();//1
f2=null;//释放内存
console.log(num1)//num1 is not defined
```

3. 缩小作用域范围，更快的查找到变量，在一些框架源码中:
```js{4}
(function(win){
    //传入window，缩小作用域范围，使浏览器避开全局对象更快的查找到window对象；
    win.$=win.Jquery=function(){

    }
})(window)
```
4. 闭包只能获取到该函数变量的最后的值，常见的情况就是使用var定义变量后循坏。
```js{4}
function f1(){
    var arr=[];
    for(var i=0;i<5;i++){
        arr[i]=function(){
            console.log(i)
        }
    }
    console.log(i)//函数向上查找，执行到这里时i的值是5,所以在下面函数中访问i的变量的时候为5，
    //在同一作用域中的同一变量在未经修改的情况下是相同的。
    arr[0]()// 5
    arr[3]()// 5
}
f1()
```
解决方法：1. 再次返回一个闭包，闭包内传入该函数的变量,存储当时的变量信息。
```js{4}
function f1(){
    var arr=[];
    for(var i=0;i<5;i++){
        arr[i]=(function(i){
            return function(){
                console.log(i)
            }
        })(i)
    }
    //此时返回的是闭包，闭包内存储着i当时的信息
    arr[0]()// 0
    arr[3]()// 3
}
f1()
```
解决方法：2. 使用let定义变量，在ES5中，只有函数作用域和全局作用域，ES6的新增了块级作用域,let定义的变量每次都会开启一个新的块级作用域，每次循坏都保存了一个i，而var是函数作用域，for循坏无论执行多少次，都是去该函数里面找，该函数只对应一个i，所以每次的i都是最终的i。
```js{4}
function f1(){
    var arr=[];
    for(let i=0;i<5;i++){
        arr[i]=function(){
            console.log(i)
        }
    }
    arr[0]()// 0
    arr[3]()// 3
}
f1()
```
## 函数式编程
### 柯里化函数
目前对柯里化函数的理解层次还停留于传递函数和返回函数的阶段，接收多个参数，返回接收剩下参数的新函数的概念。
实现：
```js
function currying(fn,...rest1){
    return function(...rest2){
        return fn.apply(null,rest1.concat(rest2))
        //外层的函数传递一个函数，将两次所传递的参数整合并执行。
    }
}
function test(...args){
       console.log(args)
}
var item1=currying(test,1,2,3,4);
item1(5,6) //输出[1, 2, 3, 4, 5, 6]，
```
柯里化函数还有其他功能，例如延迟执行，一个函数内的变量状态保存在内存中并不会被回收(闭包)
```js
var curryAdd=function (...rest){
    const _args=rest;
    //每次_args等于下方返回数据再push后的结果
    return function cb(...rest){
        if(rest.length===0){
            return _args.reduce((a,b)=>a+b);
        }else{
            _args.push(...rest);
             return cb;
        }
    }
}()//闭包保存存储的数组

curryAdd(1);
curryAdd(2);
curryAdd(3);
curryAdd(4);
curryAdd();// 输出10
//接下来我们抽离一下逻辑代码
var curry=function (fn){
    const _args=[];
    return function cb(...rest){
        if(rest.length===0){
            return fn.call(this,_args);
        }else{
            _args.push(...rest);
             return cb;
        }
    }
}
var curryAdd=curry((args)=>{
    return args.reduce((a,b)=>a+b)
})
//curry传递的事件中args为处理后的暂存数组对象，所以具体逻辑抽到对应的方法中代码更清晰。
curryAdd(1);
curryAdd(2);
curryAdd(3);
curryAdd(4);
curryAdd();
```
## 防抖
防抖节流傻傻分不清楚，至今对这两个概念还挺懵逼的，不都是控制调用的间隔的不同来实现高频率处理下的性能优化，只不过一个使用setTimeout，另一个使用时间戳相减。
最初版本的防抖---
```js
var debounce = function() {
    let timer;//立即执行函数，保存timer变量
    return (fn)=>{
        clearTimeout(timer)//每次调用清空上次的状态
        timer = setTimeout(()=>{//再次赋值定时器
            fn.call(this)
        }, 2000)
    }
}()
function test() {
    console.log(this, 1)
}
debounce(test)
debounce(test)
debounce(test)//两秒后输出一次window,1
```
此时，我们再添加一个新功能，要求首次调用时立刻执行，我们做如下修改。
```js
var debounce = function() {
    let timer;//立即执行函数，保存timer变量
    let isFirst=true;
    return (fn,interval)=>{
        if(isFirst){
            isFirst=false;
            fn.call(this);
        }else{
            clearTimeout(timer)//每次调用清空上次的状态
            timer = setTimeout(()=>{//再次赋值定时器
                fn.call(this)
            }, interval)
        }
    }
}()
function test() {
    console.log(1)
}
//两秒后输出一次1
debounce(test,2000)
debounce(test,2000)
debounce(test,2000)
debounce(test,2000)
```
可是，人家的防抖能取消执行
```js
var debounce = function() {
    let timer;//立即执行函数，保存timer变量
    let isFirst=true;
   
    return (fn,interval)=>{
         fn['cancel']=function(){//将取消函数挂载到fn中，即test
         clearTimeout(timer)
        }
        if(isFirst){
            isFirst=false;
            fn.call(this);
        }else{
            clearTimeout(timer)//每次调用清空上次的状态
            timer = setTimeout(()=>{//再次赋值定时器
                fn.call(this)
            }, interval)
        }
    }
    
}()
function test() {
    console.log(arguments)
}
debounce(test,2000)//仅立即执行一次
debounce(test,2000)
debounce(test,2000)
debounce(test,2000)
test.cancel()
```
## 节流
节个鸡儿，老子今晚不想节了🙃
## 浅谈类型判断
类型判断一直是JS的迷，各种判断命令总是会在一些特定的情况下出现预料之外的情况，总结下常规的typeof,instanceof,Object.prototype.toString.call,--proto--.constructor===目标类型
1. typeof：使用typeof常用来判断一些简单的类型判断，例如String，Number等，返回该对象类型的小写字符串，但是使用typeof来复杂类型时，typeof并不能很准确的判断出一个对象的类型
```js
typeof []   //"object"
typeof {}//"object"
typeof null//"object"
typeof RegExp//"function"
typeof  function(){}//"function"
typeof 1//"number"
typeof ''//"string"
typeof undefined//"undefined"
```
2. instanceof：主要用于判断是否是该对象的实例对象,可判断复杂对象，例如数组，函数等，但是使用字面量的方式创建的基本对象(number,string)对象并不能准确的判断其类型
```js
123 instanceof Number //false
new Number(1) instanceof Number //true
'' instanceof  String//false
new String(123) instanceof String //true
[] instanceof  Array//true
RegExp instanceof  Function//true
Object instanceof Object //true
```
3. Object.prototype.toString.call：调用原型上的toStirng方法对该对象进行判断，然后对返回字符串做截取处理，能很精确的判断对象的具体的类型。
```js
Object.prototype.toString.call(1)//"[object Number]"
Object.prototype.toString.call('')//"[object String]"
Object.prototype.toString.call({})//"[object Object]"
Object.prototype.toString.call([])//"[object Array]"
Object.prototype.toString.call(function(){})//"[object Function]"
Object.prototype.toString.call(null)//"[object Null]"
Object.prototype.toString.call(undefined)//"[object Undefined]"
//封装函数后如下：
function getType(val){
    var longRes=Object.prototype.toString.call(val);
    return longRes.slice(8,longRes.length-1);
}
getType(1);//"Number"
getType('');//"String"
getType([]);//Array
getType(function(){});//Function
getType(null);//Null
getType(undefined);//Undefined
getType(/\//);//"RegExp"
getType(RegExp);//"Function"
```
4. 你以为这已经准确了吗? 当判断实例对象的时候，使用以上方法都不能很好的判断该实例的父类，而我们自己创造的对象，我们也希望能够像上述判断一样能够知晓是否是该对象。
```js
function getType(val){
    var longRes=Object.prototype.toString.call(val);
    return longRes.slice(8,longRes.length-1);
}
var Person=function(){};//父类
var p1=new Person();//实例化一个子类
getType(p1);//"Object"
p1 instanceof Person;//true
typeof p1;//"object"
```
在[原型链中](https://jeryqwq.github.io/Base/JS.html#%E5%8E%9F%E5%9E%8B%E9%93%BE)，每个新开辟的实例都有一个自带的constaructor属性，存储当前属性本身，即Array.prototype.constructor===Array是成立的，每次实例化对象的__proto__的指向该对象的原型，所以[].__proto__.constructor===Array也是成立的，所以从对象的原型上下手查找该对象的名称。
```js
function getType(val){
    return val['__proto__']['constructor']['name'];
}
getType(1)//"Number"
getType('')//"String"
getType([])//"Array"
getType(RegExp)//"Function"
getType(/\//);//"RegExp"
getType(p1);//"Person"
```

## compose
假设现有多个函数，上一个执行的函数的结果需要传递到下一个函数进行加工后再次返回到下一个函数，以此类推。
```js
function toLowerCase(arg){
    return String.prototype.toLowerCase.call(arg);
}
function startWithA(arg){
    return `A+${arg}`
}
function endWithZ(arg){
    return `${arg}+B`
}
function others(arg){
    return arg+"xxxxx"
}
//首先会想到的做法是：
toLowerCase(startWithA(endWithZ(others('begin'))))
```
总觉得这种在写法上复杂且可阅读性不好，在redux源码中看到了compose方法，很大的程度上增强了代码的可读性。
```js
function toLowerCase(arg){
    return String.prototype.toLowerCase.call(arg);
}
function startWithA(arg){
    return `A+${arg}`
}
function endWithZ(arg){
    return `${arg}+B`
}
function others(arg){
    return arg+"xxxxx"
}
var compose=function(...fns){//使用fns接收函数传递的需要依次执行的函数
    return function(initArg){//initArg接收传递的BEGIN
       return fns.reduce((prev,next)=>{//reduce函数传入初始值,返回最终执行后的结果
            return next(prev)//每次返回的参数为prev，next为每次遍历的函数，故使用next传递prev并执行
        },initArg)
    }
}
//使用箭头函数进行简化后
//reduce默认从做到右遍历
var compose=(...fns)=>(initArg)=>fns.reduce((prev,next)=>next(prev),initArg);
//使用reduceRight 从右至左一次执行。
var composeRight=(...fns)=>(initArg)=>fns.reduceRigth((prev,next)=>next(prev),initArg);
var res=compose(toLowerCase,others,startWithA,endWithZ)('BEGIN')//"A+beginxxxxx+B"
var resRight=composeRight(toLowerCase,others,startWithA,endWithZ)('BEGIN')//"a+begin+bxxxxx"
```
## 数组常用方法重写
个人觉得只有重写了该方法API，并实现其一样的功能才算是彻底的了解了该API的真正含义。语言解释上也都是从个人的角度出发，所以有些语言上并不是很官方。重写并没有对参数做判断，默认传递符合的参数。
*** 
### slice
仅传一个值时代表取该对象的第n个和之后的值，传值两个时代表从数组下标的从第几个取值到第几个,此方法不改变原数组对象。
```js{4}
[1,2,3,4,5].slice(2)  //[3,4,5]
[1,2,3,4,5].slice(2,4)  //[3,4]
``` 
重写：
```js{4}
var arr=[1,2,3,4,5]
Array.prototype.slice=function(){
    var _arr=[];
    if(arguments.length===1){
         for(var i=0,len=this.length;i<len;i++){
            if(i>=arguments[0]){
                _arr.push(this[i])
            }
        }
    }
   if(arguments.length===2){
     for(var i=0,len=this.length;i<len;i++){
            if(i>=arguments[0]&&i<arguments[1]){
                _arr.push(this[i])
            }
        }
    }   
    return _arr;
}
//验证结果   
arr.slice(2);  //[3,4,5]
arr.slice(2,4);  //[3,4]
```
### splice
splice方法用于切割数组，该操作会修改原来的数组对象，仅传一个值时切割该数组下标为n后面的所有项，返回被切割的项，并对原数组进行切割。参数为两个时从第n个开始切割，切割的数量是m个。
```js{4}
var arr=[1,2,3,4,5,6,7];
arr.splice(5); //[6, 7] 从下标第三个开始切割到最后一项，返回被切割的项，并将原数组移除被切割的。
console.log(arr) // [1, 2, 3,4,5]
arr.splice(2,2);//[3, 4] 数组从第2个开始截取，截取的数量为2个
console.log(arr);//[1,2,5] 被切割3,4后还剩下的项
```
重写该方法：
```js{4}
Array.prototype.__defineGetter__('get',function(){return this.filter((item)=>item);})
Array.prototype.splice=function(){
    var _arr=[];
    if(arguments.length===1){
         for(var i=0,len=this.length;i<len;i++){
            if(i>=arguments[0]){
                _arr.push(this[i]);
                this[i]=null;
            }
        }
    }
   if(arguments.length===2){
     for(var i=0,len=this.length;i<len;i++){
            if(i>=arguments[0]&&i<(arguments[0]+arguments[1])){
                _arr.push(this[i]);
                this[i]=null;
            }
        }
    }
    return _arr;
}
//验证结果
var arr=[1,2,3,4,5,6,7];
arr.splice(5); //[6, 7] 从下标第三个开始切割到最后一项，返回被切割的项，并将原数组移除被切割的。
console.log(arr.get) // [1, 2, 3,4,5]
arr=arr.get;//数组中无法对this做操作，不基于splice删除数组无法做到，除了proxy也无法对数组做劫持
//只能劫持数组的get方法进行重写。
arr.splice(2,2);//[3, 4] 数组从第2个开始截取，截取的数量为2个
console.log(arr.get);//[1,2,5] 被切割3,4后还剩下的项
```
### forEach
forEach方法接收一个函数作为回调，并在该函数中传递数组的item和index对象，在传递的函数中可以调用到该函数的两个参数。
```js{4}
var arr=[{name:'cj',age:23},{name:'cj',age:23},{name:'cj',age:23}];
arr.forEach((item,index)=>{
    console.log(item,index)
})
//{name: "cj", age: 23} 0
//{name: "cj", age: 23} 1
//{name: "cj", age: 23} 2
```
重写该方法
```js{4}
var arr=[{name:'cj',age:23},{name:'cj',age:23},{name:'cj',age:23}];
Array.prototype.forEach=function(fn){
    const that=this;
    for(var i=0,len=this.length;i<len;i++){
        fn(this[i],i)
    }
}
arr.forEach((item,index)=>{
    console.log(item,index)
})
//执行结果
//{name: "cj", age: 23} 0
//{name: "cj", age: 23} 1
//{name: "cj", age: 23} 2
```
### reduce
reduce方法在数组中应该是非常常用的一个处理需要迭代的函数或者参数等，用通俗的话语来说就是每一次执行结果都要依靠上一次的返回结果来进行处理，例如数组累加。接收一个函数和第一次迭代的默认值。
```js{4}
var arr=[1,2,3,4];
var result=arr.reduce((prev,next)=>{
    return prev+next
},10)
console.log(result) //20  10+1+2+3+4
```
重写改方法：
```js{4}
var arr=[1,2,3,4];
Array.prototype.reduce=function(fn,init){
        let prev;//保存上次执行结果
        init?prev=init:prev=undefined;//是否有传递初始值
         for(var i=0,len=this.length;i<len;i++){//遍历数组对象
            if(init){//传递初始值的情况下直接使用循坏
              prev?prev=fn(prev,this[i]):prev=fn(this[i],this[i])
            }else{//否则使用第一次执行结果为上次执行结果
                if(i!==this.length-1){
                    prev?prev=fn(prev,this[i+1]):prev=fn(this[i],this[i+1])
                }
            }
        }
        return prev
}
var result=arr.reduce((prev,next)=>{
    return prev+next
},10)
var resultNoInit=arr.reduce((prev,next)=>{
    return prev+next
})
console.log(result,resultNoInit) //20,10  
```
### filter
filter方法用来过滤数组，在方法接收的函数中传递改数组的每一项，return一个Boolean值确认是否返回该项。注：该方法不影响原来的数组对象。
```js{4}
var arr=[1,2,3,5,6];
var result=arr.filter((item)=>{
    if(item===2){
        return false;
    }else{
        return true;
    }
})
console.log(result); //[1, 3, 5, 6]
console.log(arr);  //[1, 2, 3, 5, 6]
```
重写该方法
```js{4}
var arr=[1,2,3,5,6];
Array.prototype.filter=function(fn){
    let _arr=[]
    for(var i=0,len=this.length;i<len;i++){
        fn(this[i])?_arr.push(this[i]):undefined;
    }
    return _arr;
}
var result=arr.filter((item)=>{
    if(item===2){
        return false;
    }else{
        return true;
    }
})
//执行结果
console.log(result); //[1, 3, 5, 6]
console.log(arr);  //[1, 2, 3, 5, 6]
```
### concat
concat用来连接两个数组，返回两个数组组合后的结果。
```js{4}
var arr=[1,2,3];
var result=arr.concat([4,5,6]);
console.log(result)//[1, 2, 3, 4, 5, 6]
```
重写该方法
```js{4}
var arr=[1,2,3];
Array.prototype.concat=function(args){
   for(var i=0,len=args.length;i<len;i++){
       this.push(args[i])
   }
   return this;
}
//执行结果
var result=arr.concat([4,5,6]);
console.log(result)//[1, 2, 3, 4, 5, 6]
```
