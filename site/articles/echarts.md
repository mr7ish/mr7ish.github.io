---
createTime: 2022-12-28
tags:
  - Echarts
coverImg: /dogsRun.gif
---



官方：https://echarts.apache.org/zh/index.html

社区：https://madeapie.com/#/（活跃用户创造图表）



安装：npm install echarts -S

全部引入： import echarts from 'echarts'		（ Echarts 4.x引入方式 ）

按需引入： import echarts from 'echarts/lib/echarts'

**注意：Echarts 5.x 不再支持上面的引入方式**

import * as echarts from ' echarts '

 import * as echarts from 'echarts/lib/echarts'



图表适配：

window.addEventListener('resize' , function () {
​	myChart.resize();
});

```js
//初始化实例对象	指定容器（必须有明确的宽高）
const myChart = echarts.init(  domContainer )

//设置配置项各项参数
let option = {...}

//注入配置项
myChart.setOption( option )

//折线图配置项
lineOption = {
    //设置颜色
    color: ['']
    //图表标题
    title: {},
    //图标提示信息
    tooltip: {
        //触发方式
        trigger: 'axis/item' 有坐标轴的、无坐标的图表,
        //坐标轴指示器
        axisPointer: {
            type: 'shadow/line' 默认为line
        }
    },
    //图例  图表对应样式
    legend: {
        //series里如果有name，可以不要data
        data: [],
        //图例文字的颜色
        textStyle: {
            color: '#fff'
        },
        //距离右边的距离
        right: '10%'
    },
    //工具箱
    toolbox: {
        feature: {
            //可以另存为图片
            saveAsImage: {}
        }
    },
    
    //有直角坐标系的图才有，可修改图表的大小
    grid: {
    	//图表网格距离容器的距离
    	left: '10%',
    	right: '',
    	bottom: '',
    	//是否显示刻度标签	如果图表太挤不写或false
    	containLabel: true,
        //是否显示边框
        show: true,
        //边框颜色
        borderColor: '#fff'
	},
	//x轴
	xAxis: {
        //坐标轴类型
        type: 'category/value/time/log', 类目、数值、时间、对数,
        //边界间隙	是否让坐标轴与边界有间隙
        boundaryGap: false,
        //x轴每个刻度显示的文字信息
        data: [],
        //坐标轴刻度标签
        axisLabel: {
            //文字颜色
            color: '',
            //文字大小
            fontSize: '18'
        },
        //坐标轴样式
        axisLine: {
            //是否显示
            show: false,
        }
    },
	//y轴
    yAxis: {
        type: 'value',
        axisLine: {
            //线条样式
            lineStyle: {
                //颜色
                color: '',
                //宽度
                width: 1,
                //线型
                type: 'solid'
            }
        },
        //分割线样式
        splitLine: {
            lineStyle: {}
        },
        //是否显示y轴刻度
        axisTick: {
        	show: false
        },
    },
    //系列配置
    series: [
        {
            //某一类名称
            name: '',
            //以哪种类型显示图表
            type: 'bar/line',
            //数据是否堆叠显示	如一类的值为100，另一类的为200，另一类的显示位置为300
            //数据堆叠：同个类目轴上的系列配置相同的stack值后，后一个系列的值会在前一个系列的值上相加
            stack: '总量',
            //各x轴数据
            data: [],
            //线条是否平滑
        	smooth: true,
            //单独修改这条线的样式
            lineStyle: {
                color: '#fff',
                width: 3
            },
            //填充区域样式
            areaStyle: {
               color: new echarts.graphic.LinearGradient(0,0,0,1,
                      [{
                          //偏移
                          offset: 0,
                          color: "rgba(1, 132, 213, 0.4)"   // 渐变色的起始颜色
                        },
                        {
                          offset: 0.8,
                          color: "rgba(1, 132, 213, 0.1)"   // 渐变线的结束颜色
                        }
                      ],
                       false
                      ),
                //阴影颜色
                shadowColor: '#fff'
            },
            //拐点
            symbol: 'circle',
            //拐点大小
            symbolSize: 4,
            //开始不显示，鼠标经过显示
            showSymbol: false,
            //设置拐点颜色及边框
            itemStyle: {
                color: '#fff',
                borderColor: 'rgba(255,255,255,.3)',
                borderWidth: 5
            }
        }
    ]
}

//柱状图配置项
barOption = {
    series: [
        {
            //柱子宽度
            barWidth: '35%' | 10,
            //每一项样式
            itemStyle: {
                //柱子圆角
                barBorderRadius: 5,
                //每个柱子的颜色	params每个柱子的对象
                color: function(params){
                    //为每个柱子设置不同的颜色
                    return myColor[params.dataIndex]
                }
            },
            //柱子之间的距离
            barCategoryGap: 50,
            //图形上的文本标签
            label: {
                //是否展示
                show: true,
                //图形内显示
                position: 'inside',
                //文字显示格式	{c}会替换data里的数据
                formatter: '{c}%'
            }
        }
    ]
}

//饼图配置项
pieOption = {
    legend: {
        //位于底部
        bottom: '10%',
        //小图标宽高
        itemWidth: 15,
        itemHeight: 15
    },
    series: [
    	{
            //饼图在容器中的位置
        	center: ['50%','50%'],
            //内圆半径和外圆半径		半分比是相对于容器
            radius: ['40%','60%'],
            //是否显示文字标签
            label: {
                show: true
            }
            //是否显示连接线
            labelLine: {
                show: false
            }
    	}
    ]
    
}
```

