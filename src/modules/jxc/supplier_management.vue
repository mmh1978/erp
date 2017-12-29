<style lang="less" scope>

</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-button type="primary" @click="addState = true" class="el-icon-plus"> 添加</el-button>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="nameSearch" placeholder="供应商名称"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="telSearch" placeholder="电话号码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="search" @click="reData">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <template>
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="id" label="供应商编号" width="110"></el-table-column>
                <el-table-column prop="name" label="名称" min-width="110"></el-table-column>
                <el-table-column prop="contact" label="联系人" width="80"></el-table-column>
                <el-table-column prop="tel" label="联系电话" width="130"></el-table-column>
                <el-table-column prop="address" label="联系地址" min-width="120"></el-table-column>
                <el-table-column prop="payName" label="收款名" min-width="200"></el-table-column>
                <el-table-column prop="payBank" label="开户银行" min-width="150"></el-table-column>
                <el-table-column prop="payAccount" label="收款账号" width="200"></el-table-column>
                <el-table-column prop="createTime" label="创建日期" width="120"></el-table-column>
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
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contact">
                    <el-input v-model="form.contact"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="tel">
                    <el-input v-model="form.tel"></el-input>
                </el-form-item>
                <el-form-item label="联系地址" prop="address">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="收款名" prop="payName">
                    <el-input v-model="form.payName"></el-input>
                </el-form-item>
                <el-form-item label="开户银行" prop="payBank">
                    <el-input v-model="form.payBank"></el-input>
                </el-form-item>
                <el-form-item label="收款账号" prop="payAccount">
                    <el-input v-model="form.payAccount"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="add('form')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="修改" :visible.sync="modifyState" size="tiny" >
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-width="80px" v-loading="modifyLoading">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="modifyForm.name"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contact">
                    <el-input v-model="modifyForm.contact"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="tel">
                    <el-input v-model="modifyForm.tel"></el-input>
                </el-form-item>
                <el-form-item label="联系地址" prop="address">
                    <el-input v-model="modifyForm.address"></el-input>
                </el-form-item>
                <el-form-item label="收款名" prop="payName">
                    <el-input v-model="modifyForm.payName"></el-input>
                </el-form-item>
                <el-form-item label="开户银行" prop="payBank">
                    <el-input v-model="modifyForm.payBank"></el-input>
                </el-form-item>
                <el-form-item label="收款账号" prop="payAccount">
                    <el-input v-model="modifyForm.payAccount"></el-input>
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
    name: 'jxcSupplier',
    mixins: [ajax],
    data () {
        return {
            nameSearch: '',
            telSearch: '',
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,

            addState: false,
            addLoading: false,
            form: {
                name: '',
                contact: '',
                tel: '',
                address: '',
                payName: '',
                payBank: '',
                payAccount: '',
            },
            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                contact: [
                    { required: true, message: '请输入联系人', trigger: 'blur' }
                ],
                tel: [
                    { required: true, message: '请输入联系方式', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请输入联地址', trigger: 'blur' }
                ],
                payName: [
                    { required: true, message: '请输入收款名', trigger: 'blur' }
                ],
                payBank: [
                    { required: true, message: '请输入开户银行', trigger: 'blur' }
                ],
                payAccount: [
                    { required: true, message: '请输入收款账号', trigger: 'blur' }
                ]
            },

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                name: '',
                contact: '',
                tel: '',
                address: '',
                payName: '',
                payBank: '',
                payAccount: '',
            },
            modifyRules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                contact: [
                    { required: true, message: '请输入联系人', trigger: 'blur' }
                ],
                tel: [
                    { required: true, message: '请输入联系方式', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请输入联地址', trigger: 'blur' }
                ],
                payName: [
                    { required: true, message: '请输入收款名', trigger: 'blur' }
                ],
                payBank: [
                    { required: true, message: '请输入开户银行', trigger: 'blur' }
                ],
                payAccount: [
                    { required: true, message: '请输入收款账号', trigger: 'blur' }
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
            let _searchData = ''
            if(this.nameSearch){
                _searchData+='&name='+this.nameSearch
            }
            if(this.telSearch){
                _searchData+='&tel='+this.telSearch
            }
            this.fetchData(api.supplier+'?page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            let _searchData = ''
            if(this.nameSearch){
                _searchData+='&name='+this.nameSearch
            }
            if(this.telSearch){
                _searchData+='&tel='+this.telSearch
            }
            this.fetchData(api.supplier+'?page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        add(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.addLoading=true
                    this.subForm(api.supplier,this.form,(data) => {
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
                this.deleteData(api.supplier+'/'+data[index].id,'',(data) => {
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
            delete this.modifyForm.createTime
            delete this.modifyForm.updateTime
            this.patchData(api.supplier+'/'+this.modifyForm.id,this.modifyForm,(data) => {
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