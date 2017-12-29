<style lang="less" scope>
.content{
    position: absolute;
    left: 200px;
    right: 0;
    bottom: 0;
    top: 60px;
    overflow: hidden;
}
.position-tab{
    position: absolute;
    top: 0;
    bottom: 0;
}
.top-bar{
    overflow: hidden;
    padding: 10px 0;
    display: flex;
    align-items: center;
    .item{
        margin-left: 10px;
    }
}
.bottom-bar{
    overflow: hidden;
    display: flex;
    height: 44px;
    padding: 6px 0 0 6px;
}
.row-gap + .el-row{
    margin-top: 10px;
}
</style>
<template>
    <el-row class="container">
        <v-myheader></v-myheader>
        <v-side></v-side>
        <router-view></router-view>
        <div class="content" v-show="$route.path=='/home'" style="overflow: auto;">
            <!-- <div id="main" style="width:500px;height:500px;border:1px solid #ccc;border-radius:3px;margin:10px;float:left"></div>
            <div id="purchase_month" style="width:500px;height:500px;border:1px solid #ccc;border-radius:3px;margin:10px;float:left"></div>
            <div id="purchase_day" style="width:500px;height:500px;border:1px solid #ccc;border-radius:3px;margin:10px;float:left"></div>
            <div id="sale_month" style="width:500px;height:500px;border:1px solid #ccc;border-radius:3px;margin:10px;float:left"></div>
            <div id="sale_day" style="width:500px;height:500px;border:1px solid #ccc;border-radius:3px;margin:10px;float:left"></div> -->
           <!--  <div style="padding:10px">
                <el-card class="box-card" style="width:500px;height:200px;float:left;margin:0 10px 10px 0;">
                    <div slot="header" class="clearfix">
                    <span>库存</span>
                    </div>
                    <div v-for="item in stock"  class="text item">
                        {{item.categoryName}} — 数量：{{item.number}} ， 价格：{{item.price}} 元
                    </div>
                    <div style="text-align:right">价格合计：{{stockTotal}} 元</div>
                </el-card>
                <el-card class="box-card" style="width:500px;height:200px;float:left;margin:0 10px 10px 0;">
                    <div slot="header" class="clearfix">
                    <span>采购统计，月累计</span>
                    </div>
                    <div v-for="item in purchaseMonth"  class="text item">
                        {{item.categoryName}} — 数量：{{item.number}} ， 价格：{{item.price}} 元
                    </div>
                    <div style="text-align:right">价格合计：{{purchaseTotal}} 元</div>
                </el-card>
                <el-card class="box-card" style="width:500px;height:200px;float:left;margin:0 10px 10px 0;">
                    <div slot="header" class="clearfix">
                    <span>采购统计，日累计</span>
                    </div>
                    <div v-for="item in purchaseDay"  class="text item">
                        {{item.categoryName}} — 数量：{{item.number}} ， 价格：{{item.price}} 元
                    </div>
                    <div style="text-align:right" v-if="purchaseDayTotal">价格合计：{{purchaseDayTotal}} 元</div>
                </el-card>
                <el-card class="box-card" style="width:500px;height:200px;float:left;margin:0 10px 10px 0;">
                    <div slot="header" class="clearfix">
                    <span>销售统计，月累计</span>
                    </div>
                    <div v-for="item in saleMonth"  class="text item">
                        {{item.categoryName}} — 数量：{{item.number}} ， 价格：{{item.price}} 元 ，毛利润：{{item.grossProfit}} 元
                    </div>
                    <div style="text-align:right">价格合计：{{saleMonthTotal}} 元</div>
                    <div style="text-align:right">毛利润合计：{{grossProfitMonthTotal}} 元</div>
                </el-card>
                <el-card class="box-card" style="width:500px;height:200px;float:left;margin:0 10px 10px 0;">
                    <div slot="header" class="clearfix">
                    <span>销售统计，日累计</span>
                    </div>
                    <div v-for="item in saleDay"  class="text item">
                        {{item.categoryName}} — 数量：{{item.number}} ， 价格：{{item.price}} 元
                    </div>
                    <div style="text-align:right" v-if="saleDayTotal">价格合计：{{saleDayTotal}} 元</div>
                    <div style="text-align:right" v-if="grossProfitDayTotal">毛利润合计：{{grossProfitDayTotal}} 元</div>
                </el-card>
            </div> -->
        </div>
    </el-row>
