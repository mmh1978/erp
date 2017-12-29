<style lang="less" scope>

</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-input v-model="phoneSearch" placeholder="手机号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="statusSearch" clearable placeholder="养护状态">
                            <el-option :value="0" :label="'未付款'"></el-option>
                            <el-option :value="1" :label="'买家待发货'"></el-option>
                            <el-option :value="2" :label="'平台待收货'"></el-option>
                            <el-option :value="3" :label="'平台已收货'"></el-option>
                            <el-option :value="4" :label="'平台养护中'"></el-option>
                            <el-option :value="5" :label="'平台已发货'"></el-option>
                            <el-option :value="6" :label="'已完成'"></el-option>
                            <el-option :value="7" :label="'平台已退货'"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="search" @click="reData">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <template>
            <el-table :data="dataList.content" border style="width:100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="name" label="商品名称" min-width="140"></el-table-column>
                <el-table-column prop="price" label="价格" width="120"></el-table-column>
                <el-table-column label="养护类型" width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].type=='0'">定制翻新</template>
                        <template v-if="dataList.content[scope.$index].type=='1'">清洗保养</template>
                        <template v-if="dataList.content[scope.$index].type=='2'">专业修复</template>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="养护状态" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].status=='0'">未付款</template>
                        <template v-if="dataList.content[scope.$index].status=='1'">买家待发货</template>
                        <template v-if="dataList.content[scope.$index].status=='2'">平台待收货</template>
                        <template v-if="dataList.content[scope.$index].status=='3'">平台已收货</template>
                        <template v-if="dataList.content[scope.$index].status=='4'">平台养护中</template>
                        <template v-if="dataList.content[scope.$index].status=='5'">平台已发货</template>
                        <template v-if="dataList.content[scope.$index].status=='6'">已完成</template>
                        <template v-if="dataList.content[scope.$index].status=='7'">平台已退货</template>
                    </template>
                </el-table-column>
                <el-table-column prop="tblUser.nickName" label="用户" width="180"></el-table-column>
                <el-table-column prop="tblUser.phone" label="手机号" width="130"></el-table-column>
                <el-table-column prop="order" label="订单号" width="220"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>
    </div>
</template>

<script>
import api from '../../../util/api'
import ajax from '../../../util/ajax'
export default {
    name: 'maintenList',
    mixins: [ajax],
    data () {
        return {
            phoneSearch: '',
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
    },
    mounted(){

    },
    updated(){
        
    },
    methods:{
        handleCurrentChange(val) {
            this.loading=true
            let _searchData = ''
            if(this.phoneSearch){
                _searchData+='&tblUser.phone='+this.phoneSearch
            }
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            this.fetchData(api.maintenList+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            let _searchData = ''
            if(this.phoneSearch){
                _searchData+='&tblUser.phone='+this.phoneSearch
            }
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            this.fetchData(api.maintenList+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
    }
}
</script>