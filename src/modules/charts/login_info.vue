<style lang="less" scope>

</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item>
                        <el-input v-model="phone" placeholder="请输入查询手机号"></el-input>
                    </el-form-item>   
                    <el-form-item>
                        <el-button icon="search" @click="reData">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <template>
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="user.nickName" label="用户名" min-width="140"></el-table-column>
                <el-table-column prop="user.phone" label="手机号" width="140"></el-table-column>
                <el-table-column prop="ip" label="IP" width="140"></el-table-column>
                <el-table-column prop="appType" label="系统" width="120"></el-table-column>
                <el-table-column prop="isSuccess" label="用途" width="120">
                    <template slot-scope="scope">
                        <div v-if="dataList.content[scope.$index].isSuccess=='0'">失败</div>
                        <div v-if="dataList.content[scope.$index].isSuccess=='1'">成功</div>
                    </template>
                </el-table-column>
                <el-table-column prop="loginTime" label="登录时间" width="180"></el-table-column>
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
    name: 'loginInfo',
    mixins: [ajax],
    data () {
        return {
            autoHeight: '',
            dataList: '',
            currentPage: 0,
            pageSize: 20,
            loading: false,
            createTime: '',
            phone: '',
        }
    },
    created(){
        var _vue=this
        this.autoHeight=window.innerHeight-160
        window.onresize=function(){_vue.autoHeight=window.innerHeight-160}
    },
    mounted(){
        this.currentPage=1
    },
    updated(){
        
    },
    methods:{
        handleCurrentChange(val) {
            this.loading=true
            let _searchData = ''
            if(this.phone){
                _searchData+='&user.phone='+this.phone
            }
            this.fetchData(api.loginInfo+'?sort=loginTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        reData() {
            let _searchData = ''
            if(this.phone){
                _searchData+='&user.phone='+this.phone
            }
            if(this.currentPage==1){
                this.loading=true
                this.fetchData(api.loginInfo+'?sort=loginTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                    this.dataList=data
                    this.loading=false
                })
            }else{
                this.currentPage=1
            }
            
        }
    }
}
</script>
