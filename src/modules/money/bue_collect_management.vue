<style lang="less" scope>
    .goods_img{
        width: 100%;
        height: 320px;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        margin-top: 10px;
    }
table.gridtable , table.innertable{
    font-size:14px;
    color:#333333;
    border-width: 1px;
    border-color: #666;
    border-collapse: collapse;
    width: 100%;
}
table.gridtable td{
    border-width: 1px;
    border-style: solid;
    border-color: #666;
    background-color: #ffffff;
}
table.gridtable td>div{
    margin: 10px;
}
table.gridtable td>div input{
    border: 0;
    width: 100%;
    outline: none;
    font-size: 14px;
}
table.gridtable td>div .checkbox{
    display: inline-block;
    position: relative;
    padding-left: 20px;
    margin-right: 16px;
}
table.gridtable td>div .checkbox:before{
    content: "";
    display: block;
    position: absolute;
    width: 14px;
    height: 14px;
    border: 1px solid #999;
    border-radius: 4px;
    left: 0;
    top: 50%;
    margin-top: -8px;
    line-height: 14px;
    text-align: center;
}
table.gridtable td>div .checkbox.ok:before{
    content: "\2713";
    font-weight: bold;
    border: 2px solid #000;
}
table.innertable td{
    border-top: none;
    border-left: none;
    border-bottom: none;
    border-right: 1px solid #666;
}
table.innertable td:last-child{
    border: none;
}
</style>
<template>
    <div class="content">
        <el-dialog v-model="dialogVisible" size="full">
            <img :src="dialogImageUrl" alt="">
        </el-dialog>
        <!-- search -->
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-input v-model="pkGlobalIdSearch" placeholder="订单号"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="sellUserPhoneSearch" placeholder="卖家手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="buyUserPhoneSearch" placeholder="买家手机号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="statusSearch" clearable placeholder="订单状态">
                            <el-option :label="'待付款'" :value="'0'"></el-option>
                            <el-option :label="'卖家待发货'" :value="1"></el-option>
                            <el-option :label="'平台待收货'" :value="2"></el-option>
                            <el-option :label="'平台处理中'" :value="3"></el-option>
                            <el-option :label="'平台待发货'" :value="4"></el-option>
                            <el-option :label="'平台待退货'" :value="5"></el-option>
                            <el-option :label="'买家待收货'" :value="6"></el-option>
                            <el-option :label="'买家已收货'" :value="7"></el-option>
                            <el-option :label="'卖家待收货'" :value="8"></el-option>
                            <el-option :label="'卖家已收货'" :value="9"></el-option>
                            <el-option :label="'已取消'" :value="10"></el-option>
                            <el-option :label="'已退款'" :value="11"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item>
                        <el-select v-model="orderTypeSearch" clearable placeholder="订单类型">
                            <el-option :label="'购买商品'" :value="0"></el-option>
                            <el-option :label="'鉴定打赏'" :value="1"></el-option>
                            <el-option :label="'学院打赏'" :value="2"></el-option>
                            <el-option :label="'鉴定悬赏'" :value="3"></el-option>
                            <el-option :label="'卖家拍品保证金'" :value="4"></el-option>
                            <el-option :label="'买家拍品保证金'" :value="5"></el-option>
                            <el-option :label="'拍品成交定单'" :value="6"></el-option>
                            <el-option :label="'养护定单'" :value="7"></el-option>
                            <el-option :label="'vip服务'" :value="8"></el-option>
                            <el-option :label="'我要中检'" :value="9"></el-option>
                            <el-option :label="'保证金'" :value="1"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button icon="search" @click="reData">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- content -->
        <template>
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="order.pkGlobalId" label="订单号" width="200"></el-table-column>
                <el-table-column prop="title" label="商品标题" min-width="200"></el-table-column>
                <el-table-column prop="categoryName" label="商品类型" min-width="100"></el-table-column>
                <el-table-column prop="price" label="商品价格" min-width="120"></el-table-column>
                <el-table-column prop="commissionPrice" label="佣金" min-width="120"></el-table-column>
                <el-table-column prop="fee" label="手续费" min-width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].fee">
                            {{dataList.content[scope.$index].fee}}
                        </template>
                        <template v-else>
                            0.00
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="order.totalPrice" label="支付金额" min-width="120"></el-table-column>           
                <el-table-column prop="order.payType" label="支付方式" min-width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].order">
                            <template v-if="dataList.content[scope.$index].order.payType=='1'">微信</template>
                            <template v-if="dataList.content[scope.$index].order.payType=='2'">支付宝</template>
                            <template v-if="dataList.content[scope.$index].order.payType=='3'">余额</template>
                            <template v-if="dataList.content[scope.$index].order.payType=='4'">银联</template>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="下单时间" width="180"></el-table-column>
                <el-table-column prop="order.principal.name" label="客服" min-width="120"></el-table-column>
                <el-table-column prop="status" label="收款状态" min-width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].order.collectStatus=='0'">未到账</template>
                        <template v-if="dataList.content[scope.$index].order.collectStatus=='1'">已到账</template>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="70">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="showModify(scope.$index, dataList.content)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>
        <!-- dialog -->
        <el-dialog title="编辑订单" :visible.sync="modifyState" size="large" :before-close="handleClose">

            <el-tabs type="border-card" v-model="activeName" @tab-click="changeTabs">
                <!-- the first tab -->
                <el-tab-pane label="基本信息" name="first">
                    <el-form label-width="120px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="订单号" prop="">
                                    <el-input v-model="detail.order.pkGlobalId" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="商品价格" prop="">
                                    <el-input v-model="detail.price" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="订单金额" prop="">
                                    <el-input v-model="detail.order.totalPrice" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="支付状态" prop="">
                                    <el-input v-if="detail.order.status=='0'" value="未付款" disabled></el-input>
                                    <el-input v-if="detail.order.status=='1'" value="已付款" disabled></el-input>
                                    <el-input v-if="detail.order.status=='2'" value="已取消" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="鉴定方式" prop="">
                                    <el-input v-if="detail.identifyMethod=='0'" value="远程鉴定" disabled></el-input>
                                    <el-input v-if="detail.identifyMethod=='1'" value="中检鉴定" disabled></el-input>
                                    <el-input v-if="detail.identifyMethod=='2'" value="实物鉴定" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="鉴定价格" prop="">
                                    <el-input v-if="detail.price<20000" value="100" disabled></el-input>
                                    <el-input v-if="20000<=detail.price && detail.price<50000" value="200" disabled></el-input>
                                    <el-input v-if="50000<=detail.price" value="400" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="鉴定状态" prop="">
                                    <template v-if="detail.identifyRequest">
                                        <el-input v-if="detail.identifyRequest.identifyStatus=='0'" value="待鉴定" disabled></el-input>
                                        <el-input v-if="detail.identifyRequest.identifyStatus=='1'" value="已鉴定" disabled></el-input>
                                    </template>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="鉴定师" prop="">
                                    <template v-if="detail.identifyResult">
                                        <el-input v-model="detail.identifyResult.identifierName" disabled></el-input>
                                    </template>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="卖家名称" prop="">
                                    <el-input v-model="detail.sellUser.nickName" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="卖家电话" prop="">
                                    <el-input v-model="detail.sellUser.phone" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="学员" prop="">
                                    <el-input v-if="detail.sellUser.student" value="是" disabled></el-input>
                                    <el-input v-else value="否" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="平台至买家运费" prop="">
                                    <el-input v-if="usToBuy.exPrice" :value="usToBuy.exPrice" disabled></el-input>
                                    <el-input v-else value="暂无" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="买家名称" prop="">
                                    <el-input v-model="detail.buyUser.nickName" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="买家电话" prop="">
                                    <el-input v-model="detail.buyUser.phone" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="下单时间" prop="">
                                    <el-input v-model="detail.createTime" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="更新时间" prop="">
                                    <el-input v-model="detail.updateTime" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="结单金额" prop="">
                                    <el-input v-if="usToBuy.exPrice" :value="detail.price-exPrice-detail.commissionPrice-detail.order.fee" disabled></el-input>
                                    <el-input v-else :value="detail.price-detail.commissionPrice-detail.order.fee" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="手续费" prop="">
                                    <el-input v-model="detail.order.fee" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="佣金比例" prop="">
                                    <el-input :value="detail.commission+'‰'" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="佣金" prop="">
                                    <el-input v-model="detail.commissionPrice" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="操作状态" prop="">
                                    <el-select :value="detail.status" disabled placeholder="请选择" style="width:100%">
                                        <el-option :label="'待付款'" :value="0"></el-option>
                                        <el-option :label="'卖家待发货'" :value="1"></el-option>
                                        <el-option :label="'平台待收货'" :value="2"></el-option>
                                        <el-option :label="'平台处理中'" :value="3"></el-option>
                                        <el-option :label="'平台待发货'" :value="4"></el-option>
                                        <el-option :label="'平台待退货'" :value="5"></el-option>
                                        <el-option :label="'买家待收货'" :value="6"></el-option>
                                        <el-option :label="'买家已收货'" :value="7"></el-option>
                                        <el-option :label="'卖家待收货'" :value="8"></el-option>
                                        <el-option :label="'卖家已收货'" :value="9"></el-option>
                                        <el-option :label="'已取消'" :value="10"></el-option>
                                        <el-option :label="'已退款'" :value="11"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="财务" prop="">
                                    <el-input v-if="detail.order.admin" :value="detail.order.admin.name" disabled></el-input>
                                    <el-input v-else value="暂无" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="支付方式" prop="">
                                    <el-select v-model="detailStatus.payType" placeholder="请选择" style="width:100%">
                                        <el-option :label="'其他'" :value="0"></el-option>
                                        <el-option :label="'微信'" :value="1"></el-option>
                                        <el-option :label="'支付宝'" :value="2"></el-option>
                                        <el-option :label="'余额'" :value="3"></el-option>
                                        <el-option :label="'银联'" :value="4"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="收款状态" prop="">
                                    <el-select v-model="detailStatus.collectStatus" placeholder="请选择" style="width:100%">
                                        <el-option :label="'未到账'" :value="0"></el-option>
                                        <el-option :label="'已到账'" :value="1"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="流水单号" prop="">
                                    <el-input v-model="detailStatus.turnover1"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item>
                                    <el-button type="primary" @click="modifyStatus">提交</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <!-- the seventh tab -->
                <el-tab-pane label="操作记录" name="seventh">
                    <el-table :data="orderLog" border style="width: 100%">
                        <el-table-column type="index" label="编号" width="70"></el-table-column>
                        <el-table-column prop="orderId" label="订单号" width="300"></el-table-column>
                        <el-table-column prop="content" label="内容" min-width="200"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

        </el-dialog>
    </div>
