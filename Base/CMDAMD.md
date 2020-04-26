---
title: CMD | AMD 规范
lang: en-US
---

## 简介

AMD 和 CMD 规范都是前端模块化的规范，以往的前端开发方式都是按照文件去分类，且暴露全局变量，并没有像是一些后端语言那样按照模块分类去开发，不同模块内变量不冲突，直到 node 的问世，由于其大量的要与系统底层做交互，开始出现了基于 js 的模块化开发概念，开始像 java 那样导入导出模块，由于 CMD 规范是同步的，node.js 从硬盘加载脚本，使用 CMD 规范并没有多大影响，而在前端浏览器环境下，同步就意味着阻塞，每次加载脚本需要依次的加载所有代码，所以极大的受到网络的限制，从而诞生了适合浏览器环境的 AMD。

## CMD 规范

### 导出

```js
//add.js
var a = 10
var add = function (i) {
  return i + a
}
module.exports = { add }
//等价于 exports.add=add
```

### 导入

```js
const Add = require("./test")
var a = 20
console.log(Add.add(10)) // 20
//此时在函数内的变量a的值取得还是10
```

exports 变量是在模块的文件级作用域内可用的，且在模块执行之前赋值给 module.exports。
它允许使用快捷方式，因此 module.exports.add= ... 可以更简洁地写成 exports.add = ...。 但是，就像任何变量一样，如果为 exports 赋予了新值，则它将不再绑定到 module.exports：

```js
var a = 10
var add = function (i) {
  return i + a
}
var add1 = function (i) {
  return i + a
}
exports.add = add1
module.exports = { add }
```

### 导入

```js
const add = require("./test")
var a = 20
console.log(add) //{ add: [Function: add] } 此时仅导出了add函数，
//module.exports是优先export的，他们只是指向同一个引用
```

当 module.exports 被重新赋值时，exports 也会被重新赋值

```js
module.exports = exports = function Constructor() {
  // ...
}
```

CMD 规范更像是一个闭包然后传递一个全局的 module 对象去挂载上去。

```js
var module = {}
;(function (module) {
  module.add = function (n) {
    return n + 1
  }
})(module)
module.exports = module
module.exports.add(1)
```

## CMD 总结

- CMD 规范内的模块每个模块都是一个局部作用域，对全局无影响，该作用域内的变量和函数与其他外部的无任何冲突。
- CMD 执行顺序是同步的，导入的时候就是把代码从上而下依次执行，将被导入文件的代码全部执行后存入 exports 导出的堆内存
- 多次加载同一个模块只有在第一次的时候才会运行，其他时候加载则是从缓存中读取数据，想要模块重新加载必须重新清空缓存。

## AMD 规范

## 基础的模块化实现

基于各大模块化的标准，实现一个最简单的模块化原理。
使用 map 存储模块名称和内容，自执行函数返回函数用来读取闭包内的值。

```js
var define = (function () {
  var map = {},
    arr = []
  var require = function (dep, cb) {
    cb &&
      dep.forEach((item) => {
        arr.push(map[item])
      })
    cb && cb(arr)
  }
  window.require = require
  return function (name, val) {
    map[name] = val
    return map[name]
  }
})()
define("test", () => {
  //添加一个模块
  console.log("load test!!!")
})

define("test1", () => {
  //添加一个模块
  console.log("load test1!!!")
})
define("test2", () => {
  //添加一个模块
  console.log("load test2!!!")
})
//引入模块并在回调函数中以此传递s
require(["test", "test1", "test2"], ([t1, t2, t3]) => {
  t1()
  t2()
  t3()
})
```
