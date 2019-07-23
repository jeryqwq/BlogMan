---
title: 企业私有npm配置
lang: en-US
---
## 搭建私有npm源
npm市场给前端带来了很大的变化，使前端也能想是java那样，从远程仓库拉取依赖的代码，从而极大的减小了项目的体积。
开源的私有npm有很多，本次使用[verdaccio](https://github.com/verdaccio/verdaccio)搭建
```bash
npm i verdaccio -g
#全局安装，安装完成后即可通过命令启动了
verdaccio  --listen <[host:]port>
#启动命令。配置对应的端口号 注：局域网监听请使用0.0.0.0:port，
#localhost以及127.0.0.1无法监听到局域网IP
#  warn --- config file  - C:\Users\Administrator\AppData\Roaming\verdaccio\config.yaml 
#配置文件读取位置
#  warn --- http address - http://localhost:4873/ - verdaccio/4.1.0 //监听地址
```
## npm对接私有源
建议使用nrm管理地址源,方便好记。
```bash
npm i -g nrm #全局安装nrm
nrm add  <给你的私有源起个名字> <具体的地址>   
#如 nrm add taobao https://registry.npm.taobao.org/
nrm ls 
#查看当前源列表
#   npm -------- https://registry.npmjs.org/
#   yarn ------- https://registry.yarnpkg.com/
#   cnpm ------- http://r.cnpmjs.org/
# * taobao ----- https://registry.npm.taobao.org/
#   nj --------- https://registry.nodejitsu.com/
#   npmMirror -- https://skimdb.npmjs.com/registry/
#   edunpm ----- http://registry.enpmjs.org/
#   sinopia ---- http://localhost:4873/
nrm use taobao #使用刚刚手动添加的淘宝源
```
## 配置私有源
打开监听成功后的私有源配置（C:\Users\Administrator\AppData\Roaming\verdaccio\config.yaml）
* storage：包存储的文件路径(绝对和相对都可以)
```bash 
# 使用前确保你的npm源已经修改为本地私有或者对应局域网的地址
#添加用户
npm adduser #输入你的用户和密码以及邮箱 

npm publish # 发布 你的包
```
## package.json配置
package.json的配置[官方文档](https://docs.npmjs.com/files/package.json)，针对目前主流的jsx或者vue文件的支持度并不支持，像是对模块化的js文件npm就可以很好的遍历他们之间对应的关系并发布，下面说几个比较常用且对发布有影响的配置。
* name, version, description, main, author等通过字面意思即可理解，
* version： 版本号（每次发布都需要大于之前的版本，否则无法发布
* main：文件的主入口，js结尾的文件npm会自动遍历所有相关文件并发布
* private： 不是付费用户发布必须填写false
* author: 在npm市场的有效名称
* scripts：提供快捷命令的入口，会被转换为其他命令执行
* dependencies：平时我们通过--save安装的包以及对应的版本会被写入到该对象中
* devDependencies：开发依赖，通过--dev安装的包会被写入到列表中


```js
```


此时，地址已经配置好了，接下来看如何上传私有包
## 上传包到私有源地址



