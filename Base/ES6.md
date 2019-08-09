---
title: ES6,ES7
lang: en-US
---

## let const

## class
### 继承的n种实现方式
1. 原型prototype继承
```js
function Person(name){
    this.name=name;
}
Person.prototype.sayName=function(){
    console.log(this.name);
}
var p1=new Person("CJ");
p1.sayName();//CJ
```
2. 构造函数实现(类似class中的constructor函数)
```js
function Person(name){
    this.name=name;
}
var p1=function(name){
    Person.call(this,name);//通过调用Person函数并传递this给this赋值
        console.log(this.name);
}
p1("CJ");
```
3. 混合式实现
```js
function Person(name,age){
    this.name=name;
    this.age=age;
}
Person.prototype.sayName=function(){
    console.log(this.name)
}
function Student(name,age){
    Person.call(this,name);
}
Student.prototype=new Person();//Student.prototype=Person.prototype;
Student.prototype.constructor=Student;//修复构造函数指向 
var s1=new Student("CJ",23);//实例化Student时，原型指向Person原型
s1.sayName();
```
4. ES6类extends继承
```js
    class Person{
        constructor(name){
            this.name=name;
        }
    }
    class Student extends Person{
        constructor(name,age){
            super(name);//相当于Person.call(name,this)
            this.age=age;
        }
        sayName(){
            console.log(this.name);
        }
    }
    var s1=new Student("CJ",23);
    s1.sayName()//CJ
```
## 箭头函数
箭头函数为es6的函数另一种写法，相比原function的写法，箭头函数更能体现参数流向，且箭头函数中的this指向当前所在域的this。
* 箭头函数中没有arguments对象，需使用...args来接受为一个数组。
* 箭头函数this始终指向当前this指向。
* 箭头函数只穿一个参数时可以省略小括号。
* 箭头函数中传参可赋值一个默认参数,如果该参数没有传递时使用默认替代。
```js
var test=(name="JC")=>{
    console.log(name);
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
## proxy
代理模式：为对象的访问、赋值、属性查找等启用中间层代理，先执行代理的函数，后根据情况返回具体的内容。与Object.defineprotype相似，使用get和set函数对被代理的对象进行操作,但能拦截更多的属性访问钩子。仅说明常用的get和set拦截，更多访问拦截请查看官方文档。
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
## generator函数
一直以为会promise和async/await就好了，可以直接跳过generator，果然想法很天真，redux
-saga使用了generator函数，最近又在搞懂saga原理的路上艰难前行，先把generator玩通。
###  使用方法
```js
function* gen() {//generator函数在函数申明前使用*号说明该函数是一个异步函数
    let r1=yield new Promise((reslove)=>{
      setTimeout(()=>{reslove('res1')},1000);
    });
    let r2=yield new Promise((reslove)=>{
      setTimeout(()=>{reslove('res2')},1000);
    });
    let r3=yield new Promise((reslove)=>{
      setTimeout(()=>{reslove('res3')},1000);
    });
    console.log('gen',r1,r2,r3);
};
```
是不是感觉这种写法和async/await贼像啊，执行后发现什么都没发生，屁都没放一个
<br>
*  next:执行gen函数返回的对象后包含的方法，用来调用下次个的yield后的异步函数并放到返回的对象的value中,代码:
```js
var g=gen();
g.next();//执行next会返回一个对象{value: Promise, done: false}
```
*  value:此次yield后的异步函数,通过.then(res=>res)取到返回的值
* done:异步操作是否执行完毕，即接下来是否还有yield执行

```js
var g=gen();
let res= g.next();//开始执行第一个yield 执行next会返回一个对象{value: Promise, done: false}
res.value.then((res)=>{
    console.log(res);//取得第一个r1的promise的结果 res1
    return g.next(res).value;// 执行next返回下一个promise(r2)
}).then((res)=>{//promise(r2)
    console.log(res);//r2的结果 res2
    //g.next(res)返回的对象为上一个promise(r2)和done:false
    return g.next(res).value;//执行next返回下一个promise(r3)
}).then((res)=>{
    console.log(res);//r3的结果 res3
    return g.next(res).value;
}).then((res)=>{
    console.log(res)//最后一次，已经没有东西了。 undefined
    return g.next()//返回{value:undefined,done:true} done为true就代表已经完成啦
})
```
一直这样写岂不是很麻烦，我们使用函数来迭代处理下
```js
var  runGen=function(){
    var g=gen();//生成迭代对象
    function run(val){
      var res=g.next(val);//将值传递给下一次调用
      if(res.done){//是否是最后一次（已经完成）
        return res.value;//直接返回最后的值
      }else{
        res.value.then((res)=>{//取得下一次promise返回的结果
            console.log(res)
            run(res)//再次迭代，直到done为true
        });
      }
    }
     run();
}()
```



