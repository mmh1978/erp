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
                <el-table-column prop="phone" label="手机号" width="140"></el-table-column>
                <el-table-column prop="code" label="验证码" width="120"></el-table-column>
                <el-table-column prop="useage" label="用途" min-width="120">
                    <template slot-scope="scope">
                        <div v-if="dataList.content[scope.$index].useage=='0'">注册</div>
                        <div v-if="dataList.content[scope.$index].useage=='1'">重置登录密码</div>
                        <div v-if="dataList.content[scope.$index].useage=='6'">验证码登录</div>
                        <div v-if="dataList.content[scope.$index].useage=='7'">重置支付密码</div>
                    </template>
                </el-table-column>
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
import api from '../../util/api'
import ajax from '../../util/ajax'
export default {
    name: 'chartsCode',
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
                _searchData+='&phone='+this.phone
            }
            this.fetchData(api.chartsCode+'?page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        reData() {
            let _searchData = ''
            if(this.phone){
                _searchData+='&phone='+this.phone
            }
            if(this.currentPage==1){
                this.loading=true
                this.fetchData(api.chartsCode+'?page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
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
