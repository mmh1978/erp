<style lang="less" scope>

</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-input v-model="idSearch" placeholder="收款单号" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-select v-model="statusSearch" clearable  placeholder="请选择">
                            <el-option label="银行收款" value="0"></el-option>
                            <el-option label="微信收款" value="1"></el-option>
                        </el-select>
                    </el-form-item>  
                    <el-form-item>
                        <el-button icon="search" @click="reData">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <template>
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="id" label="明细编号" width="100"></el-table-column>
                <el-table-column prop="refId" label="收款单编号" width="130"></el-table-column>
                <el-table-column prop="collectItem" label="单据类型" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].collectItem=='09'">销售单</template>
                        <template v-if="dataList.content[scope.$index].collectItem=='12'">采购退货单</template>
                    </template>
                </el-table-column>
                <el-table-column prop="collectWay" label="收款方式" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].collectWay=='0'">
                            银行收款
                        </template>
                        <template v-if="dataList.content[scope.$index].collectWay=='1'">
                            微信收款
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="sum" label="收款金额" width="100"></el-table-column>
                <el-table-column prop="financeAccount.name" label="收款账户" min-width="100"></el-table-column>
                <el-table-column prop="user.name" label="操作员" min-width="100"></el-table-column>
                <el-table-column prop="memo" label="备注" min-width="100"></el-table-column>
                <el-table-column prop="createTime" label="创建日期" width="180"></el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>
    </div>
</template>

<script>
import api from '../../util/api'
import ajax from '../../util/ajax'
export default {
    name: 'collectDetailManagement',
    mixins: [ajax],
    data () {
        return {
            idSearch: '',
            statusSearch: '',
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,
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
            if(this.idSearch){
                _searchData+='&refId='+this.idSearch
            }
            if(this.statusSearch){
                _searchData+='&collectWay='+this.statusSearch
            }
            this.fetchData(api.collectDetailManagement+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            let _searchData = ''
            if(this.idSearch){
                _searchData+='&refId='+this.idSearch
            }
            if(this.statusSearch){
                _searchData+='&collectWay='+this.statusSearch
            }
            this.fetchData(api.collectDetailManagement+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
    }
}
</script>