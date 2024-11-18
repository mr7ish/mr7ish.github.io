---
createTime: 2022-11-18
tags:
  - npm
---

```bash
npm i package	//本地模式
npm i -g package	//全局模式
```

像 `nodemon` 这类包，安装后通过 `nodemon [command]` 执行命令，
要在命令行中使用就必须在 `PATH` 环境变量中配置。

本地模式安装仅仅将包安装到 `node_modules` 目录下，其中的 `bin` 目录没有包含在 `PATH` 环境变量中，不能直接调用。

全局模式安装时，包会被安装到系统目录，如 `/usr/local/lib/node_modules/` ，同时`package.json` 中的bin字段包含的文件会被链接到 `/usr/local/bin/` ，而 `/usr/local/bin/` 是在 `PATH` 环境变量中默认定义的，可以直接在命令行中调用。

So 要在命令行中使用则全局安装，在程序中使用则本地安装

### node版本切换

nvm(node version manager)	[下载地址](https://github.com/coreybutler/nvm-windows/releases)

```
nvm list //查看所有node版本
nvm install 版本号 //安装对应node版本
nvm use 版本号 //切换对应node版本
```

### npm镜像源管理工具

nrm(npm registry manager)

```
npm i -g nrm
nrm list //查看所有镜像源地址
nrm use registry //切换镜像源
```

 [more](https://juejin.cn/post/6889811457140064263)

