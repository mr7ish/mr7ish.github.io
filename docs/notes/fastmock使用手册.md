# mock数据终极解决文档

### ==解决问题：==

- 在开发中，后端的接口往往是较晚出来的，但是有时候我们必须给前端页面一些虚假的数据去开发，这个时候一些mock工具就很有必要了，最终我选择了`json server`工具，因为它足够简单，而且也能和你们所熟知的Mock.js 配合模拟数据

## 一、安装配置 json-server

### 1.1 安装

```shell
npm install json-server -g
```

### 1.2 配置

创建mock目录，在目录下创建一个json文件

- /src/mock

	- /src/mock/db.json

	- 解析：list:为请求的地址

		```json
		{
		  "list": [
		    {
		      "name": "游魂博客",
		      "link": "www.iyouhun.com",
		      "id": 1
		    },
		    {
		      "product": "手机去",
		      "categoryId": "22",
		      "picture": "zzzz",
		      "shop": "匹配",
		      "price": "65",
		      "id": 2
		    },
		    {
		      "id": 3,
		      "name": "游魂全自动网页制作系统",
		      "link": "www.youhun.wang"
		    }
		  ],
		  "test": [
		    {
		      "name": "zjf",
		      "id": 1
		    },
		    {
		      "id": 2
		    },
		    {
		      "id": "3",
		      "name": "cgm"
		    },
		    {
		      "id": "4",
		      "name": "cgm666"
		    }
		  ]
		}
		```

1.3 在mock目录下执行

- 利用localhost在本地起一个服务

- 默认端口号为3000

	```
	json-server db.json
	```

- 利用局域网，其他人也可以使用

	- -H 找到自己的ip地址，替换进去设置主机
	- 添加 - - watch 为了实时监控变化更改

	```
	json-server --watch -H 10.7.176.109 db.json
	```

	

## 二、基础使用jsonserver

### 2.1 支持方法

```
如：

GET /list 获取列表
GET /list/1 获取id=1的数据
POST /list 创建一个项目
PUT /list/1 更新一个id为1的数据
PATCH /list/1 部分更新id为1的数据
DELETE /list/1 删除id为1的数据
```

==注意！！！==

1. 当你发送POST，PUT，PATCH 或者 DELETE请求时，变化会自动安全的保存到你的db.json文件中。
2. 你的请求体body应该是封闭对象。比如`{"name": "Foobar"}`
3. id不是必须的，在PUT或者PATCH方法中，任何的id值将会被忽略。
4. 在POST请求中，id是可以被添加的，如果该值没有没占用，会使用该值，否则自动生成。
5. POST，PUT或者PATCH请求应该包含一个`Content-Type:application/json`的header，来确保在请求body中使用json。

### 查询

- get请求： http://10.7.176.109:3000/test

![image-20220825145947409](https://typorazjf.oss-cn-chengdu.aliyuncs.com/images/image-20220825145947409.png)

### 增加：

- post请求： http://10.7.176.109:3000/test

- 参数：

	```json
	{"id": "5","name": "测试添加"}
	```

	![image-20220825150217796](https://typorazjf.oss-cn-chengdu.aliyuncs.com/images/image-20220825150217796.png)

### 修改：

- put请求： http://10.7.176.109:3000/test/5

- 参数：

	```json
	{"id": "5","name": "测试修改",
	"test": "看一下我修改了么"}
	```

![image-20220825150618988](https://typorazjf.oss-cn-chengdu.aliyuncs.com/images/image-20220825150618988.png)

### 删除：

- DELETE请求： http://10.7.176.109:3000/test/5

![image-20220825150953180](https://typorazjf.oss-cn-chengdu.aliyuncs.com/images/image-20220825150953180.png)



## 三、搭配mockjs

### 3.1 安装及基础使用

- 在db.js文件所在的目录下安装mockjs

	```
	npm install mockjs --save
	```

- 新建db.js文件

	```js
	let Mock  = require('mockjs');
	let Random = Mock.Random;
	module.exports = function() {
	  let data = { list: [] }
	  // Create 1000 datas
	  for (let i = 0; i < 1000; i++) {
	    data.list.push({ id: i, name: Random.cname(),link:Random.url() })
	  }
	  return data
	}
	```

- 默认执行刚才生成的文件

	```
	json-server db.js
	```

- 执行效果![image-20220825164438697](https://typorazjf.oss-cn-chengdu.aliyuncs.com/images/image-20220825164438697.png)

- mock基础语法

	```js
	{
	  "string|1-10": "@string",		//1-10位的随机字符串
	  "integer": "@integer(10, 30)",	//10~30之间的整数
	  "float": "@float(60, 100, 2, 2)",	//60~100之间2位小数的数据
	  "boolean": "@boolean",			//true or false
	  "date": "@date(yyyy-MM-dd)",		//返回以yyyy-MM-dd格式的日期
	  "datetime": "@datetime",			//"1996-05-11 06:03:54"
	  "now": "@now",					//"2021-07-29 15:39:05"
	  "url": "@url",					//随机url路径
	  "email": "@email",				//随机电子邮箱
	  "region": "@region",				//随机地区 比如"东北"
	  "city": "@city",					//随机城市
	  "province": "@province",			//随机省份
	  "county": "@county",				//随机区域,注意不是国家的单词,"南开区"
	  "upper": "@upper(@title)",		//对随机的title进行大写格式化
	  "guid": "@guid",					//"E4caab6d-eEFB-72ef-EED4-AE5C49d4b8A7"
	  "id": "@id",						//"620000200611082159"
	  "image": "@image(200x200)",		//随机图片
	  "title": "@title",				//随机title
	  "cparagraph": "@cparagraph",		//随机长度的段落文字
	  "csentence": "@csentence",		//随机长度的句子
	  "range": "@range(2, 10)"			//开始为2,末尾为10 步长为1的数组
	}
	```

	

