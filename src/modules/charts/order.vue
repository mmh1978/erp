<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-button-group>
                        <el-button @click="reData('month')">按月</el-button>
                        <el-button @click="reData('week')">按周</el-button>
                        <el-button @click="reData('day')">按日</el-button>
                    </el-button-group>
                </el-form>
            </div>
        </div>
        <template>
            <el-table :data="dataList" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="date" label="时间" min-width="120"></el-table-column>
                <el-table-column prop="count" label="订单数" min-width="120"></el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
import api from '../../util/api'
import ajax from '../../util/ajax'
export default {
    name: 'chartsOrder',
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
        this.autoHeight=window.innerHeight-56-60
        window.onresize=function(){_vue.autoHeight=window.innerHeight-56-60}
        this.reData('month')
    },
    mounted(){

    },
    updated(){
        
    },
    methods:{
        reData(date) {
            this.loading=true
            this.fetchData(api.ordersList+'/'+date,'',(data) => {
                this.dataList=data
                this.loading=false
            }) 
        }
    }
}
</script>