</template>
<script>
import api from '../util/api'
import ajax from '../util/ajax'
// let echarts = require('echarts/lib/echarts');
// require('echarts/lib/chart/bar');
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');
export default {
    name: 'home',
    mixins: [ajax],
    data () {
        return {
            // stock: {
            //     title: { text: '' },
            //     tooltip : {
            //         trigger: 'axis',
            //         axisPointer : {
            //             type : 'shadow'
            //         }
            //     },
            //     grid: {
            //         left: '20px',
            //         right: '4%',
            //         bottom: '3%',
            //         containLabel: true
            //     },
            //     xAxis: {
            //         data: []
            //     },
            //     yAxis: {},
            //     series: [
            //     {
            //         name: '价格',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight'
            //             }
            //         },
            //         data: []
            //     },
            //     {
            //         name: '数量',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight'
            //             }
            //         },
            //         data: []
            //     }
            //     ]
            // },
            // purchaseMonth: {
            //     title: { text: '' },
            //     tooltip : {
            //         trigger: 'axis',
            //         axisPointer : {
            //             type : 'shadow'
            //         }
            //     },
            //     grid: {
            //         left: '20px',
            //         right: '4%',
            //         bottom: '3%',
            //         containLabel: true
            //     },
            //     xAxis: {
            //         data: []
            //     },
            //     yAxis: {},
            //     series: [
            //     {
            //         name: '价格',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight'
            //             }
            //         },
            //         data: []
            //     },
            //     {
            //         name: '数量',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight'
            //             }
            //         },
            //         data: []
            //     }
            //     ]
            // },
            // purchaseDay: {
            //     title: { text: '' },
            //     tooltip : {
            //         trigger: 'axis',
            //         axisPointer : {
            //             type : 'shadow'
            //         }
            //     },
            //     grid: {
            //         left: '20px',
            //         right: '4%',
            //         bottom: '3%',
            //         containLabel: true
            //     },
            //     xAxis: {
            //         data: []
            //     },
            //     yAxis: {},
            //     series: [
            //     {
            //         name: '价格',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight'
            //             }
            //         },
            //         data: []
            //     },
            //     {
            //         name: '数量',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight'
            //             }
            //         },
            //         data: []
            //     }
            //     ]
            // },
            // saleMonth:{
            //     title: { text: '' },
            //     tooltip : {
            //         trigger: 'axis',
            //         axisPointer : {
            //             type : 'shadow'
            //         }
            //     },
            //     grid: {
            //         left: '20px',
            //         right: '4%',
            //         bottom: '3%',
            //         containLabel: true
            //     },
            //     xAxis: {
            //         data: []
            //     },
            //     yAxis: {},
            //     series: [
            //     {
            //         name: '总金额',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight'
            //             }
            //         },
            //         data: []
            //     },
            //     {
            //         name: '毛利润',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight'
            //             }
            //         },
            //         data: []
            //     },
            //     {
            //         name: '数量',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight'
            //             }
            //         },
            //         data: []
            //     }
            //     ]
            // },
            // saleDay:{
            //     title: { text: '' },
            //     tooltip : {
            //         trigger: 'axis',
            //         axisPointer : {
            //             type : 'shadow'
            //         }
            //     },
            //     grid: {
            //         left: '20px',
            //         right: '4%',
            //         bottom: '3%',
            //         containLabel: true
            //     },
            //     xAxis: {
            //         data: []
            //     },
            //     yAxis: {},
            //     series: [
            //     {
            //         name: '总金额',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight'
            //             }
            //         },
            //         data: []
            //     },
            //     {
            //         name: '毛利润',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight'
            //             }
            //         },
            //         data: []
            //     },
            //     {
            //         name: '数量',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight'
            //             }
            //         },
            //         data: []
            //     }
            //     ]
            // },
            stock: '',
            stockTotal: 0,
            purchaseMonth: '',
            purchaseTotal: 0,
            purchaseDay: '',
            purchaseDayTotal: 0,
            saleMonth: '',
            saleDay: '',
            saleMonthTotal: 0,
            grossProfitMonthTotal: 0,
            saleDayTotal: 0,
            grossProfitDayTotal: 0,
        }
    },
    created(){
        // this.reData()
    },
    mounted(){

    },
    updated(){
        
    },
    methods:{
        reData(){
            if(this.$route.path=='/home'){
                this.fetchData(api.count,'',(data) => {
                    this.stock=data
                    for(let i in data){
                        this.stockTotal+=data[i].price
                    }
                    // for(let i in data){
                    //     this.stock.xAxis.data.push(data[i].categoryName)
                    //     this.stock.series[0].data.push(data[i].price)
                    //     this.stock.series[1].data.push(data[i].number)
                    // }
                    // this.stock.title.text = '库存'
                })
                this.fetchData(api.purchaseDetail+'/month','',(data) => {
                    this.purchaseMonth=data
                    for(let i in data){
                        this.purchaseTotal+=data[i].price
                    }
                    // for(let i in data){
                    //     this.purchaseMonth.xAxis.data.push(data[i].categoryName)
                    //     this.purchaseMonth.series[0].data.push(data[i].price)
                    //     this.purchaseMonth.series[1].data.push(data[i].number)
                    // }
                    // this.purchaseMonth.title.text = '采购统计，月累计'
                })
                this.fetchData(api.purchaseDetail+'/day','',(data) => {
                    this.purchaseDay=data
                    for(let i in data){
                        this.purchaseDayTotal+=data[i].price
                    }
                    // for(let i in data){
                    //     this.purchaseDay.xAxis.data.push(data[i].categoryName)
                    //     this.purchaseDay.series[0].data.push(data[i].price)
                    //     this.purchaseDay.series[1].data.push(data[i].number)
                    // }
                    // this.purchaseDay.title.text = '采购统计，日累计'
                })
                this.fetchData(api.saleReportManagement+'/month','',(data) => {
                    this.saleMonth=data
                    for(let i in data){
                        this.saleMonthTotal+=data[i].price
                        this.grossProfitMonthTotal+=data[i].grossProfit
                    }
                    // for(let i in data){
                    //     this.saleMonth.xAxis.data.push(data[i].categoryName)
                    //     this.saleMonth.series[0].data.push(data[i].price)
                    //     this.saleMonth.series[1].data.push(data[i].grossProfit)
                    //     this.saleMonth.series[2].data.push(data[i].number)
                    // }
                    // this.saleMonth.title.text = '销售统计，月累计'
                })
                this.fetchData(api.saleReportManagement+'/day','',(data) => {
                    this.saleDay=data
                    for(let i in data){
                        this.saleDayTotal+=data[i].price
                        this.grossProfitDayTotal+=data[i].grossProfit
                    }
                    // for(let i in data){
                    //     this.saleDay.xAxis.data.push(data[i].categoryName)
                    //     this.saleDay.series[0].data.push(data[i].price)
                    //     this.saleDay.series[1].data.push(data[i].grossProfit)
                    //     this.saleDay.series[2].data.push(data[i].number)
                    // }
                    // this.saleDay.title.text = '销售统计，日累计'
                })
            }
        }
    },
    watch:{
        // stock:{
        //     handler: function (val, oldVal) {
        //         var myChart = echarts.init(document.getElementById('main'))
        //         myChart.setOption(this.stock)
        //     },
        //     deep: true
        // },
        // saleMonth:{
        //     handler: function (val, oldVal) {
        //         var saleMonthChart = echarts.init(document.getElementById('sale_month'))
        //         saleMonthChart.setOption(this.saleMonth)
        //     },
        //     deep: true
        // },
        // saleDay:{
        //     handler: function (val, oldVal) {
        //         var saleDayChart = echarts.init(document.getElementById('sale_day'))
        //         saleDayChart.setOption(this.saleDay)
        //     },
        //     deep: true
        // },
        // purchaseMonth:{
        //     handler: function (val, oldVal) {
        //         var purchaseMonthChart = echarts.init(document.getElementById('purchase_month'))
        //         purchaseMonthChart.setOption(this.purchaseMonth)
        //     },
        //     deep: true
        // },
        // purchaseDay:{
        //     handler: function (val, oldVal) {
        //         var purchaseDayChart = echarts.init(document.getElementById('purchase_day'))
        //         purchaseDayChart.setOption(this.purchaseDay)
        //     },
        //     deep: true
        // }
    }
}
</script>