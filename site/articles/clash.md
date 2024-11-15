---
createTime: 2024-11-15
tags:
  - clash 
cover: /stream-girls.png
---

## clash for windows
### problem: 
使用 clash 后，访问 github 没问题，但是 clone 项目以及 push 时会出现超时或失败的问题

<code>
fatal: unable to access 'https://github.com/xxx/xx.git/': Failed to connect to github.com port 443 after 21087 ms: Timed out
</code>

### solution: 
#### 配置 git 使用代理服务器

通常情况下，clash for windows 
代理的地址和端口为：http://127.0.0.1:7890

可在 Settings 中查看地址，在 General 中查看端口

```bash
# 将后面的地址和端口替换为 http://127.0.0.1:7890
git config --global https.proxy https://proxyserver:port
```

#### 如需取消代理服务器

```bash
# 取消代理
git config --global --unset https.proxy

# 查看当前代理设置，如果没有返回值，表示代理已被移除
git config --global --get https.proxy
```