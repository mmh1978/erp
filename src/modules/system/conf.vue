<style lang="less" scope>

</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-button type="primary" @click="addConfState = true" class="el-icon-plus"> 添加</el-button>
            </div>
        </div>
        <template>
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="code" label="参数名称" min-width="120"></el-table-column>
                <el-table-column prop="value" label="参数值(%)" width="120"></el-table-column>
                <el-table-column prop="memo" label="参数说明" min-width="120"></el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, dataList.content)">移除</el-button>
                        <el-button type="text" size="small" @click.native.prevent="showEdit(scope.$index, dataList.content)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
             <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>
        <el-dialog title="添加系统设置" :visible.sync="addConfState" size="tiny" >
            <el-form ref="form" :model="form" label-width="80px" v-loading="formLoading">
                <el-form-item label="参数名称">
                    <el-input v-model="form.code"></el-input>
                </el-form-item>
                <el-form-item label="参数值(%)">
                    <el-input v-model="form.value"></el-input>
                </el-form-item>
                <el-form-item label="参数说明">
                    <el-input v-model="form.memo"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addConf">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="修改系统设置" :visible.sync="putConfState" size="tiny" >
            <el-form ref="form" :model="editForm" label-width="80px" v-loading="editFormLoading">
                <el-form-item label="参数名称">
                    <el-input v-model="editForm.code"></el-input>
                </el-form-item>
                <el-form-item label="参数值(%)">
                    <el-input v-model="editForm.value"></el-input>
                </el-form-item>
                <el-form-item label="参数说明">
                    <el-input v-model="editForm.memo"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="putConf">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import api from '../../util/api'
import ajax from '../../util/ajax'
export default {
    name: 'systemConf',
    mixins: [ajax],
    data () {
        return {
            autoHeight: '',
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: true,
            formLoading: false,
            editFormLoading: false,
            addConfState: false,
            putConfState: false,
            form: {
                code: '',
                value: '',
                memo: ''
            },
            editForm: {}
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
            this.fetchData(api.conf+'?page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            this.fetchData(api.conf+'?page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        addConf() {
            this.formLoading=true
            this.subForm(api.conf,this.form,(data) => {
                this.formLoading=false
                this.addConfState=false
                for(let i in this.form){
                    this.form[i]=''
                }
                this.reData()
                this.$message({
                  message: '恭喜你，添加成功',
                  type: 'success'
                })
            })
        },
        deleteRow(index , data) {
            this.$confirm('确定删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteData(api.conf+'/'+data[index].id,'',(data) => {
                    this.reData()
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                })
            }).catch(() => {
        
            })
        },
        showEdit(index , data) {
            for(let i in data[index]){
                this.editForm[i]=data[index][i]
            }
            this.putConfState=true
        },
        putConf() {
            this.editFormLoading=true
            this.putData(api.conf+'/'+this.editForm.id,this.editForm,(data) => {
                this.editFormLoading=false
                this.putConfState=false
                this.reData()
                this.$message({
                  message: '恭喜你，修改成功',
                  type: 'success'
                })
            })
        }
    }
}
</script>