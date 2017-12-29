<style lang="less" scope>

</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-select v-model="supplierSearch" clearable placeholder="销售人员" @visible-change="visibleChange" :loading="selectLoading" remote>
                            <el-option v-for="item in oddNumListSearch" :key="item.user.id" :value="item.user.id" :label="item.user.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="idSearch" placeholder="销售单号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="search" @click="reData">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <template>
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="id" label="销售单编号" width="120"></el-table-column>
                <el-table-column prop="goods.name" label="商品名称" min-width="280"></el-table-column>
                <el-table-column prop="goods.brandName" label="品牌" width="100"></el-table-column>
                <el-table-column prop="goods.typeName" label="型号" min-width="200"></el-table-column>
                <el-table-column prop="price" label="销售价" width="100"></el-table-column>
                <el-table-column prop="goods.costPrice" label="同行价" width="100"></el-table-column>
                <el-table-column prop="goods.sameRate" label="同行价销售提成比率" width="180"></el-table-column>
                <el-table-column prop="goods.customerPrice" label="客户价" width="100"></el-table-column>
                <el-table-column prop="goods.customerRate" label="客户价销售提成比率" width="180"></el-table-column>
                <el-table-column prop="number" label="业绩提成" width="100"></el-table-column>
                <el-table-column prop="goodsSale.seller.name" label="销售人" width="180"></el-table-column>
                <el-table-column prop="createTime" label="销售时间" width="180"></el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>
        <el-dialog title="添加付款明细" :visible.sync="addCollectState" size="tiny">
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
        <el-dialog title="添加付款单" :visible.sync="addState" size="large">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" v-loading="addLoading">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="寄卖单号" prop="id">
                            <el-col :span="18">
                                <el-input v-model="form.id" disabled></el-input>
                            </el-col>
                            <el-col :span="1">&nbsp;</el-col>
                            <el-col :span="5">
                                <el-popover ref="popover" placement="bottom" width="1000" trigger="click" @show="oddRemoteMethod">
                                    <el-table :data="oddNumList.content" border style="width: 100%;max-height:500px" v-loading="oddNumLoading">
                                        <el-table-column width="100" property="goods.id" label="商品编号"></el-table-column>
                                        <el-table-column min-width="100" property="goods.categoryName" label="品类"></el-table-column>
                                        <el-table-column min-width="100" property="goods.brandName" label="品牌"></el-table-column>
                                        <el-table-column min-width="100" property="goods.typeName" label="型号"></el-table-column>
                                        <el-table-column min-width="100" property="address" label="名称"></el-table-column>
                                        <el-table-column min-width="100" property="operator.price" label="销售价"></el-table-column>
                                        <el-table-column min-width="100" property="operator.postSale" label="商品来源"></el-table-column>
                                        <el-table-column min-width="100" property="operator.status" label="商品状态"></el-table-column>
                                        <el-table-column fixed="right" label="操作" width="70">
                                            <template slot-scope="scope">
                                                <el-button type="text" size="small" @click.native.prevent="selectOdd(scope.$index, oddNumList.content)">选择</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-popover>
                                <el-button class="el-icon-search" v-popover:popover>查找</el-button>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="寄卖人员" prop="">
                            <el-input v-model="form.goods.operator.name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="寄卖时间" prop="">
                            <el-input v-model="form.createTime" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="总金额" prop="">
                            <el-input v-model="form.goods.costPrice" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="备注" prop="memo">
                            <el-input v-model="form.memo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-form-item label="付款明细" v-if="payList.length>0">
                    <el-table :data="payList" border style="width: 100%">
                        <el-table-column min-width="180" property="name" label="付款账户"></el-table-column>
                        <el-table-column width="100" property="type" label="支付类型">
                            <template slot-scope="scope">
                                <template v-if="payList[scope.$index].type=='1'">
                                    银行账户
                                </template>
                                <template v-if="payList[scope.$index].type=='2'">
                                    微信账户
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column width="100" property="money" label="支付金额"></el-table-column>
                        <el-table-column min-width="100" property="memo" label="备注"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="70">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click.native.prevent="collectDelete(scope.$index, payList)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item> -->
                <el-form-item>
                    <!-- <el-button @click="addCollectState = true">添加付款明细</el-button> -->
                    <el-button type="primary" @click="add('form')">保存</el-button>
                </el-form-item>
                </el-col>
            </el-form>
        </el-dialog>

        <el-dialog title="添加明细" :visible.sync="modifyState" size="large">
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-width="100px" v-loading="modifyLoading">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="寄卖单号" prop="id">
                            <el-input v-model="modifyForm.refId" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="寄卖人员" prop="">
                            <el-input v-model="modifyForm.user.name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="寄卖时间" prop="">
                            <el-input v-model="modifyForm.createTime" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="总金额" prop="">
                            <el-input v-model="modifyForm.sum" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="备注" prop="memo">
                            <el-input v-model="modifyForm.memo" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="付款明细" v-if="payList.length>0">
                    <el-table :data="payList" border style="width: 100%">
                        <el-table-column min-width="180" property="name" label="付款账户"></el-table-column>
                        <el-table-column width="100" property="type" label="支付类型">
                            <template slot-scope="scope">
                                <template v-if="payList[scope.$index].type=='1'">
                                    银行账户
                                </template>
                                <template v-if="payList[scope.$index].type=='2'">
                                    微信账户
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column width="100" property="money" label="支付金额"></el-table-column>
                        <el-table-column min-width="100" property="memo" label="备注"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="70">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click.native.prevent="collectDelete(scope.$index, payList)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item>
                    <el-button @click="addCollectState = true">添加付款明细</el-button>
                    <el-button type="primary" @click="modify('modifyForm')">保存</el-button>
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
    name: 'saleReportManagement',
    mixins: [ajax],
    data () {
        return {
            supplierSearch: '',
            idSearch: '',
            oddNumListSearch: '',
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,

            addState: false,
            addLoading: false,
            form: {
                goods: {
                    operator: {
                        name: ''
                    }
                },
                id: '',
            },
            rules: {
                id: [
                    { required: true, message: '请选择寄卖单', trigger: 'blur' }
                ],
            },

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                user: {
                    name: ''
                },
                id: '',
            },
            modifyRules: {
                name: [
                    { required: true, message: '请填写手机号码', trigger: 'blur' }
                ]
            },

            oddNumList: [],
            oddNumLoading: true,

            collectState: false,
            addCollectState: false,

            accountList: '',
            accountLoading: true,
            accountForm: {
                account: '',
                memo: '',
                money: '',
            },

            payList: [],

            selectLoading: false,
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
            if(this.supplierSearch){
                _searchData+='&goodsSale.seller.id='+this.supplierSearch
            }
            if(this.idSearch){
                _searchData+='&id='+this.idSearch
            }
            this.fetchData(api.saleReportManagement+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            let _searchData = ''
            if(this.supplierSearch){
                _searchData+='&goodsSale.seller.id='+this.supplierSearch
            }
            if(this.idSearch){
                _searchData+='&id='+this.idSearch
            }
            this.fetchData(api.saleReportManagement+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        add(form) {
            this.form.id=this.form.id.toString()
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.addLoading=true
                    let _p={
                        "refId": this.form.id,
                        "paymentItem":"11",
                        "memo":this.form.memo,
                        "sum": this.form.goods.costPrice
                    }
                    this.subForm(api.saleReportManagement,_p,(data) => {
                        this.addLoading=false
                        this.addState=false
                        this.reData()
                        this.$message({ message: '恭喜你，添加成功', type: 'success' })
                    })
                } else { return false }
            })
        },
        deleteRow(index , data) {
            // this.$confirm('确定删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            //     this.deleteData(api.saleReportManagement+'/'+data[index].id,'',(data) => {
            //         this.reData()
            //         this.$message({ type: 'success', message: '删除成功!' })
            //     })
            // }).catch(() => { })
        },
        showModify(index , data) {
            this.modifyForm=data[index]
            this.modifyState=true
        },
        modify(modifyForm) {
            this.$refs[modifyForm].validate((valid) => {
                if (valid) {
                    this.modifyLoading=true
                    
                    let _p={
                        "refId":77,
                        "paymentItem":"09",
                        "sum":1000,
                        "paymentWay":"01",
                        "financeAccount":7,
                    }

                    // this.patchData(api.goodsinManagement+'/'+this.modifyForm.id,this.modifyForm,(data) => {
                    //     this.modifyState=false
                    //     this.modifyLoading=false
                    //     this.reData()
                    //     this.$message({message: '恭喜你，添加成功',type: 'success'})
                    // })
                } else { return false }
            })
        },
        oddRemoteMethod() {
            // jmList
            this.fetchData(api.jmList,'',(data) => {
                this.oddNumList=data
                this.oddNumLoading=false
                console.log(data)
            })
        },
        selectOdd(index , data){
            this.form=data[index]
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
            }
            this.payList.push(_p)
            this.addCollectState=false
        },
        collectDelete(index , data) {
            data.splice(index, 1)
        },
        visibleChange(data) {
            this.selectLoading = true
            if(data){
                this.fetchData(api.user+'/sale','',(data) => {
                    console.log(data)
                    this.oddNumListSearch=data
                    this.selectLoading=false
                })
            }
        },
    }
}
</script>