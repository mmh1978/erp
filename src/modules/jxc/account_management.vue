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
                <el-table-column prop="id" label="账户编号" width="100"></el-table-column>
                <el-table-column prop="name" label="账户名称" min-width="120"></el-table-column>
                <el-table-column label="账户类型" width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].type=='1'">银行账户</template>
                        <template v-if="dataList.content[scope.$index].type=='2'">微信账户</template>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="备注" min-width="120"></el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, dataList.content)">移除</el-button>
                        <el-button type="text" size="small" @click.native.prevent="showModify(scope.$index, dataList.content)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>
        <el-dialog title="添加" :visible.sync="addState" size="tiny">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="addLoading">
                <el-form-item label="账户名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="账户类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option label="银行账户" value="1"></el-option>
                        <el-option label="微信账户" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="memo">
                    <el-input v-model="form.memo"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="add('form')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="修改" :visible.sync="modifyState" size="tiny" >
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-width="80px" v-loading="modifyLoading">
                <el-form-item label="账户名称" prop="name">
                    <el-input v-model="modifyForm.name"></el-input>
                </el-form-item>
                <el-form-item label="账户类型" prop="type">
                    <el-select v-model="modifyForm.type" placeholder="请选择">
                        <el-option label="银行账户" :value="1"></el-option>
                        <el-option label="微信账户" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="memo">
                    <el-input v-model="modifyForm.memo"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="modify">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import api from '../../util/api'
import ajax from '../../util/ajax'
export default {
    name: 'accountManagement',
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
                name: '',
                type: '',
                memo: '',
            },
            rules: {
                name: [
                    { required: true, message: '请输入账户名称', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择账户类型', trigger: 'blur' }
                ]
            },

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                name: '',
                type: '',
                memo: '',
            },
            modifyRules: {
                name: [
                    { required: true, message: '请输入账户名称', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择账户类型', trigger: 'blur' }
                ]
            },
            
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
            this.fetchData(api.account+'?page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            this.fetchData(api.account+'?page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        add(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    console.log(this.form)
                    this.addLoading=true
                    this.subForm(api.account+'/',this.form,(data) => {
                        this.addLoading=false
                        this.addState=false
                        for(let i in this.form){
                            this.form[i]=''
                        }
                        this.reData()
                        this.$message({
                          message: '恭喜你，添加成功',
                          type: 'success'
                        })
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        deleteRow(index , data) {
            this.$confirm('确定删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteData(api.account+'/'+data[index].id,'',(data) => {
                    this.reData()
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                })
            }).catch(() => {
        
            })
        },
        showModify(index , data) {
            for(let i in data[index]){
                this.modifyForm[i]=data[index][i]
            }
            this.modifyState=true
        },
        modify() {
            this.modifyLoading=true
            this.patchData(api.account+'/'+this.modifyForm.id,this.modifyForm,(data) => {
                this.modifyState=false
                this.modifyLoading=false
                this.reData()
                this.$message({
                    message: '恭喜你，修改成功',
                    type: 'success'
                })
                for(let i in this.modifyForm){
                    this.modifyForm[i]=''
                }
            })
        }
    }
}
</script>