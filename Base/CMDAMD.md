---
title: CMD | AMD 规范
lang: en-US
---
## 简介
AMD和CMD规范都是前端模块化的规范，以往的前端开发方式都是按照文件去分类，并没有像是一些后端语言那样按照文件分类模块化开发，直到node的问世，由于其大量的要与系统底层做交互，开始出现了基于js的模块化开发概念，开始像java那样导入导出模块，由于CMD规范是同步的，node.js从硬盘加载脚本，使用CMD规范并没有多大影响，而在前端浏览器环境下，同步就意味着阻塞，每次加载脚本需要依次的加载所有代码，所以极大的受到网络的限制，从而诞生了适合浏览器环境的AMD。
## CMD规范
### 导出
```js
//add.js
var a=10
var add=function(i){
    return i+a; 
}
module.exports={add};
//等价于 exports.add=add
```
### 导入
```js
const Add=require('./test');
var a=20;
console.log(Add.add(10));// 20
//此时在函数内的变量a的值取得还是10
```
exports 变量是在模块的文件级作用域内可用的，且在模块执行之前赋值给 module.exports。
它允许使用快捷方式，因此 module.exports.add= ... 可以更简洁地写成 exports.add = ...。 但是，就像任何变量一样，如果为 exports 赋予了新值，则它将不再绑定到 module.exports：
```js
var a=10
var add=function(i){
    return i+a; 
}
var add1=function(i){
    return i+a; 
}
exports.add=add1
module.exports={add};

```
### 导入
```js
const add=require('./test');
var a=20;
console.log(add);//{ add: [Function: add] } 此时仅导出了add函数，
//module.exports是优先export的，他们只是指向同一个引用
```
当module.exports被重新赋值时，exports也会被重新赋值
```js
module.exports = exports = function Constructor() {
  // ... 
};
```
CMD规范更像是一个闭包然后传递一个全局的module对象去挂载上去。
```js
var module={
    exports:{}
}
(function(module,exports){
    exports.a=function(i){console.log(i)}
})(module,module.exports)
module.exports.a()
```
## 总结
* CMD规范内的模块每个模块都是一个局部作用域，对全局无影响，该作用域内的变量和函数与其他外部的无任何冲突。
* CMD执行顺序是同步的，