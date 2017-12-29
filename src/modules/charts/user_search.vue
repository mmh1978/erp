<template>
    <div class="content">
        <template>
            <el-table :data="dataList" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="type" label="模块" min-width="120">
                    <template slot-scope="scope">
                        <div v-if="dataList[scope.$index].type=='0'">首页</div>
                        <div v-if="dataList[scope.$index].type=='1'">商品</div>
                        <div v-if="dataList[scope.$index].type=='2'">找货</div>
                        <div v-if="dataList[scope.$index].type=='3'">鉴定</div>
                        <div v-if="dataList[scope.$index].type=='4'">新闻</div>
                        <div v-if="dataList[scope.$index].type=='5'">二手价表</div>
                        <div v-if="dataList[scope.$index].type=='6'">第三方数据表</div>
                        <div v-if="dataList[scope.$index].type=='7'">养护</div>
                        <div v-if="dataList[scope.$index].type=='8'">第三方包包</div>
                        <div v-if="dataList[scope.$index].type=='9'">二手价包包</div>
                    </template>
                </el-table-column>
                <el-table-column prop="count" label="搜索量" min-width="120"></el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
import api from '../../util/api'
import ajax from '../../util/ajax'
export default {
    name: 'buyGoods',
    mixins: [ajax],
    data () {
        return {
            autoHeight: '',
            dataList: [],
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
        this.autoHeight=window.innerHeight-60
        window.onresize=function(){_vue.autoHeight=window.innerHeight-60}
        this.reData()
    },
    mounted(){

    },
    updated(){
        
    },
    methods:{
        reData() {
            this.loading=true
            this.fetchData(api.userSearch,'',(data) => {
                this.dataList=data
                this.loading=false
            }) 
        }
    }
}
</script>
