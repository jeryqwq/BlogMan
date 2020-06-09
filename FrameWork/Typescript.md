---
title: Typescript
lang: en-US
---

## 简介

在 JS 中,并没有非常严格的关于类型定义的概念,也没有关于类的许多特性，虽然 JS 可以通过原型链和本身的其他特性来模拟 class 的各种特性，但是在多人开发或者封装一些组件和方法时，总有些人不爱看文档，随便给组件传其他格式的数据，随着 js 语法的完善，es6 已经定义了类的概念和相关 API，但许多类的特性 JAVA 或者 C#下类的特性 JS 还是没有（abstract，implement 等），也无法做到严格的类型检测，导致多人开发时出现一些没必要且可预见的低级 bug。

## 在 vscode 中集成 ts

### 安装 typescript

```bash
npm i typescript -g  #全局安装插件
tsc -init #初始化ts项目，生成配置文件
#常用配置选项说明
    "target": "es5", #编译后的目标ES版本
    "module": "commonjs",#模块化遵循规范
    "jsx": "react",  #转为react和react-natvie而生，编译jsx语法成createElement格式
    "outDir": "./js",  #输出文件格式目录
    "strict": true,    #是否使用严格模式
    #.....
```

### 编译文件

打开命令菜单，选择 Run Task ,选择 tsc:watch -tsconfig.json
然后控制台就已经开始监听了，我们可以快乐的书写 ts 代码并热更新编译到指定的目录了

## 类型判断

在ｔｓ中，定义的所有的变量都应该有一个类型，且在以后的任何时候，该变量都应该和原始类型保持一致，给该变量错误的赋值操作时都应该给出提示,使 JS 像其他 OOP 语言一样的特性，用来支撑多人开发的大型项目
我们来看看基础 TS 语法：

### 基础类型

```ts
let test: string = "123" //使用和原生JS语法差异不大，仅仅在变量后添加:对应的类型即可
let testNumber: number = 123
let testArr: Array<number> //声明一个全是数字的数组,赋值其他类型报错
let x: [string, number] = ["CJ", 123] //第一个为字符串，第二个为数字
let or: number | undefined //或运算符可以给一个参数设置多种类型
```

### 枚举

在 JS 中，我们常用来表示状态，成功或者失败，是否付款，付款方式等

```ts
enum Flag {
  success = 0,
  error = 1,
}
let result: Flag = Flag.success //result必须为Flag中的一种类型，否则报错
```

### 函数

函数规范应该使很常用的，例如：A 要用 B 的方法，B 就应该定义自己函数接收的参数类型和返回的类型。

```ts
function runMethod(name?: string): { name: string } {
  //定义参数类型和方法返回类型
  return { name: `${name}CJ` }
}
let methodRes: string //定义接收的变量
methodRes = runMethod("CJ+").name //赋值，都为string
console.log(methodRes)
```

## 类

各大 OOP 语言的三大特性：继承，多态，封装都要有，一个都不少，语法和关键字几乎和 Java 一模一样，熟悉 java 可直接上手,我们先来使用 ts 的类语法实现一个 Person 类。

```ts
class Person {
  private name: string //private 私有变量，确保只有当前在内部才能访问
  private age: number //所有类的实例下的属性都应该是私有的且暴露一个共有的get和set方法
  getName(): string {
    return this.name
  }
  setName(name: string): void {
    this.name = name
  }
  getAge(): number {
    return this.age
  }
  setAge(age: number): void {
    this.age = age
  }
  say(): void {
    //未使用关键字定义的函数和变量默认public  全局访问
    console.log(`${this.name}is say: I am ${this.age} `)
  }
}
let p1: Person
p1 = new Person("CJ", 23)
p1.say() //CJ is  say:  i am 23
```

## 抽象类

抽象类中，只包含方法体和变量签名，不包含方法具体的实现，所有继承他的类都应该实现其定义的方法和变量。相当于给一个类定下规范，你应该实现哪些方法，该有那些变量。

```ts
abstract class Person {
  public name: string
  public age: number
  public say(): void
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}
class Man extends Person {
  super(name: string, age: number) //super调用父级的constructor。与es6类的继承相识
  say(): void {
    //必须实现该方法
    console.log(`${this.name}is say: I am ${this.age} `)
  }
  work(): void {
    //可扩展自己的方法
    console.log(`${this.name}is working。。。`)
  }
}
```

## 作用域修饰符

作用域修饰符修饰类里面包含的每个变量和函数的作用域范围，分为三种 public-全局，protected-受保护的，private-私有的

### private

仅在自己的内部使用，外部无法访问，包括子类也无法访问

```ts
class Person {
  private name: string //定义实例私有变量
  constructor(name: string) {
    this.name = name //仅在自己内部访问
  }
}
class Man extends Person {
  super(name: string)
  say(): void {
    console.log(this.name) //Property 'name' is private and only accessible within class 'Person'
  }
}
// let p1:Person=new Person('CJ');
// console.log(p1.name);//Property 'name' is private and only accessible within class 'Person'
```

### protected

相比 private 有更大的范围，外部无法访问，但是在内部和有继承关系的子类可以访问。

```ts
class Person {
  protected name: string
  constructor(name: string) {
    this.name = name
  }
}
class Man extends Person {
  // constructor子类的构造器函数可不传，默认调用父类的构造器
  say(): void {
    console.log(this.name)
  }
}
var p1: Person = new Man("CJ") //可以定义父类的类型实例化子类，即父类包含子类

let p2: Man = new Person("CJ") //报错：定义子类的类型赋值父类实例,子类不包含父类
console.log(p1.name) //Property 'name' is protected and only accessible within class 'Person' and its subclasses
// name属性是受保护的，而且仅在person的子类可访问
```

### public

默认修饰符，可不写，公共的，内部和外部都可以访问，通常用来修饰一些对外暴露的接口和变量

```ts
class Person {
  public name: string
  constructor(name: string) {
    this.name = name
  }
}
class Man extends Person {
  public say(): void {
    console.log(this.name)
  }
}
let p1: Man = new Man("CJ")
p1.say() //CJ
```

## 接口

接口用来定义一个对象或者类应该有那些功能或者应该实现那些方法，类似我们常用的操作手册，说明书等，一个类可以实现多个接口，但只能继承一个类。

```ts
interface Animal {
  say(): void
}
interface Human {
  codding(): void
  [propName: String]: any //扩展其他属性
}
class Chen implements Human, Animal {
  codding() {}
  say() {}
}
```

## 泛型

在 Java 中泛型泛指可以是任何类型的对象，他和 ts 基本类型的 any 有一点相识，但是泛型可以传递参数类型，常用来推导类型，而 any 仅代表所有的类型，ts 中常出现 any 反而 ts 存在的意义就不大了

```ts
function identity<T>(arg: T): T {
  return arg
}
let outputNumber = identity<number>(12)
console.log(outputNumber)
//使用范型获取每一项的类型
function createArray<T>(length: number, val: T): T[] {
  let arr: T[] = []
  for (let i: number = 0; i < length; i++) {
    arr[i] = val
  }
  return arr
}
//使用范型函数交换两个变量
let swap = function <A, B>(a: A, b: B): [B, A] {
  return [b, a]
}
console.log(swap("J", "C"))
```

## type

### 类型反推

```ts
//类型反推
let obj = {
  name: "CJ",
  age: 24,
  likes: ["codding", "swiming"],
}
type PersonObj = typeof obj
let objp2: PersonObj = {
  name: "CJ",
  age: 23,
  likes: [],
}
```

## 兼容性
