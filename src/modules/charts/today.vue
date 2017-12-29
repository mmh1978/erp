<style lang="less" scope>

</style>
<template>
    <div class="content" style="overflow: auto;">
        <div style="padding:10px">
            <el-card class="box-card" style="width:500px;height:220px;float:left;margin:0 10px 10px 0;" v-if="allRole || r3">
                <div slot="header" class="clearfix">
                <span>库存</span>
                </div>
                <div v-for="item in stock" class="text item">
                    {{item.categoryName}} — 数量：{{item.number}} ， 价格：{{item.price}} 元
                </div>
                <div style="text-align:right">价格合计：{{stockTotal}} 元</div>
            </el-card>
            <el-card class="box-card" style="width:500px;height:220px;float:left;margin:0 10px 10px 0;" v-if="allRole || r3">
                <div slot="header" class="clearfix">
                <span>采购统计，月累计</span>
                </div>
                <div v-for="item in purchaseMonth" class="text item">
                    {{item.categoryName}} — 数量：{{item.number}} ， 价格：{{item.price}} 元
                </div>
                <div style="text-align:right">价格合计：{{purchaseTotal}} 元</div>
            </el-card>
            <el-card class="box-card" style="width:500px;height:220px;float:left;margin:0 10px 10px 0;" v-if="allRole || r3">
                <div slot="header" class="clearfix">
                <span>采购统计，日累计</span>
                </div>
                <div v-for="item in purchaseDay" class="text item">
                    {{item.categoryName}} — 数量：{{item.number}} ， 价格：{{item.price}} 元
                </div>
                <div style="text-align:right" v-if="purchaseDayTotal">价格合计：{{purchaseDayTotal}} 元</div>
            </el-card>
            <el-card class="box-card" style="width:500px;height:220px;float:left;margin:0 10px 10px 0;" v-if="allRole || r3">
                <div slot="header" class="clearfix">
                <span>销售统计，月累计</span>
                </div>
                <div v-for="item in saleMonth" class="text item">
                    {{item.categoryName}} — 数量：{{item.number}} ， 价格：{{item.price}} 元 ，毛利润：{{item.grossProfit}} 元
                </div>
                <div style="text-align:right">价格合计：{{saleMonthTotal}} 元</div>
                <div style="text-align:right">毛利润合计：{{grossProfitMonthTotal}} 元</div>
            </el-card>
            <el-card class="box-card" style="width:500px;height:220px;float:left;margin:0 10px 10px 0;" v-if="allRole || r3">
                <div slot="header" class="clearfix">
                <span>销售统计，日累计</span>
                </div>
                <div v-for="item in saleDay" class="text item">
                    {{item.categoryName}} — 数量：{{item.number}} ， 价格：{{item.price}} 元
                </div>
                <div style="text-align:right" v-if="saleDayTotal">价格合计：{{saleDayTotal}} 元</div>
                <div style="text-align:right" v-if="grossProfitDayTotal">毛利润合计：{{grossProfitDayTotal}} 元</div>
            </el-card>
            <el-card class="box-card" style="width:500px;height:220px;float:left;margin:0 10px 10px 0;" v-if="allRole || r4 || r3">
                <div slot="header" class="clearfix">
                <span>提现申请单</span>
                </div>
                <div class="text item">待转账提现单单数：{{moneyData.r1.number}}</div>
                <div class="text item">待转账提现单总额：{{moneyData.r1.price}}</div>
                <div class="text item">待确认收款单数：{{moneyData.r2.number}}</div>
                <div class="text item">待确认收款单总额：{{moneyData.r2.price}}</div>
                <div class="text item">待退款单单数：{{moneyData.r3.number}}</div>
                <div class="text item">待退款单总额：{{moneyData.r3.price}}</div>
            </el-card>
            <el-card class="box-card" style="width:500px;height:220px;float:left;margin:0 10px 10px 0;" v-if="allRole || r1 || r2 || r3">
                <div slot="header" class="clearfix">
                <span>鉴定服务单</span>
                </div>
                <div class="text item">待鉴定服务订单数：{{identifyData.r1.number}}</div>
                <div class="text item">待鉴定交易订单数：{{identifyData.r2.number}}</div>
                <div class="text item">总鉴定服务单数：{{identifyData.r3.number}}</div>
                <div class="text item">总鉴定交易订单数：{{identifyData.r4.number}}</div>
            </el-card>
            <el-card class="box-card" style="width:500px;height:220px;float:left;margin:0 10px 10px 0;" v-if="allRole || r2 || r3">
                <div slot="header" class="clearfix">
                <span>交易订单统计</span>
                </div>
                <div class="text item">待付款订单：{{dealData.r1.number}}</div>
                <div class="text item">待确认收款订单：{{dealData.r2.number}}</div>
                <div class="text item">卖家待发货订单：{{dealData.r3.number}}</div>
                <div class="text item">平台待发货订单：{{dealData.r4.number}}</div>
                <div class="text item">平台待退货订单：{{dealData.r5.number}}</div>
            </el-card>
            <el-card class="box-card" style="width:500px;height:220px;float:left;margin:0 10px 10px 0;" v-if="allRole || r2">
                <div slot="header" class="clearfix">
                <span>求购单</span>
                </div>
                <div class="text item">待审核订单数：{{buyData.r1.number}}</div>
            </el-card>
            <el-card class="box-card" style="width:500px;height:220px;float:left;margin:0 10px 10px 0;" v-if="allRole || r2 || r3">
                <div slot="header" class="clearfix">
                <span>回收单</span>
                </div>
                <div class="text item">待审核订单数：{{recycleData.r1.number}}</div>
            </el-card>
        </div>
    </div>
