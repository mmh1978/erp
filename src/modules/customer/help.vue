<style lang="less" scope>
    .quill-editor {
        .ql-container {
            height: 380px;
        }
    }
</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-button type="primary" @click="addState = true" class="el-icon-plus"> 添加</el-button>
            </div>
        </div>
        <template>
            <el-collapse :style="{height:autoHeight+'px',overflow:'auto'}">
                <el-collapse-item v-for="item in dataList.content" :key="item.id" :title="item.label" :name="item.id">
                    <div v-html="item.content"></div>
                    <el-button-group>
                        <el-button icon="edit" @click="showModify(item)"></el-button>
                        <el-button icon="delete" @click="deleteRow(item)"></el-button>
                    </el-button-group>
                </el-collapse-item>
            </el-collapse>
        </template>
        <div class="bottom-bar">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>
        <el-dialog title="添加帮助" :visible.sync="addState" size="large">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="addLoading">
                <el-form-item label="标题" prop="label">
                    <el-input v-model="form.label"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="showOrder">
                    <el-input v-model="form.showOrder"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <quill-editor v-model="form.content"></quill-editor>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="add('form')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="修改帮助" :visible.sync="modifyState" size="large" >
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-width="80px" v-loading="modifyLoading">
                <el-form-item label="标题" prop="label">
                    <el-input v-model="modifyForm.label"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="showOrder">
                    <el-input v-model="modifyForm.showOrder"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <quill-editor v-model="modifyForm.content"></quill-editor>
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
    name: 'customerHelp',
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
                label: '',
                showOrder: '',
                content: '',
            },
            rules: {
                label: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ]
            },

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                label: '',
                showOrder: '',
                content: '',
            },
            modifyRules: {
                label: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
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
            this.fetchData(api.help+'?page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            this.fetchData(api.help+'?page='+(this.currentPage-1)+'&size='+this.pageSize+'&sort=showOrder,asc','',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        add(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.addLoading=true
                    this.subForm(api.help,this.form,(data) => {
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
        deleteRow(item) {
            this.$confirm('确定删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteData(api.help+'/'+item.id,'',(data) => {
                    this.reData()
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                })
            }).catch(() => {
        
            })
        },
        showModify(item) {
            this.modifyForm=item
            this.modifyState=true
        },
        modify() {
            this.modifyLoading=true
            this.patchData(api.help+'/'+this.modifyForm.id,this.modifyForm,(data) => {
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