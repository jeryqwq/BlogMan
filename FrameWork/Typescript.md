---
title: Typescript
lang: en-US
---
## 简介
在JS中,并没有非常严格的关于类型定义的概念,也没有关于类的许多特性，虽然JS可以通过原型链和本身的其他特性来模拟class的各种特性，但是在多人开发或者封装一些组件和方法时，总有些人不爱看文档，随便给组件传其他格式的数据，随着js语法的完善，es6已经定义了类的概念和相关API，但许多类的特性JAVA或者C#下类的特性JS还是没有（abstract，implement等），也无法做到严格的类型检测，导致多人开发时出现一些没必要且可预见的低级bug。
## 在vscode中集成ts
### 安装typescript
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
打开命令菜单，选择Run Task ,选择tsc:watch -tsconfig.json
然后控制台就已经开始监听了，我们可以快乐的书写ts代码并热更新编译到指定的目录了
## 类型判断
在ｔｓ中，定义的所有的变量都应该有一个类型，且在以后的任何时候，该变量都应该和原始类型保持一致，给该变量错误的赋值操作时都应该给出提示,使JS像其他OOP语言一样的特性，用来支撑多人开发的大型项目
我们来看看基础TS语法：
### 基础类型
``` ts
let test:string="123";  //使用和原生JS语法差异不大，仅仅在变量后添加:对应的类型即可
let testNumber:number=123;
let testArr:Array<number>;//声明一个全是数字的数组,赋值其他类型报错
let x: [string, number]=["CJ",123];//第一个为字符串，第二个为数字 
let or:number | undefined;//或运算符可以给一个参数设置多种类型
```
### 枚举
在JS中，我们常用来表示状态，成功或者失败，是否付款，付款方式等
```ts
enum Flag { success=0,error=1}
let result:Flag=Flag.success;//result必须为Flag中的一种类型，否则报错
```
### 函数
函数规范应该使很常用的，例如：A要用B的方法，B就应该定义自己函数接收的参数类型和返回的类型。
```ts
function  runMethod(name?:string):{name:string}{ //定义参数类型和方法返回类型
    return {name:`${name}CJ`};
}
let methodRes:string;//定义接收的变量
methodRes=runMethod('CJ+').name;//赋值，都为string 
console.log(methodRes)
```
### 类
重头戏，各大OOP语言的三大特性：继承，多态，封装都要有，一个都不少，语法和关键字几乎和Java一模一样，熟悉java可直接上手
```ts

```