</template>

<script>
import api from '../../util/api'
import ajax from '../../util/ajax'
export default {
    name: 'tody',
    mixins: [ajax],
    data () {
        return {
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
            moneyData: {
                r1:{
                    number:'',
                    price:''
                },
                r2:{
                    number:'',
                    price:''
                },
                r3:{
                    number:'',
                    price:''
                }
            },
            identifyData: {
                r1:{
                    number:''
                },
                r2:{
                    number:''
                },
                r3:{
                    number:''
                },
                r4:{
                    number:''
                }
            },
            dealData:{
                r1:{
                    number:''
                },
                r2:{
                    number:''
                },
                r3:{
                    number:''
                },
                r4:{
                    number:''
                },
                r5:{
                    number:''
                }
            },
            buyData:{
                r1:{
                    number:''
                },
            },
            recycleData:{
                r1:{
                    number:''
                },
            },
            allRole:false,
            r1:false,
            r2:false,
            r3:false,
            r4:false
        }
    },
    created(){
        this.reData()
    },
    mounted(){

    },
    updated(){
        
    },
    methods:{
        reData(){
            this.fetchData(api.count,'',(data) => {
                this.stock=data
                for(let i in data){
                    this.stockTotal+=data[i].price
                }
            })
            this.fetchData(api.purchaseDetail+'/month','',(data) => {
                this.purchaseMonth=data
                for(let i in data){
                    this.purchaseTotal+=data[i].price
                }
            })
            this.fetchData(api.purchaseDetail+'/day','',(data) => {
                this.purchaseDay=data
                for(let i in data){
                    this.purchaseDayTotal+=data[i].price
                }
            })
            this.fetchData(api.saleReportManagement+'/month','',(data) => {
                this.saleMonth=data
                for(let i in data){
                    this.saleMonthTotal+=data[i].price
                    this.grossProfitMonthTotal+=data[i].grossProfit
                }
            })
            this.fetchData(api.saleReportManagement+'/day','',(data) => {
                this.saleDay=data
                for(let i in data){
                    this.saleDayTotal+=data[i].price
                    this.grossProfitDayTotal+=data[i].grossProfit
                }
            })

            this.fetchData(api.ordersList+'/money','',(data) => {
                this.moneyData = data
            })
            this.fetchData(api.identifyRequest+'/count','',(data) => {
                this.identifyData = data
            })
            this.fetchData(api.ordersList+'/count','',(data) => {
                this.dealData = data
            })
            this.fetchData(api.buyGoods+'/count','',(data) => {
                this.buyData = data
            })
            this.fetchData(api.recycleConsignment+'/count','',(data) => {
                this.recycleData = data
            })
            this.fetchData(api.hasRole,'',(data) => {
                if(data.管理员){
                    this.allRole = true
                }
                if(data.鉴定师){
                    this.r1 = true
                }
                if(data.客服){
                    this.r2 = true
                }
                if(data.推广){
                    this.r3 = true
                }
                if(data.财务){
                    this.r4 = true
                }
            })
        }
    }
}
</script>