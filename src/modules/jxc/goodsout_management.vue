<style lang="less" scope>

</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-button type="primary" @click="addState = true;purchaseList = []" class="el-icon-plus"> 添加</el-button>
                    </el-form-item>
                    <el-form-item label="">
                        <el-date-picker v-model="timeSearch" type="daterange" placeholder="选择日期范围"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="search" @click="reData">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <template>
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="id" label="出库单编号" width="120"></el-table-column>
                <el-table-column prop="refId" label="关联编号" width="100"></el-table-column>
                <el-table-column prop="" label="关联人" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].type=='1'">
                            <template v-if="dataList.content[scope.$index].goodsSale">
                                <template v-if="dataList.content[scope.$index].goodsSale.seller">{{dataList.content[scope.$index].goodsSale.seller.name}}</template>
                            </template>
                        </template>
                        <template v-if="dataList.content[scope.$index].type=='2'">
                            <template v-if="dataList.content[scope.$index].purchase">
                                <template v-if="dataList.content[scope.$index].purchase.operator">{{dataList.content[scope.$index].purchase.operator.name}}</template>
                            </template>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                     <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].status=='01'">正常</template>
                        <template v-if="dataList.content[scope.$index].status=='02'">已撤销</template>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="出库类型" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].type=='1'">销售出库</template>
                        <template v-if="dataList.content[scope.$index].type=='2'">退货出库</template>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="备注" min-width="180"></el-table-column>
                <el-table-column prop="createTime" label="出库时间" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="plain" size="text" @click.native.prevent="showDetail(scope.$index, dataList.content)">查看</el-button>
                        <el-button type="plain" size="text" @click.native.prevent="deleteRow(scope.$index, dataList.content)">撤销</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>

        <el-dialog title="添加付款明细" :visible.sync="addAccountState" size="tiny">
            <el-form label-width="80px" :model="accountForm">
                <el-form-item label="付款账户">
                    <el-select v-model="accountForm.account" filterable placeholder="请选择" :loading="accountLoading" @visible-change="showAccount">
                        <el-option v-for="(item , index) in accountList" :key="item.id" :label="item.name" :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付类型">
                    <el-select v-model="accountForm.account" disabled>
                        <el-option v-for="(item , index) in accountList" v-if="item.type=='1'" :key="item.id" :label="'银行账户'" :value="index"></el-option>
                        <el-option v-for="(item , index) in accountList" v-if="item.type=='2'" :key="item.id" :label="'微信账户'" :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付金额">
                    <el-input v-model="accountForm.money"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="accountForm.memo"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addAccountForm">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="添加明细" :visible.sync="addCollectState" size="small">
            <el-form label-width="100px" :model="detailForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="品类名称">
                            <el-select v-model="detailForm.category" filterable placeholder="请选择" :loading="categoryLoading" @visible-change="showCategory" @change="goodsTypeDis=false" style="width:100%">
                                <el-option v-for="(item , index) in categoryList" :key="item.pkGlobalId" :label="item.name" :value="item.pkGlobalId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="名称">
                            <el-select v-model="detailForm.goodsType" filterable remote placeholder="请输入关键词" :remote-method="showGoodsType" :loading="goodsTypeLoading" style="width:100%" :disabled="goodsTypeDis">
                                <el-option v-for="item in goodsTypeList" :key="item.pkGlobalId" :label="item.nameFull" :value="item.pkGlobalId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="品牌名称">
                            <el-select v-model="detailForm.goodsType" placeholder="" style="width:100%" disabled>
                                <el-option v-for="item in goodsTypeList" :key="item.pkGlobalId" :label="item.brand.name" :value="item.pkGlobalId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="型号">
                            <el-select v-model="detailForm.goodsType" remote placeholder="" style="width:100%" disabled>
                                <el-option v-for="item in goodsTypeList" :key="item.pkGlobalId" :label="item.name" :value="item.pkGlobalId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="成本价">
                            <el-input-number v-model="detailForm.price" :min="0" :controls="false" style="width:100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数量">
                            <el-input-number v-model="detailForm.number" :min="1" :controls="false" style="width:100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 同行价 -->
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="同行价">
                            <el-input-number v-model="detailForm.samePrice" :min="0" :controls="false" style="width:100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="利润">
                            <el-input v-model="counterpartProfit" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="利润比率%">
                            <!-- <el-input v-model="detailForm.counterpartPercentage"></el-input> -->
                            <el-input-number v-model="detailForm.counterpartPercentage" :min="0" :controls="false" style="width:100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="销售比率%">
                            <el-input v-model="sellCounterpartPercentage" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 客户价 -->
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户价">
                            <el-input-number v-model="detailForm.customerPrice" :min="0" :controls="false" style="width:100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="利润">
                            <el-input v-model="customerProfit" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="利润比率%">
                            <!-- <el-input v-model="detailForm.customerPercentage"></el-input> -->
                            <el-input-number v-model="detailForm.customerPercentage" :min="0" :controls="false" style="width:100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="销售比率%">
                            <el-input v-model="sellCustomerPercentage" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注">
                            <el-input type="textarea" v-model="detailForm.memo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-button type="primary" @click="addDetailForm">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="添加出库单" :visible.sync="addState" size="large">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" v-loading="addLoading">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="销售单" prop="id">
                            <el-col :span="18">
                                <el-input v-model="form.id" disabled></el-input>
                            </el-col>
                            <el-col :span="1">&nbsp;</el-col>
                            <el-col :span="5">
                                <el-popover ref="popover" placement="bottom" width="1200" trigger="click" @show="oddRemoteMethod">
                                    <el-form :inline="true">
                                        <el-form-item><el-input v-model="innerSName" placeholder="销售单号"></el-input></el-form-item>
                                        <el-form-item><el-button icon="search" @click="reInnerData">查询</el-button></el-form-item>
                                    </el-form>
                                    <el-table :data="oddNumList.content" border style="width: 100%;" height="250" v-loading="oddNumLoading">
                                        <el-table-column min-width="100" property="customer.name" label="客户"></el-table-column>
                                        <el-table-column width="100" property="price" label="销售金额"></el-table-column>
                                        <el-table-column property="goodsNumber" label="商品数量"></el-table-column>
                                        <el-table-column property="status" label="订单状态"></el-table-column>
                                        <el-table-column property="paymentStatus" label="付款状态">
                                            <template slot-scope="scope">
                                                <template v-if="oddNumList.content[scope.$index].paymentStatus=='01'">待付款</template>
                                                <template v-if="oddNumList.content[scope.$index].paymentStatus=='02'">已付款</template>
                                            </template>
                                        </el-table-column>
                                        <el-table-column property="operator.name" label="审核人"></el-table-column>
                                        <el-table-column property="check1.name" label="操作员"></el-table-column>
                                        <el-table-column width="180" property="createTime" label="创建日期"></el-table-column>
                                        <el-table-column fixed="right" label="操作" width="70">
                                            <template slot-scope="scope">
                                                <el-button type="text" size="small" @click.native.prevent="selectOdd(scope.$index, oddNumList.content)">选择</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <el-row>
                                        <el-col :span="24" style="overflow:hidden;margin-top:20px">
                                            <el-pagination @current-change="curChange" :current-page.sync="curPage" :page-size="pSize" layout="prev, pager, next, jumper" :total="oddNumList.totalElements" style="float:left"></el-pagination>
                                        </el-col>
                                    </el-row>
                                </el-popover>
                                <el-button class="el-icon-search" v-popover:popover>查找</el-button>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="销售人员" prop="">
                            <el-input v-model="form.operator.name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="销售时间" prop="">
                            <el-input v-model="form.createTime" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="">
                            <el-input v-model="form.memoA"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="商品信息">
                    <el-table :data="purchaseList" border style="width: 100%">
                        <el-table-column width="100" property="goods.categoryName" label="品类名称"></el-table-column>
                        <el-table-column width="100" property="goods.brandName" label="品牌名称"></el-table-column>
                        <el-table-column min-width="100" property="goods.typeName" label="型号名称"></el-table-column>
                        <el-table-column min-width="200" property="goods.name" label="名称"></el-table-column>
                        <el-table-column width="80" property="number" label="数量"></el-table-column>
                        <el-table-column width="90" property="goods.price" label="价格"></el-table-column>
                        <el-table-column width="110" property="goods.rentedStatus" label="借还状态">
                            <template slot-scope="scope">
                                <template v-if="purchaseList[scope.$index].goods.rentedStatus">已借出</template>
                                <template v-else>正常</template>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="add('form')" :disabled="showRented" v-if="isRented==0">保存</el-button>
                    <el-button type="primary" disabled v-else>商品已借出</el-button>
                </el-form-item>
                </el-col>
            </el-form>
        </el-dialog>

        <el-dialog title="查看详情" :visible.sync="showState" size="large">
            <el-form :model="showForm" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="关联单号" prop="">
                            <el-input v-model="showForm.refId" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="关联人员" prop="">
                            <template v-if="showForm.type=='1'"><template v-if="showForm.goodsSale.seller"><el-input v-model="showForm.goodsSale.seller.name" disabled></el-input></template></template>
                            <template v-if="showForm.type=='2'"><template v-if="showForm.purchase.operator"><el-input v-model="showForm.purchase.operator.name" disabled></el-input></template></template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出库时间" prop="">
                            <el-input v-model="showForm.createTime" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="">
                            <el-input v-model="showForm.memo" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-form-item label="商品信息">
                    <el-table :data="purchaseList" border style="width: 100%">
                        <el-table-column width="100" property="goods.categoryName" label="品类名称"></el-table-column>
                        <el-table-column width="100" property="goods.brandName" label="品牌名称"></el-table-column>
                        <el-table-column min-width="100" property="goods.typeName" label="型号名称"></el-table-column>
                        <el-table-column min-width="200" property="goods.name" label="名称"></el-table-column>
                        <el-table-column width="80" property="number" label="数量"></el-table-column>
                        <el-table-column width="90" property="goods.price" label="价格"></el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="showState = false">确定</el-button>
                </el-form-item>
                </el-col>
            </el-form>
        </el-dialog>


    </div>
