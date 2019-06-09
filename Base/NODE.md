---
title: Node.js
lang: en-US
---

## 创建静态文件服务器
使用node搭建一个静态文件服务器，常用的插件有live-server等，直接在对应的目录下执行live-server命令，即可在端口开启一个托管当前目录下的静态文件的端口，浏览器可通过该端口访问到该目录下的所有文件并下载。
``` 
npm i live-server -g || cnpm ...||yarn add live-server -g//全局安装插件
cd yourFilePath//进入指定目录
live-server//开启服务
```
```js
const http =require('http'),//http服务
url=require('url'),//url解析参数
fs=require('fs');//文件读取
let port=6666;
let handle=function handleReq(req,res) {//处理函数，req，res 请求，相应
    let {pathname,query}=url.parse(req.url,true);//得到传递的参数
    fs.readFile(__dirname+'/'+pathname,(error,data)=>{//拼接路径
        if(data){//返回文件信息
            res.writeHead(200)
            res.end(data)
        }else{
            res.writeHead(404)
            res.end('The file is not found')
        }
    })
};
http.createServer(handle).listen(port,()=>{//开启指定端口监听回调
    console.log(`server is listing on ${port}`);
})
```
## 环境变量
在一些脚手架或者模块化项目中，npm会自动读取package.json文件并运行文件内的参数，运行的npm关键字会自动进入到scrpit对象内查找对应的执行代码。
```js
{
    "scripts": {
        "dev": "cross-env NODE_ENV=dev node index.js",//corss-env 兼容所有操作系统 
        //Node_ENV 给node中的process.env.NODE_ENV赋值，在对应的文件内取值进行不同的处理
        "build": "cross-env NODE_ENV=pro node index.js"
      }
  }
```
运行npm dev
```js
//index.js
const ENV=process.env.NODE_ENV;
if(ENV==='dev'){
    //todo
}
if(ENV==='pro'){
    //todo
}
```
## 命令配置
## 搭建脚手架