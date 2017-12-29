<style lang="less" scope>

</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-button type="primary" @click="addState = true" class="el-icon-plus"> 添加</el-button>
            </div>
        </div>
        <template>
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="id" label="退货单号" width="120"></el-table-column>
                <el-table-column prop="refId" label="关联单号" width="120"></el-table-column>
                <el-table-column prop="type" label="退货类型" width="130">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].type=='1'">销售退货</template>
                        <template v-if="dataList.content[scope.$index].type=='2'">采购退货</template>
                        <template v-if="dataList.content[scope.$index].type=='3'">寄卖退货</template>
                    </template>
                </el-table-column>
                <el-table-column prop="check1.name" label="审核人" width="120"></el-table-column>
                <el-table-column prop="type" label="审核状态" width="130">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].auditStatus=='0'">未审核</template>
                        <template v-if="dataList.content[scope.$index].auditStatus=='1'">已同意</template>
                        <template v-if="dataList.content[scope.$index].auditStatus=='2'">已拒绝</template>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="备注" min-width="100"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="showModify(scope.$index, dataList.content)">查看</el-button>
                        <el-button type="text" size="small" @click.native.prevent="showVerify(scope.$index, dataList.content)" v-if="dataList.content[scope.$index].auditStatus=='0'">审核</el-button>
                        <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, dataList.content)" v-if="dataList.content[scope.$index].auditStatus=='0'">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>
        <el-dialog title="添加" :visible.sync="addState" size="large">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="addLoading">
     
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="退货类型">
                            <el-select v-model="type" clearable placeholder="请选择" style="width:100%">
                                <el-option :label="'销售退货'" :value="1"></el-option>
                                <el-option :label="'采购退货'" :value="2"></el-option>
                                <el-option :label="'寄卖退货'" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="退货订单">
                            <el-col :span="18">
                                <el-input v-model="form.refId" disabled></el-input>
                            </el-col>
                            <el-col :span="1">&nbsp;</el-col>
                            <el-col :span="5">
                                <el-popover ref="popover" placement="bottom" width="1200" trigger="click" @show="reInnerData()">
                                    <el-form :inline="true">
                                        <el-form-item><el-input v-model="innerSId" placeholder="订单号"></el-input></el-form-item>
                                        <el-form-item><el-button icon="search" @click="reInnerData">查询</el-button></el-form-item>
                                    </el-form>
                                    <el-table :data="oddNumList.content" border style="width: 100%" v-loading="oddNumLoading" height="400">
                                        <el-table-column prop="id" label="编号" width="120"></el-table-column>
                                        <el-table-column prop="price" label="金额" width="100"></el-table-column>
                                        <el-table-column prop="goodsNumber" label="商品数量" width="100"></el-table-column>
                                        <el-table-column prop="memo" label="备注" min-width="100"></el-table-column>
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
                                <el-button class="el-icon-search" v-popover:popover :disabled="rejectType==''">查找</el-button>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="备注" prop="memo">
                    <el-input v-model="form.memo"></el-input>
                </el-form-item>
                <el-form-item label="退货明细">
                    <el-table :data="purchaseList" border style="width: 100%">
                        <el-table-column min-width="100" property="id" label="产品ID"></el-table-column>
                        <el-table-column width="100" property="categoryName" label="品类名称"></el-table-column>
                        <el-table-column width="100" property="brandName" label="品牌名称"></el-table-column>
                        <el-table-column min-width="180" property="typeName" label="型号名称"></el-table-column>
                        <el-table-column min-width="200" property="name" label="名称"></el-table-column>
                        <el-table-column width="80" property="number" label="数量"></el-table-column>
                        <el-table-column width="120" property="" label="价格">
                            <template slot-scope="scope">
                                <el-input-number v-if="type=='1'" v-model="purchaseList[scope.$index].showPrice" :controls="false" style="width:100%" :min="0"></el-input-number>
                                <el-input-number v-if="type=='2'" v-model="purchaseList[scope.$index].price" :controls="false" style="width:100%" :min="0"></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="180" property="memo" label="备注"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="70">
                            <template slot-scope="scope">
                                <template>
                                    <el-button type="text" size="small" @click.native.prevent="purchaseDelete(scope.$index, purchaseList)">删除</el-button>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="add('form')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="查看" :visible.sync="modifyState" size="large">
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-width="80px" v-loading="modifyLoading">
                    
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="退货类型">
                            <el-select v-model="modifyForm.type" clearable placeholder="请选择" style="width:100%" disabled>
                                <el-option :label="'销售退货'" :value="1"></el-option>
                                <el-option :label="'采购退货'" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="退货订单">
                            <el-col :span="24">
                                <el-input v-model="modifyForm.refId" disabled></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="备注" prop="memo">
                    <el-input v-model="modifyForm.memo" disabled></el-input>
                </el-form-item>
                <el-form-item label="退货明细">
                    <el-table :data="purchaseList" border style="width: 100%">
                        <el-table-column min-width="100" property="id" label="产品ID"></el-table-column>
                        <el-table-column width="100" property="jxcGoods.categoryName" label="品类名称"></el-table-column>
                        <el-table-column width="100" property="jxcGoods.brandName" label="品牌名称"></el-table-column>
                        <el-table-column min-width="180" property="jxcGoods.typeName" label="型号名称"></el-table-column>
                        <el-table-column min-width="200" property="jxcGoods.name" label="名称"></el-table-column>
                        <el-table-column width="80" property="jxcGoods.number" label="数量"></el-table-column>
                        <el-table-column width="120" property="price" label="价格"></el-table-column>
                        <el-table-column min-width="180" property="memo" label="备注"></el-table-column>
                    </el-table>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="modifyState = false">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="审核" :visible.sync="verifyState" size="small">
            <el-form :model="verifyForm" label-width="100px">

                <el-form-item label="审核状态" prop="name">
                    <el-select v-model="verifyForm.auditStatus" placeholder="">
                        <el-option :label="'通过'" :value="'1'"></el-option>
                        <el-option :label="'拒绝'" :value="'2'"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="审核意见" prop="">
                    <el-input type="textarea" v-model="verifyForm.memo" placeholder="请填写审核意见"></el-input>
                </el-form-item>
     
                <el-form-item>
                    <el-button type="primary" @click="subVerify">确定</el-button>
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
    name: 'rejectManagement',
    mixins: [ajax],
    data () {
        return {
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,

            file: '',

            addState: false,
            addLoading: false,
            form: {
                type: '',
                refId: '',
                memo:'',
                detailList: [],
            },
            rules: {
                memberId: [
                    { required: true, message: '请选择会员', trigger: 'blur' }
                ]
            },

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                images: '',
                memberId: '',
                machineGoodsType: '',
                machinePriceType: '',
                memo:'',
            },
            modifyRules: {
                memberId: [
                    { required: true, message: '请选择会员', trigger: 'blur' }
                ]
            },

            oddNumList: '',
            oddNumLoading: '',

            curPage: 1,
            pSize: 10,
            innerSId: '',

            rejectType: '',

            purchaseList: [],

            type: '',

            verifyId: '',
            verifyState: false,//审核
            verifyForm: {
                auditStatus: '1',
                memo: '',
            },

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
            this.fetchData(api.rejectManagement+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.fetchData(api.rejectManagement+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                console.log(data)
                this.loading=false
            })
        },
        curChange(val) {
            let _searchData = ''
            if(this.innerSId){
                _searchData+='&id='+this.innerSId
            }
            if(this.type=='1'){
                //销售退货
                this.fetchData(api.saleManagement+'?page='+(this.curPage-1)+'&size='+this.pSize+_searchData,'',(data) => {
                    this.oddNumList=data
                })
            }else if(this.type=='2'){
                //采购退货
                this.fetchData(api.purchaseManagement+'?postSale=0&page='+(this.curPage-1)+'&size='+this.pSize+_searchData,'',(data) => {
                    this.oddNumList=data
                })
            }else if(this.type=='3'){
                //寄卖退货
                this.fetchData(api.purchaseManagement+'?postSale=1&page='+(this.curPage-1)+'&size='+this.pSize+_searchData,'',(data) => {
                    this.oddNumList=data
                })
            }
        },
        reInnerData() {
            this.curPage=1
            let _searchData = ''
            if(this.innerSId){
                _searchData+='&id='+this.innerSId
            }
            if(this.type=='1'){
                //销售退货
                this.fetchData(api.saleManagement+'?page='+(this.curPage-1)+'&size='+this.pSize+_searchData,'',(data) => {
                    this.oddNumList=data
                })
            }else if(this.type=='2'){
                //采购退货
                this.fetchData(api.purchaseManagement+'?postSale=0&page='+(this.curPage-1)+'&size='+this.pSize+_searchData,'',(data) => {
                    this.oddNumList=data
                })
            }else if(this.type=='3'){
                //寄卖退货
                this.fetchData(api.purchaseManagement+'?postSale=1&page='+(this.curPage-1)+'&size='+this.pSize+_searchData,'',(data) => {
                    this.oddNumList=data
                })
            }
        },
        add(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    // this.addLoading=true
                    this.form.type=this.type
                    if(this.type=='1'){
                        //销售退货
                        for(let i in this.purchaseList){
                            this.form.detailList.push({
                                jxcGoods:{id:this.purchaseList[i].goodsId},
                                detailId:this.purchaseList[i].id,
                                price:this.purchaseList[i].showPrice
                            })
                        }
                    }else if(this.type=='2'){
                        //采购退货
                        for(let i in this.purchaseList){
                            this.form.detailList.push({
                                detailId:this.purchaseList[i].id,
                                price:this.purchaseList[i].price
                            })
                        }
                    }
                    this.subForm(api.rejectManagement,this.form,(data) => {
                        this.addLoading=false
                        this.addState=false
                        this.reData()
                        this.form={
                            type: '',
                            refId: '',
                            memo:'',
                            detailList: [],
                        }
                        this.$message({ message: '恭喜你，添加成功', type: 'success' })
                    })
                } else { return false }
            })
        },
        deleteRow(index , data) {
            this.$confirm('确定删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
                this.deleteData(api.rejectManagement+'/'+data[index].id,'',(data) => {
                    this.reData()
                    this.$message({ type: 'success', message: '删除成功!' })
                })
            }).catch(() => { })
        },
        showModify(index , data) {
            console.log(data[index])
            this.modifyForm=data[index]
            this.fetchData(api.returnDetail+'?refId='+data[index].id,'',(redata) => {
                console.log(redata)
                this.purchaseList=redata
            })
            this.modifyState=true
        },
        modify(modifyForm) {
            this.$refs[modifyForm].validate((valid) => {
                if (valid) {
                    this.modifyLoading=true

                    console.log(this.modifyForm)

                    // this.patchData(api.rejectManagement,this.modifyForm,(data) => {
                    //     this.modifyState=false
                    //     this.modifyLoading=false
                    //     this.reData()
                    //     this.$message({message: '恭喜你，修改成功',type: 'success'})
                    // })
                    
                } else { return false }
            })
        },
        showVerify(index , data){
            this.verifyId=data[index].id
            this.verifyState=true
        },
        subVerify(){
            this.patchData(api.rejectManagement+'/check/'+this.verifyId,this.verifyForm,(data) => {
                this.reData()
                this.verifyState=false
                this.$message({ message: '恭喜你，审核成功', type: 'success' })
            })
        },
        selectOdd(index , data){
            this.form.refId=data[index].id

            if(this.type=='1'){
                //销售退货
                this.fetchData(api.saleReportManagement+'?goodsSale.id='+data[index].id,'',(redata) => {
                    this.purchaseList = []
                    if(!!redata.content){
                        for(let i in redata.content){
                            let _d = {
                                id:redata.content[i].id,
                                number:redata.content[i].number,
                                name:redata.content[i].goods.name,
                                categoryName:redata.content[i].goods.categoryName,
                                brandName:redata.content[i].goods.brandName,
                                typeName:redata.content[i].goods.typeName,
                                price:redata.content[i].goods.price,
                                goodsId:redata.content[i].goods.id,
                                samePrice:redata.content[i].goods.samePrice,
                                customerPrice:redata.content[i].goods.customerPrice,
                                showPrice:redata.content[i].goodsSale.price,
                            }
                            this.purchaseList.push(_d)
                        }
                    }
                })
            }else if(this.type=='2'){
                //采购退货
                this.fetchData(api.purchaseDetail+'?refId='+data[index].id,'',(redata) => {
                    console.log(redata)
                    this.purchaseList = redata.content
                })
            }
            
        },
        purchaseDelete(index , data) {
            data.splice(index, 1)
        },
    },
    watch:{
        type:{
            handler:function(v,ov){
                this.rejectType=v
            },
            deep:true
        }
    }
}
</script>