<style lang="less" scope>

</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" @click="addState = true" class="el-icon-plus"> 添加</el-button>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="idSearch" placeholder="付款单编号" type="text"></el-input>
                    </el-form-item>  
                    <el-form-item>
                        <el-button icon="search" @click="reData">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <template>
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="id" label="付款单编号" width="120"></el-table-column>
                <el-table-column prop="refId" label="单据编号" width="100"></el-table-column>
                <el-table-column prop="paymentItem" label="单据类型" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].paymentItem=='09'">
                            采购单
                        </template>
                        <template v-if="dataList.content[scope.$index].paymentItem=='11'">
                            寄卖单
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="sum" label="应付金额" width="100"></el-table-column>
                <el-table-column prop="payable" label="已付金额" width="100"></el-table-column>
                <el-table-column prop="user.name" label="操作员" width="100"></el-table-column>
                <el-table-column prop="payStatus" label="状态" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].payStatus=='0'">
                            <i class="el-icon-check" style="color:#13ce66"></i>
                        </template>
                        <template v-else>
                            <i class="el-icon-minus"></i>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="备注" min-width="100"></el-table-column>
                <el-table-column prop="createTime" label="创建日期" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button v-if="dataList.content[scope.$index].payStatus!='0'" type="text" size="small" @click.native.prevent="showModify(scope.$index, dataList.content)">添加明细</el-button>
                    </template>
                </el-table-column>
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
                        <el-form-item label="单号" prop="id">
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
                        <el-form-item label="操作人员" prop="">
                            <el-input v-model="form.goods.operator.name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="创建时间" prop="">
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
                        <el-form-item label="单号" prop="id">
                            <el-input v-model="modifyForm.refId" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="操作人员" prop="">
                            <el-input v-model="modifyForm.user.name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="创建时间" prop="">
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
                                <el-button type="text" v-if="!payList[scope.$index].delete" size="small" @click.native.prevent="collectDelete(scope.$index, payList)">删除</el-button>
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
    name: 'paymentManagement',
    mixins: [ajax],
    data () {
        return {
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
                    { required: true, message: '请选择单号', trigger: 'blur' }
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

            idSearch: '',
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
            this.fetchData(api.paymentManagement+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            let _searchData = ''
            if(this.idSearch){
                _searchData+='&id='+this.idSearch
            }
            this.fetchData(api.paymentManagement+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
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
                    this.subForm(api.paymentManagement,_p,(data) => {
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
            //     this.deleteData(api.paymentManagement+'/'+data[index].id,'',(data) => {
            //         this.reData()
            //         this.$message({ type: 'success', message: '删除成功!' })
            //     })
            // }).catch(() => { })
        },
        showModify(index , data) {
            this.modifyForm=data[index]
            this.payList=[]

            if(data[index].detailList){
                let _arr = data[index].detailList
                for(let i in _arr){
                    let _p = {}
                    _p.name = _arr[i].financeAccount.name
                    _p.type = _arr[i].financeAccount.type
                    _p.money = _arr[i].sum
                    _p.memo = _arr[i].memo
                    _p.delete = true
                    this.payList.push(_p)
                }
            }

            this.modifyState=true
        },
        modify(modifyForm) {
            this.$refs[modifyForm].validate((valid) => {
                if (valid) {
                    
                    let _arr = []
                    for(let i in this.payList){
                        let _p={
                            "refId":this.modifyForm.id,
                            "paymentItem":this.modifyForm.paymentItem,
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

                    this.subForm(api.paymentDetailManagement+'/batchCreate',_arr,(data) => {
                        this.modifyState=false
                        this.modifyLoading=false
                        this.reData()
                        this.$message({message: '恭喜你，添加成功',type: 'success'})
                    })
                } else { return false }
            })
        },
        oddRemoteMethod() {
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
                'id': this.accountList[this.accountForm.account].id,
            }
            this.payList.push(_p)
            console.log(this.payList)
            this.addCollectState=false
        },
        collectDelete(index , data) {
            data.splice(index, 1)
        }
    }
}
</script>