</template>

<script>
import api from '../../util/api'
import ajax from '../../util/ajax'
export default {
    name: 'goodsoutManagement',
    mixins: [ajax],
    data () {
        return {
            timeSearch: [],
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,

            addState: false,
            addLoading: false,
            form: {
                id: '',
                name: '',
                contact: '',
                tel: '',
                payAccount: '',
                payBank: '',
                payName: '',
                address: '',
                memoA: '',
                operator: {
                    name: ''
                }
            },
            rules: {
                name: [
                    { required: true, message: '请选择寄卖单', trigger: 'blur' }
                ],
            },

            editForm: {
                name: '',
                contact: '',
                tel: '',
                payAccount: '',
                payBank: '',
                payName: '',
                address: '',
                memo: '',
            },
            editRules: {

            },
            editLoading: false,
            editState:false,
            editMemo: '',

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                name: '',
                contact: '',
                tel: '',
                payAccount: '',
                payBank: '',
                payName: '',
                address: '',
                memo: '',
            },
            modifyRules: {
                // name: '',
                // contact: '',
                // tel: '',
                // payAccount: '',
                // payBank: '',
                // payName: '',
                // address: '',
                // memo: '',
            },
            price: '',
            goodsNumber: '',

            categoryList: '',//品类
            categoryLoading: false,

            goodsTypeList: '',//型号
            goodsTypeLoading: false,
            goodsTypeDis: true,

            oddNumList: [],
            oddNumLoading: true,

            collectState: false,
            addCollectState: false,

            detailForm: {
                category: '',
                goodsType: '',
                price: '',
                number: '',
                samePrice: '',
                customerPrice: '',
                memo: '',
                counterpartPercentage: '',//同行价利润提成比
                customerPercentage: '',//客户价利润提成比
            },
            counterpartProfit: '',//同行价利润
            sellCounterpartPercentage: '',//同行销售比率
            customerProfit: '',
            sellCustomerPercentage: '',

            refId: '',

            purchaseList: [],

            showState: false,//查看明细状态
            showForm: {
                name: '',
                contact: '',
                tel: '',
                payAccount: '',
                payBank: '',
                payName: '',
                address: '',
                memo: '',
                operator:{
                    name: ''
                }
            },//查看明细数据

            goodsinState: false,
            goodsinForm: {
                id: '',
                operator: {
                    name: '',
                },
                createTime: '',
            },

            verifyState: false,//审核
            verifyForm: {
                status: '02',
                memo: '',
            },

            payState: false,
            payForm: {
                name: '',
                contact: '',
                tel: '',
                payAccount: '',
                payBank: '',
                payName: '',
                address: '',
                memo: '',
            },
            payRules: {
                name: [
                    { required: true, message: '请选择寄卖单', trigger: 'blur' }
                ],
            },

            payList: [],

            accountList: '',
            accountLoading: true,
            accountForm: {
                account: '',
                memo: '',
                money: '',
            },
            addAccountState: false,

            curPage: 1,
            pSize: 10,
            innerSName: '',
            innerSTel: '',
            isRented: 0,
            showRented: true,

        }
    },
    created(){
        var _vue=this
        this.autoHeight=window.innerHeight-160
        window.onresize=function(){_vue.autoHeight=window.innerHeight-160}

        this.reData()

        this.file = api.file + '/'
    },
    mounted(){

    },
    updated(){
        
    },
    methods:{
        handleCurrentChange(val) {
            this.loading=true
            let _searchData = ''
            if(this.timeSearch[0]){
                _searchData+='&startTime='+this.formatDate(this.timeSearch[0])
                _searchData+='&endTime='+this.formatDate(this.timeSearch[1])
            }
            this.fetchData(api.goodsoutManagement+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            let _searchData = ''
            if(this.timeSearch[0]){
                _searchData+='&startTime='+this.formatDate(this.timeSearch[0])
                _searchData+='&endTime='+this.formatDate(this.timeSearch[1])
            }
            this.fetchData(api.goodsoutManagement+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
                this.$forceUpdate()
            })
        },
        curChange(val) {
            let _searchData = ''
            if(this.innerSName){
                _searchData+='&id='+this.innerSName
            }
            this.fetchData(api.saleManagement+'?status=02&page='+(this.curPage-1)+'&size='+this.pSize+_searchData,'',(data) => {
                this.oddNumList=data
            })
        },
        reInnerData() {
            this.curPage=1
            let _searchData = ''
            if(this.innerSName){
                _searchData+='&id='+this.innerSName
            }
            this.fetchData(api.saleManagement+'?status=02&page='+(this.curPage-1)+'&size='+this.pSize+_searchData,'',(data) => {
                this.oddNumList=data
            })
        },
        add(form) {
            this.form.id=this.form.id.toString()
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.addLoading=true
                    let _p={
                        goodsSale: {
                            id: this.form.id,
                        },
                        memo: this.form.memoA,
                    }
                    this.subForm(api.goodsoutManagement,_p,(data) => {
                        this.addLoading=false
                        this.addState=false
                        this.form={
                            id: '',
                            name: '',
                            contact: '',
                            tel: '',
                            payAccount: '',
                            payBank: '',
                            payName: '',
                            address: '',
                            memoA: '',
                            operator: {
                                name: ''
                            }
                        }
                        this.reData()
                        this.$message({ message: '恭喜你，添加成功', type: 'success' })
                    })
                } else { return false }
            })
        },
        showEdit(index , data){
            this.editId = data[index].id
            this.editMemo = data[index].memo
            console.log(this.editForm)
            if(data[index].supplier){
                this.editForm=data[index].supplier
            }
            this.editState=true
        },
        edit(editForm) {
            this.editForm.id=this.editForm.id.toString()
            this.$refs[editForm].validate((valid) => {
                if (valid) {
                    this.addLoading=true
                    let _p={
                        supplier: {
                            id: this.editForm.id,
                        },
                        id: this.editId,
                        memo: this.editMemo,
                    }
                    this.patchData(api.goodsoutManagement+'/'+this.editId,_p,(data) => {
                        this.editLoading=false
                        this.editState=false
                        this.reData()
                        this.$message({ message: '恭喜你，修改成功', type: 'success' })
                    })
                } else { return false }
            })
        },
        deleteRow(index , data) {
            this.$confirm('确定撤销吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
                this.patchData(api.goodsoutManagement+'/revoked/'+data[index].id,'',(data) => {
                    this.reData()
                    this.$message({ type: 'success', message: '撤销成功!' })
                })
            }).catch(() => { })
        },
        showModify(index , data) {
            this.refId = data[index].id
            this.price = data[index].price
            this.goodsNumber = data[index].goodsNumber
            if(data[index].supplier){
                this.modifyForm=data[index].supplier
            }
            this.modifyForm.memo=data[index].memo
            this.purchaseList=[]
            this.fetchData(api.conf+'?code=同行价利润提成比','',(redata) => {
                this.detailForm.counterpartPercentage=redata.content[0].value || 0
            })
            this.fetchData(api.conf+'?code=客户价利润提成比','',(redata) => {
                this.detailForm.customerPercentage=redata.content[0].value || 0
            })
            this.fetchData(api.purchaseDetail+'?refId='+this.refId,'',(redata) => {
                if(!!redata.content){
                    this.purchaseList = redata.content
                }
            })
            this.modifyState=true
        },
        showDetail(index , data){
            console.log(data[index])
            this.refId = data[index].refId
            this.showForm=data[index]
            this.purchaseList=[]
            this.fetchData(api.saleReportManagement+'?goodsSale.id='+this.refId,'',(redata) => {
                if(!!redata.content){
                    this.purchaseList = redata.content
                }
            })
            this.showState = true
        },
        modify(modifyForm) {
            this.$refs[modifyForm].validate((valid) => {
                if (valid) {
                    this.modifyLoading=true
                    let _p = []
                    for(let i in this.purchaseList){
                        if(!!this.purchaseList[i].deleteState){
                            _p.push(this.purchaseList[i])
                        }
                    }
                    this.subForm(api.purchaseDetail+'/batch_create/'+this.refId,_p,(data) => {
                        this.modifyState=false
                        this.modifyLoading=false
                        this.reData()
                        this.$message({message: '恭喜你，保存成功',type: 'success'})
                    })
                } else { return false }
            })
        },
        oddRemoteMethod() {
            this.fetchData(api.saleManagement+'?status=02','',(data) => {
                this.oddNumList=data
                this.oddNumLoading=false
            })
        },
        selectOdd(index , data){
            if(this.addState){
                this.form=data[index]
            }else if(this.editState){
                this.editForm=data[index]
            }
            this.fetchData(api.saleReportManagement+'?goodsSale.id='+this.form.id,'',(redata) => {
                this.showRented=false
                if(!!redata.content){
                    this.purchaseList = redata.content
                    this.isRented = 0
                    for(let i in redata.content){
                        if(redata.content[i].goods.rentedStatus){
                            this.isRented++
                        }
                    }
                }
            })
        },
        showGoodsType(query){//查找型号
            if (query !== '') {
                this.goodsTypeLoading=true
                this.fetchData(api.goodsType+'/search?keyword='+query+'&categoryId='+this.detailForm.category+'&size=20','',(data) => {
                    this.goodsTypeList=data.content
                    this.goodsTypeLoading=false
                    console.log(data)
                })
            } else {
                this.goodsTypeList = []
            }    
        },
        showCategory(state){//查找品类
            if(state && !this.categoryList){
                this.categoryLoading=true
                this.fetchData(api.goodsCategory,'',(data) => {
                    this.categoryList=data.content
                    this.categoryLoading=false
                    console.log(this.categoryList)
                })
            }else{
                this.categoryLoading=false
            }
        },
        goodsTypeChange(data){
            console.log(data)
        },
        addDetailForm() {//把明细加到表格里面
            let _categoryName , _typeName , _typeNameFull , _brandObj
            for(let i in this.categoryList){
                if(this.categoryList[i].pkGlobalId == this.detailForm.category){
                    _categoryName = this.categoryList[i].name
                }
            }
            for(let j in this.goodsTypeList){
                if(this.goodsTypeList[j].pkGlobalId == this.detailForm.goodsType){
                    _typeName = this.goodsTypeList[j].name
                    _typeNameFull = this.goodsTypeList[j].nameFull
                    _brandObj = this.goodsTypeList[j].brand
                }
            }
            let _p = {
                "refId": this.refId,
                "name": _typeNameFull,
                "categoryId": this.detailForm.category,
                "categoryName": _categoryName,
                "brandId": _brandObj.pkGlobalId,
                "brandName": _brandObj.name,
                "typeId": this.detailForm.goodsType,
                "typeName": _typeName,
                "number": this.detailForm.number,
                "price": this.detailForm.price,
                "samePrice": this.detailForm.samePrice,
                "sameRate": this.sellCounterpartPercentage,
                "customerPrice": this.detailForm.customerPrice,
                "customerRate": this.sellCustomerPercentage,
                "memo": this.detailForm.memo,
                "deleteState":true,
            }
            this.purchaseList.push(_p)
            this.addCollectState=false
        },
        purchaseDelete(index , data) {
            data.splice(index, 1)
        },
        showVerify(index , data){
            this.verifyId=data[index].id
            this.verifyState=true
        },
        subVerify(){
            this.patchData(api.goodsoutManagement+'/check/'+this.verifyId,this.verifyForm,(data) => {
                this.reData()
                this.verifyState=false
                this.$message({ message: '恭喜你，审核成功', type: 'success' })
            })
        },
        showPay(index , data) {
            console.log(data[index])
            this.refId = data[index].id
            this.price = data[index].price
            this.goodsNumber = data[index].goodsNumber
            if(data[index].operator){
                this.payForm=data[index].operator
            }
            this.purchaseList=[]
            this.fetchData(api.purchaseDetail+'?refId='+this.refId,'',(redata) => {
                if(!!redata.content){
                    this.purchaseList = redata.content
                }
            })
            this.payState = true
        },
        showAccount(state){//查找付款账户
            if(state && !this.accountList){
                this.accountLoading=true
                this.fetchData(api.account,'',(data) => {
                    this.accountList=data.content
                    this.accountLoading=false
                    console.log(data)
                })
            }else{
                this.accountLoading=false
            }
        },
        addAccountForm() {//把付款账户加到表格里面
            let _p = {
                'name': this.accountList[this.accountForm.account].name,
                'type': this.accountList[this.accountForm.account].type,
                'money': this.accountForm.money,
                'memo': this.accountForm.memo,
                'id': this.accountList[this.accountForm.account].id,
            }
            this.payList.push(_p)
            console.log(this.payList)
            this.addAccountState=false
        },
        pay(payForm) {
            this.$refs[payForm].validate((valid) => {
                if (valid) {
                    let _arr = []
                    for(let i in this.payList){
                        let _p={
                            "sum":this.payList[i].money,
                            "paymentWay":this.payList[i].type,
                            "memo":this.payList[i].memo,
                            "financeAccount": {
                                "id":this.payList[i].id
                            }
                        }
                        if(!this.payList[i].delete){
                            _arr.push(_p) 
                        }
                    }
                    let _data = {
                        detailList: _arr,
                        memo: this.payForm.memo,
                        sum: this.price
                    }
                    this.subForm(api.goodsoutManagement+'/payment?id='+this.refId,_data,(data) => {
                        this.payState=false
                        this.reData()
                        this.$message({message: '恭喜你，保存成功',type: 'success'})
                    })
                } else { return false }
            })
        },
        showGoodsin(index , data){
            this.refId = data[index].id
            console.log(data[index])
            this.goodsinForm = data[index]
            this.purchaseList=[]
            this.fetchData(api.purchaseDetail+'?refId='+this.refId,'',(redata) => {
                if(!!redata.content){
                    this.purchaseList = redata.content
                }
            })
            this.goodsinState = true
        },
        goodsin(){
            let _arr = []
            for(let i in this.purchaseList){
                _arr.push({
                    purchaseGoodsId:this.purchaseList[i].id,
                    memo:this.purchaseList[i].memo
                })
            }
            let _p = {
                jxcPurchase:{id:this.goodsinForm.id},
                number: this.goodsinForm.goodsNumber,
                price: this.goodsinForm.price,
                memo: this.goodsinForm.memo,
                detailList: _arr,
            }
            this.subForm(api.goodsoutManagement+'/goodsin?id='+this.refId,_p,(data) => {
                this.goodsinState=false
                this.reData()
                this.$message({ message: '恭喜你，入库成功', type: 'success' })
            })
        },
        formatDate(date) {
            var y = date.getFullYear()
            var m = date.getMonth() + 1
            m = m < 10 ? '0' + m : m  
            var d = date.getDate()  
            d = d < 10 ? ('0' + d) : d 
            return y + '-' + m + '-' + d
        },
    },
    watch:{
        detailForm:{
            handler: function (val, oldVal) { 
                this.counterpartProfit = (parseFloat(val.samePrice) - parseFloat(val.price))//同行价利润
                if(parseFloat(val.samePrice) > 0){
                    this.sellCounterpartPercentage = Math.round(((parseFloat(val.samePrice) - parseFloat(val.price)) * parseFloat(this.detailForm.counterpartPercentage) / parseFloat(val.samePrice)) * 10) / 10//同行销售比率
                }else{
                    this.sellCounterpartPercentage = ''
                }
                this.customerProfit = (parseFloat(val.customerPrice) - parseFloat(val.price))//客户价利润
                if(parseFloat(val.customerPrice) > 0){
                    this.sellCustomerPercentage = Math.round(((parseFloat(val.customerPrice) - parseFloat(val.price)) * parseFloat(this.detailForm.customerPercentage) / parseFloat(val.customerPrice)) * 10) / 10//客户销售比率
                }else{
                    this.sellCustomerPercentage = ''
                }
            },
            deep: true
        }
    }
}
</script>