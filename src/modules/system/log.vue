<style lang="less" scope>

</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-date-picker v-model="createTime" type="date" placeholder="选择日期" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="operatorName" placeholder="请选择" clearable>
                            <el-option v-for="item in operatorList" :label="item.name" :value="item.id" :key="item.id"></el-option>
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
                <el-table-column prop="operator.name" label="操作人" width="120"></el-table-column>
                <el-table-column prop="subject" label="类型" width="120"></el-table-column>
                <el-table-column prop="content" label="内容" min-width="120">
                    <template slot-scope="scope">
                        <div v-html="dataList.content[scope.$index].content"></div>
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="操作时间" width="180"></el-table-column>
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
    name: 'systemLog',
    mixins: [ajax],
    data () {
        return {
            autoHeight: '',
            dataList: '',
            currentPage: 0,
            pageSize: 20,
            loading: false,
            createTime: '',
            operatorName: '',
            operatorList: '',
        }
    },
    created(){
        var _vue=this
        this.autoHeight=window.innerHeight-160
        window.onresize=function(){_vue.autoHeight=window.innerHeight-160}
        this.fetchData(api.user+'?page=0&size=99','',(data) => {
            console.log(data)
            this.operatorList=data.content
        })
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
            if(this.createTime){
                _searchData+='&startTime='+this.formatDate(this.createTime)
            }
            if(this.operatorName){
                _searchData+='&operator.id='+this.operatorName
            }
            this.fetchData(api.log+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            let _searchData = ''
            if(this.createTime){
                _searchData+='&startTime='+this.formatDate(this.createTime)
            }
            if(this.operatorName){
                _searchData+='&operator.id='+this.operatorName
            }
            if(this.currentPage==1){
                this.loading=true
                this.fetchData(api.log+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                    this.dataList=data
                    this.loading=false
                })
            }else{
                this.currentPage=1
            }
            
        },
        formatDate(date) {
            var y = date.getFullYear()
            var m = date.getMonth() + 1
            m = m < 10 ? '0' + m : m  
            var d = date.getDate()  
            d = d < 10 ? ('0' + d) : d 
            return y + '-' + m + '-' + d
        }
    }
}
</script>