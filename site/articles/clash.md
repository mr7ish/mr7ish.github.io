---
createTime: 2024-11-15
tags:
  - clash 
cover: /stream-girls.png
---

## clash for windows
### problem: 
使用 clash 后，访问 github 没问题，但是 clone 项目以及 push 时会出现超时或失败的问题

```bash
fatal: unable to access 'https://github.com/xxx/xx.git/': 
Failed to connect to github.com port 443 after 21087 ms: Timed out
```

```bash
fatal: unable to access 'https://github.com/xxx/xx.git/': 
The requested URL returned error: 502
```

### solution: 
- #### 配置 git 使用代理服务器

通常情况下，clash for windows 
代理的地址和端口为：http://127.0.0.1:7890

可在 Settings 中查看地址，在 General 中查看端口

tips: 仅针对 github 代理就可以🥴

##### 全局代理

```bash
# 可根据配置替换后面的地址和端口
git config --global http.proxy http://127.0.0.1:7890
```

```bash
git config --global https.proxy http://127.0.0.1:7890
```

##### 仅针对 github 代理

```bash
git config --add http.https://github.com.proxy http://127.0.0.1:7890
```

```bash
git config --add https.https://github.com.proxy http://127.0.0.1:7890
```

- #### 如需取消代理服务器

##### 取消全局代理
```bash
git config --global --unset http.proxy
```

```bash
git config --global --unset https.proxy
```

##### 取消 github 代理
```bash
git config --unset http.https://github.com.proxy
```

```bash
git config --unset https.https://github.com.proxy
```

##### 查看当前全局代理设置，如果没有返回值，表示代理已被移除
```bash
git config --global --get http.proxy
```

```bash
git config --global --get https.proxy
```

##### 查看 github 代理设置
```bash
git config --get http.https://github.com.proxy
```

```bash
git config --get https.https://github.com.proxy
```












