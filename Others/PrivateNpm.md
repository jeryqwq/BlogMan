---
title: 企业私有npm配置
lang: en-US
---

## 搭建私有 npm 源

npm 市场给前端带来了很大的变化，使前端也能想是 java 那样，从远程仓库拉取依赖的代码，从而极大的减小了项目的体积。
开源的私有 npm 有很多，本次使用[verdaccio](https://github.com/verdaccio/verdaccio)搭建

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

## npm 对接私有源

建议使用 nrm 管理地址源,方便好记。

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

- storage：包存储的文件路径(绝对和相对都可以)

```bash
# 使用前确保你的npm源已经修改为本地私有或者对应局域网的地址
#添加用户
npm adduser #输入你的用户和密码以及邮箱

npm publish # 发布 你的包
```

## package.json 配置

---

package.json 的配置[官方文档](https://docs.npmjs.com/files/package.json)，针对目前主流的 jsx 或者 vue 文件的支持度并不支持，像是对模块化的 js 文件 npm 就可以很好的遍历他们之间对应的关系并发布，下面说几个比较常用且对发布有影响的配置。

- name, version, description, main, author 等通过字面意思即可理解，
- version： 版本号（每次发布都需要大于之前的版本，否则无法发布
- main：文件的主入口，js 结尾的文件 npm 会自动遍历所有相关文件并发布
- private： 不是付费用户发布必须填写 false
- author: 在 npm 市场的有效名称
- scripts：提供快捷命令的入口，会被转换为其他命令执行
- dependencies：平时我们通过--save 安装的包以及对应的版本会被写入到该对象中
- devDependencies：开发依赖，通过--dev 安装的包会被写入到列表中

<p style="color:red"><b>如果上传的文件代码是使用了webpack工具的.vue抑或是.jsx此类的第三方格式构建的项目或组件，建议在package.json中添加files对象来描述哪些文件该上传，以及添加正确dependencies包之间的关系依赖，否则npm无法获取文件之间的关系依赖，故无法上传完整的文件目录结构。</b></p>
下面是一个files对象

```js
 "files": [
    "src/",
    "build/",
    "public/",
    "tests/",
    "_gitignore",
    ".editorconfig",
    ".eslintignore",
    ".eslintrc"
  ],
```

此时，package.json 和地址已经配置好了，接下来看如何上传私有包

## 上传包到私有源地址

上述步骤都准备好了的话，一般我们就可以上传我们自己的包到私有 npm 啦，私有 npm 的好处很多，像是超快的网速啊，局域网内共享的代码，方便整个公司使用，可以发布一些业务组件或者区块等，也可以根据公司的 UI 规范来现实自己的 UI 框架等等，给产品的版本迭代和快速发布构建提供了很好的响应速度。

```bash
#先检查一遍我们是否使用了私有npm的地址
nrm ls #查看地址
#如果没有记得使用nrm use xxx来替换掉当前的位置
#如果确定了版本和代码，我们就可以根据当前的版本发布了，发布的版本一定要大于上次的对应的版本
npm adduser #使用前请先登录，输入用户名密码邮箱
npm publish # 发布当前的版本
#不出以外几秒不到就可以发布成功了，毕竟基于局域网，然后可以去对应的地址去查看自己上传的包了
#在其他项目中就可以使用npm i xxxx来安装我们自己的私有npm的包了，当然，使用前记得切换npm源
```

## 配置文件

分享一个局域网 NPM 配置，忽略内网上传包时 npm 包查重机制，网络不好时无法上传，以及禁止新用户注册

```bash
#
# This is the default config file. It allows all users to do anything,
# so don't use it on production systems.
#
# Look here for more config file examples:
# https://github.com/verdaccio/verdaccio/tree/master/conf
#

# path to a directory with all packages
storage: E:\ice\storage
# path to a directory with plugins to include
plugins: ./plugins

web:
  title: UED
  # comment out to disable gravatar support
  # gravatar: false
  # by default packages are ordercer ascendant (asc|desc)
  # sort_packages: asc

auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    max_users: 1

# a list of other known repositories we can talk to
uplinks:
  npmjs:
    url: https://registry.npmjs.org/

packages:
  '@*/*':
    # scoped packages
    access: $all
    publish: $authenticated
    unpublish: $authenticated
    proxy: npmjs

  '**':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    #
    # you can specify usernames/groupnames (depending on your auth plugin)
    # and three keywords: "$all", "$anonymous", "$authenticated"
    access: $all

    # allow all known users to publish/publish packages
    # (anyone can register by default, remember?)
    publish: $authenticated
    unpublish: $authenticated

    # if package is not available locally, proxy requests to 'npmjs' registry
    proxy: npmjs

# You can specify HTTP/1.1 server keep alive timeout in seconds for incoming connections.
# A value of 0 makes the http server behave similarly to Node.js versions prior to 8.0.0, which did not have a keep-alive timeout.
# WORKAROUND: Through given configuration you can workaround following issue https://github.com/verdaccio/verdaccio/issues/301. Set to 0 in case 60 is not enough.
server:
  keepAliveTimeout: 60

middlewares:
  audit:
    enabled: true

# log settings
logs:
  - { type: stdout, format: pretty, level: http }
  #- {type: file, path: verdaccio.log, level: info}
#experiments:
#  # support for npm token command
#  token: false

publish:
## This will allow the publisher to publish packages even if any uplink is down.
  allow_offline: true
```
