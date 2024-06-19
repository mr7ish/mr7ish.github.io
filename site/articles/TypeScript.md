---
createTime: 2022-12-27
tags:
  - TypeScript
cover: /old-scene.jpg
---

[TS教程](https://ts.xcatliu.com/)

[TS官方中文手册](https://www.typescriptlang.org/zh/docs/handbook/typescript-from-scratch.html)

## 

### TS是什么？

是基于JS的语言，是JS的超集，扩展了JS（添加了类型约束、接口），TS不能被JS解析器直接执行（需要编译）

全局安装：	npm i -g typescript

检测是否安装成功：	tsc



## 基础：

### 添加类型声明：

```typescript
//指定变量str的类型为string类型，若后期赋值为不是字符串类型的值会报错
let str: string;
str = 'hello'

//在ts文件中，声明变量的同时进行赋值可以不加类型约束，TS可以自动对变量类型进行检测
let num = 10	//相当于 let num: number = 10

//函数形参类型声明
function sum(a: number,b: number){...}

//函数返回值类型声明
function sum(a: number,b: number): number{ return a+b; }
```

### TS中的所有类型：

```typescript
//number 数值类型
let e: number;
//string 字符串类型
let f: string;
//boolean 布尔类型
let g: boolean;

//字面量	变量值就是字面量的值  指定后就不能再修改
let a: 10;
a = 10;
a = 11;	//报错

|	//或	可以连接多个类型或值
let gender: 'male' | 'female'; //gender值只能为 male 或 female
let c: boolean | string; //c值可以为 布尔类型 或  字符串类型

//any 任意类型
let d: any;	//一个变量的类型设置为any，相当于对该变量关闭了TS的类型检测
let d;	//相当于上面，上面是显式，这里是隐式
//any类型可以赋值给任意变量  把str的类型也给关闭
let str: string;
d = 10;
str = d;

//unknown 未知类型，可以赋任意值	实际是一个类型安全的any
let un: unknown;
un = 'hello'
let str2: string;
str2 = un;	//会报错	会检测变量的类型，而不是值(unknown类型的值不能赋值给其他类型，与any不同)
//这样可以 不报错
if(typeof un === 'string')	str2 = un;
//类型断言(告诉编译器变量un就是string类型)
str2 = un as string;	//写法一
str2 = <string>un;		//写法二

//void 空类型	一般给没有返回值的函数设置	
function voidFunc(): void{
    //可以返回 undefined 或 null
    //return;
    return undefined | null;
}	

//never 没有值	永远不会返回结果
function fun2(): never{
    //报错以后，其他代码就不会执行，函数也就没有任何返回值(包括undefined、null)
    throw new Error('报错!');
    ...	//其他代码
}

//object  对象类型
let obj: object;

//指定obj2的值为一个对象，且必须包含字符串类型的name属性
let obj2: {name: string};
    
//?表示可选，可以包含age属性也可不包含，但必须有name
let obj3: {name: string, age?: number};

//[propName: string]: string表示可以有任意字符串类型的属性名，且值为任意类型
//必须有name属性，有其他什么都没关系
let obj4: {name: string, [propName: string]: any};

//设置函数结构的类型声明
//func3是一个函数，只能有两个类型为number的形参，返回值为number
let func3: (a: number, b: number) => number;

//array 数组	string[]表示字符串类型的数组，数组中只能存字符串
let arr: string[];	    //		 类型[]
let arr2: Array<string> //同上	Array<类型>

//tuple 元组	固定长度的数组
//arr3数组中只能有2个字符串类型的元素
let arr3: [string,string];

//enum 枚举	在多个值之间选择，用0、1代替男、女性别，用枚举赋予0、1不同含义，避免其他人不知道0、1分别表示什么
enum Gender{
    Male = 0,
    Female = 1
}  
let user: {name: string, gender: Gender};
user = {
    name: '张三',
    gender: Gender.Male 
}

//& 表示同时
//user2必须同时存在name和age属性
let user2: {name: string} & {age: number};

//类型的别名
type myType = 1 | 2 | 3 |4;
let num3: myType;
let num4: myType;
```

   

### 编译选项：

自动编译文件，TS编辑器会自动监视文件的变化，在文件变化时重新进行编译（只监视当前文件）
tsc  xxx.ts  -w

编译所有的ts文件：	tsc（编译所有ts文件）			tsc  -w（监视并编译所有ts文件）
但是必须有一个 tsconfig.json 文件

```json
{
	/*
		tsconfig.json可以有注释
		它是ts编译器的配置文件，ts编译器可以根据其中的配置对代码进行编译
		include 指定哪些目录下的ts文件需要被编译	*任意文件	**任意目录
		exclude 指定哪些目录下得ts文件不需要被编译 
		默认值，不写也可以 "node_modules","bower_components","jspm_packages"
		extends 定义被继承的配置文件，当前配置文件会包含指定位置的配置文件中所有的配置信息
		files 指定被编译文件的列表，只有文件少时会用到
	*/
	"include": [
        "./src/**/*",
        ...
    ],		
	"exclude": [
        "./src/other/**/*",
        "node_modules","bower_components","jspm_packages"
    ],
    "entends": "./configs/base",
    "files": ["types.ts","core.ts",...],
	/*
	compilerOptions 编译选项，非常重要，有很多子选项
		target	指定ts被编译成的es版本
		module	指定使用的模块化的规范
		lib	    指定项目中要使用的库（一般情况不需要设置）
		outDir	指定编译后文件所在的目录
		outFile 将代码合并为一个文件，多个ts文件中的代码合并到同一个文件中
		allowJs 是否对js文件进行编译		默认为false
		checkJs 是否检查js代码符合规范	默认为false
		removeComments 是否移除注释	默认为false
		noEmit 不生成编译后的文件	默认为false
		noEmitOnError 有错误时不生成编译文件	默认为false
		//语法检查相关
		alwaysStrict 编译后的文件是否使用严格模式	  默认为false   当有模块化代码时，默认就是严格模式
		noImplicitAny 不允许隐式的any类型  ts文件中存在隐式any类型会报错
		noImplicitThis 不允许不明确类型的this	在形参中指明this是什么类型
		strictNullChecks 严格检查空值	 dom?.addEventListener()  dom存在才执行
		strict 所有严格检查（上面4个）的总开关，它为true,上面4个可以不用写，且都为true   
	*/
	"compilerOptions": {
     	"target": "ES3（默认）/ES5/ES6/ES的版本",
		"module" "ES6/commonjs/amd",
		"outDir": "./dist",
		"outFile": "./dist/app.js",
		"allowJs": true,
		"checkJs": true,
		"removeComments": true,
		"noEmit": true,
		"noEmitOnError": true,
		"alwaysStrict": true,
		"noImplicitAny": true,
		"noImplicitThis": true,
		"strictNullChecks": true,
		"strict": true
     }
}
```



### 结合webpack：

npm init -y 	生成package.json文件

npm i -D webpack webpack-cli typescript ts-loader	安装开发依赖

webpack配置文件：webpack.config.js

```js
//引入一个包，node的  帮助拼接路径
const path = require('path')
//引入html插件
const HTMLWebpackPlugin = require('html-webpack-plugin')
//引入clean插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

//webpack中的所有配置信息都写在module.exports里
module.exports = {
    //指定模式	默认值为production
    mode: 'development' | 'production' | 'none',
    //指定入口文件
    entry: "./src/index.ts",
    //指定打包文件所在目录
    output: {
        path: path.resolve(__dirname,'dist'),
        //打包后的文件
        filename: 'bundle.js',
        //配置打包环境
        environment: {
            //打包后的js文件最外层不使用箭头函数当成立即执行函数
            arrowFunction: false
        }
    },
    //指定webpack打包时要使用的模块
    module: {
		//指定要加载的规则
        rules: [
            {
                //test指定规则生效的文件
                test: /\.ts$/,	//匹配以ts结尾的文件
                //要使用的loader	从后往前执行
                use: [
                    {
                        //指定加载器
                        loader: 'babel-loader',
                        //设置babel
                        options: {
                            //设置预定义环境
				      	   presets: [
                             	[
                                    //指定环境的插件
                                    "@babel/preset-env",
                                    //配置信息
                                    {
                                        //兼容的目标浏览器
                                        targets: {	
                                            "chrome": "58",	//版本
                                            "ie": "11"
                                        },
                                        //指定corejs的版本
                                        "corejs": "3",
                                        //使用corejs的方式	usage按需加载
                                        "useBuiltIns": "usage"
                                    }
                                ]
                             
                        	]
                        }
                    },
                    'ts-loader'
                ],
                //要排除的文件
                exclude: /node_modules/		//排除node-modules文件夹
            }
        ]
    },
    //配置webpack插件
    plugins: [
        new HTMLWebpackPlugin({
           //title: '自定义title',
           //模板	自己编写的html
            template: "./src/index.html"
        }),
        new CleanWebpackPlugin()
    ],
    //设置引用模块
    resolve: {
        //以ts、js结尾的文件都可以作为模块使用
        extensions: ['.ts','.js']
    }
}

```

在package.json中的 scripts 中添加 "build" : "webpack" ，通过npm run build执行webpack打包文件

npm i -D html-webpack-plugin	自动生成 html 文件并引入bundle.js文件

npm i -D webpack-dev-server 	安装内置服务器  在package.json中的 scripts 中添加 "start" : "webpack serve --open chrome.exe"    npm start 运行    以Chrome浏览器打开网页

npm i -D clean-webpack-plugin	先清除dist目录，再生成新的

npm i -D @babel/core @babel/preset-env babel-loader core-js	

将新的语法等转换成以前的，让低版本浏览器能够运行js



### 类  class

```js
class 类名 {
    //实例属性
	属性名: 类型 = 值;
	//只读属性，不可修改
	readonly 属性名: 类型;
	//静态属性	通过类名使用
	static 属性名: 类型 = 值;
	//如果没有赋值在构造器里赋值
	constructor(参数: 类型){
        this.属性名 = 参数;
    }
	方法名(){
        ...
    }
}

抽象类	在 class 关键字前加 abstract
不能用来创建对象，不能实例化，专门用来被继承的类	可以有实际的值

抽象方法	在方法名前加 abstract	没有方法体	只能定义在抽象类中
abstract method(): void;	//只定义，不实现，由继承的子类去实现
```

### 接口：用来定义一个类结构，一个类中应该包含哪些属性和方法，也可当成类型声明使用

```typescript
//接口只定义结构，不能有实际值
interface myInterface {
    //只定义属性
    name: string;
    age: number;
    //只定义方法
    method(): void;
}
//定义类实现接口，使类满足接口要求	定义规范
class MyClass implements myInterface {
    name: string;
    constructor(name: string){
        this.name = name;
    }
    method() {
        ...
    }
}
```

属性封装：让属性更安全	

```typescript
//public（公共属性，可在任意地方使用，包括子类，属性不加修饰符时的默认）

//private（私有属性，只能在当前类内部进行访问，可以提供公共方法访问、修改）
class Person {
    private _name;
    //定义getter和setter方法，使用时当成属性 per.name="张三" 即可
	get name() { 
        return this._name;
    } 
    set name(value: string) { 
        this._name = value;
    }
    
    //也可	只不过使用时是方法 per.getName()	、per.setName('李四')
    getName() {
        return this._name;
    }
    setName(value: string) {
        this._name = value;
    }
}


//protected （保护的属性，在当前类及其子类中可以访问）
```

在类中定义属性可写成

```typescript
class Person {
    //必须加属性修饰符
    //类中已经包含这两个属性
    //this.name = name 和 this.age = age不用写
    constructor(public name: string, public age: number){}
}
new Person('张三',18)
```



### 泛型：定义函数或类时，如果 <u>类型不明确</u> 可以使用泛型

```typescript
//T类型，只有在使用时才确定   <>中的符号可以是任意
function func<T>(a: T): T {
    return a;
}

func(10)	//不指定泛型，TS会自动推断类型为number
func<string>('hello') //指定泛型 为string

//多个泛型
function func2<T, K>(a: T, b: K): T {
    return a;
}
func2<number,string>(10,'hello')

//限制泛型的范围
interface myInterface {
    length: number;
}
//T是一个泛型，必须实现myInterface这个接口	也可以传类
function func3<T extends myInterface>(a: T): number {
    return a.length;
}
//字符串有length属性
func3('123')
//对象里有length属性
func3({length: 10})

//在类中使用
class MyClass<T> {
    name: T;
    constructor(name: T) {
		this.name = name;
    }
}

new MyClass<string>('张三')
```