</template>

<script>
import api from '../../util/api'
import ajax from '../../util/ajax'
export default {
    name: 'bueCollectManagement',
    mixins: [ajax],
    data () {
        return {
            dialogVisible: false,
            dialogImageUrl: '',

            pkGlobalIdSearch: '',
            sellUserPhoneSearch: '',
            buyUserPhoneSearch: '',
            statusSearch: '',
            orderTypeSearch: '',

            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,

            file: '',
            thumb: '',

            detail: {
                order: {
                    pkGlobalId: '',
                    totalPrice: '',
                    fee: '',
                    payType: '',
                    admin: {
                        name: ''
                    }
                },
                sellUser: {
                    nickName: '',
                    phone: '',
                    student: false
                },
                buyUser: {
                    nickName: '',
                    phone: ''
                },
                sellGoods: {
                    descript: '',
                },
                identifyResult: {
                    identifierName: ''
                },
                identifyRequest: {
                    identifyStatus: ''
                },
                status: '',

            },
            detailStatus: {
                payType: '',
                collectStatus: '',
                turnover1: '',
                pkGlobalId: '',
            },

            modifyState: false,
            activeName: 'first',
          
            //退款信息
            refund:{
                cutType: 0,
                cutPrice: '',
                refundName: '',
                refundType: 1,
                refundAccount: '',
                memo: '',
                id: '',
            },

            //后加的鬼
            isPrint: true,
            tableBag: {
                customerName: '',
                appraiser: '',
                identifyDate: '',
                code: '',
                brandName: '',
                serialName: '',
                typeName: '',
                publicPrice: '',
                style: [],
                packaging: [],
                source: [],
                cortexLogo: [],
                cortexPrint: [],
                cortexPaint: [],
                cortexMaterial: [],
                cortexSmell: [],
                liningYear: [],
                liningWashWater: [],
                liningCode: [],
                liningInside: [],
                hardwareSlider: [],
                hardwareBud: [],
                hardwareRivet: [],
                hardwareClasp: [],
                hardwareChain: [],
                hardwareButton: [],
                qualityAbrasion: [],
                qualityAbsorption: [],
                qualityOxygenation: [],
                qualityDiscoloration: [],
                qualityScratch: [],
                other: '',
                conclusion: '',
            },
            tableWatch: {
                customerName: '',
                appraiser: '',
                identifyDate: '',
                brandName: '',
                serialName: '',
                typeName: '',
                publicPrice: '',
                style: [],
                packaging: [],
                source: [],
                watchcaseTraces: [],
                watchcaseShape: [],
                material: [],
                watchDiameter: [],
                watchDial: [],
                scale: [],
                watchNeedle: [],
                calendar: [],
                watchSmallDial: [],
                watchMirror: [],
                watchCrown: [],
                diamond: [],
                rearCover: [],
                watchEar: [],
                strapMaterial: [],
                metalStrap: [],
                cortexStrap: [],
                watchButton: [],
                screw: [],
                polish: [],
                lettering: [],
                movementScrew: [],
                rotor: [],
                retainerRing: [],
                func: [],
                conclusion: '',

                strapNumber: '',
                dailyDifference: '',
                swing: '',
                polarization: '',
                parameter: '',
            },
            jdStatus: '',

            fileList: [],
            exPrice:0,//卖家至平台运费
            sellToUs: '',
            usToSell: '',
            usToBuy: '',
            receiveAddr: '',//收货人
            orderLog: [],//操作记录

            usToSellTemp:{
                pkGlobalId: '',
                goodsBuyId: '',
                exNumber: '',
                exCompany: "顺丰",
                exPrice: '',
                type: 2
            },
            usToBuyTemp:{
                pkGlobalId: '',
                goodsBuyId: '',
                exNumber: '',
                exCompany: "顺丰",
                exPrice: '',
                type: 3
            }
        }
    },
    created(){
        var _vue=this
        this.autoHeight=window.innerHeight-160
        window.onresize=function(){_vue.autoHeight=window.innerHeight-160}

        this.reData()

        this.file = api.file + '/'
        this.thumb = api.thumb + '/'
    },
    mounted(){

    },
    updated(){
        
    },
    methods:{
        handleCurrentChange(val) {
            this.loading=true
            let _searchData = ''
            if(this.pkGlobalIdSearch){
                _searchData+='&pkGlobalId='+this.pkGlobalIdSearch
            }
            if(this.sellUserPhoneSearch){
                _searchData+='&sellUser.phone='+this.sellUserPhoneSearch
            }
            if(this.buyUserPhoneSearch){
                _searchData+='&buyUser.phone='+this.buyUserPhoneSearch
            }
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            if(this.orderTypeSearch){
                _searchData+='&orderType='+this.orderTypeSearch
            }
            this.fetchData(api.ordersList+'?status=1&sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            let _searchData = ''
            if(this.pkGlobalIdSearch){
                _searchData+='&pkGlobalId='+this.pkGlobalIdSearch
            }
            if(this.sellUserPhoneSearch){
                _searchData+='&sellUser.phone='+this.sellUserPhoneSearch
            }
            if(this.buyUserPhoneSearch){
                _searchData+='&buyUser.phone='+this.buyUserPhoneSearch
            }
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            if(this.orderTypeSearch){
                _searchData+='&orderType='+this.orderTypeSearch
            }
            this.fetchData(api.ordersList+'?status=1&sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        showModify(index , data) {

            this.fetchData(api.logistics+'/?goodsBuyId='+data[index].pkGlobalId+'&type=1','',(data) => {
                if(data.length>0){
                    this.exPrice = data[0].exPrice
                    this.sellToUs = data[0]
                }
            
            })
            this.fetchData(api.logistics+'/?goodsBuyId='+data[index].pkGlobalId+'&type=2','',(data) => {
                if(data.length>0){
                    this.usToSell = data[0]
                    //以后要删除的
                    if(data[0].pkGlobalId){
                        this.usToSellTemp.pkGlobalId=data[0].pkGlobalId
                    }
                    this.usToSellTemp.exNumber=data[0].exNumber
                    this.usToSellTemp.exPrice=data[0].exPrice
                }

            })
            this.fetchData(api.logistics+'/?goodsBuyId='+data[index].pkGlobalId+'&type=3','',(data) => {
                if(data.length>0){
                    this.usToBuy = data[0]
                    //以后要删除的
                    if(data[0].pkGlobalId){
                        this.usToBuyTemp.pkGlobalId=data[0].pkGlobalId
                    }
                    this.usToBuyTemp.exNumber=data[0].exNumber
                    this.usToBuyTemp.exPrice=data[0].exPrice
                }

            })

            this.detail=data[index]
            this.detailStatus.payType=data[index].order.payType
            this.detailStatus.collectStatus=data[index].order.collectStatus
            this.detailStatus.turnover1=data[index].order.turnover1
            this.detailStatus.pkGlobalId=data[index].order.pkGlobalId

            this.refund={
                cutType: data[index].cutType,
                cutPrice: data[index].cutPrice,
                refundName: data[index].refundName,
                refundType: data[index].refundType,
                refundAccount: data[index].refundAccount,
                memo: data[index].memo,
            }

            this.activeName = 'first'
            this.modifyState=true

        },
        changeTabs(targetName) {
            if(targetName.name=='second'){
                this.fetchData(api.goodsImage+'/?goodsId='+this.detail.sellGoods.pkGlobalId,'',(data) => {
                    this.fileList = data.content
                })
            }else if(targetName.name=='third'){
                this.fetchData(api.receiverAddr+'/'+this.detail.receiveAddrId,'',(data) => {
                    this.receiveAddr = data
                })
            }else if(targetName.name=='fourth'){
                if(this.detail.sellGoods.categoryId=='1'){
                    this.fetchData(api.identifyReportWatch+'?identifyId='+this.detail.identifyRequest.pkGlobalId,'',(data) => {
                        console.log(data)
                    })
                }
                if(this.detail.sellGoods.categoryId=='2'){
                    this.fetchData(api.identifyReport+'?identifyId='+this.detail.identifyRequest.pkGlobalId,'',(data) => {
                        console.log(data)
                    })
                }
            }else if(targetName.name=='fifth'){
                
            }else if(targetName.name=='sixth'){
                
            }else if(targetName.name=='seventh'){
                this.fetchData(api.orderLog+'?orderId='+this.detail.order.pkGlobalId,'',(data) => {
                    this.orderLog = data
                })
            }
        },
        modifyStatus(){
            console.log(this.detailStatus)
            this.patchData(api.order+'/'+this.detailStatus.pkGlobalId,this.detailStatus,(data) => {
                this.$message({showClose: true,message: '提交成功',type: 'success'})
                this.reData()
            })
        },
        submitRefund(){
            this.refund.id = this.detail.pkGlobalId
            this.patchData(api.ordersList+'/'+this.detail.pkGlobalId,this.refund,(data) => {
                this.$message({showClose: true,message: '提交成功',type: 'success'})
                this.reData()
            })
        },
        //运费以后要删了的方法
        subusToSellTemp(){
            this.usToSellTemp.goodsBuyId=this.detail.pkGlobalId
            this.subForm(api.logistics,this.usToSellTemp,(data) => {
                this.$message({showClose: true,message: '提交成功',type: 'success'})
                this.reData()
            })
        },
        //运费以后要删了的方法
        subusToBuyTemp(){
            this.usToBuyTemp.goodsBuyId=this.detail.pkGlobalId
            this.subForm(api.logistics,this.usToBuyTemp,(data) => {
                this.$message({showClose: true,message: '提交成功',type: 'success'})
                this.reData()
            })
        },
        handleClose(done) {
            done()
        },
        handlePictureCardPreview(file){
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        openImg(href){
            this.dialogImageUrl = ''
            this.dialogVisible = true
            this.dialogImageUrl = href
        },
        printme() {
            this.isPrint = false
            this.$nextTick(function(){
                document.body.innerHTML=document.getElementById('print').innerHTML
                window.print()
                window.location.reload()
            })
        }
    }
}
</script>