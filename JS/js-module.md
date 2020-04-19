---
title: 模块化原理
lang: en-US
---

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
