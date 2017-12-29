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
                <el-table-column prop="id" label="编号" width="80"></el-table-column>
                <el-table-column label="角色" min-width="220">
                    <template slot-scope="scope">
                        <template v-for="item in dataList.content[scope.$index].roles">
                            {{item.name}}&nbsp;
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="account" label="账号" min-width="140"></el-table-column>
                <el-table-column prop="name" label="姓名" width="120"></el-table-column>
                <el-table-column label="状态" width="80">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].status=='01'">正常</template>
                        <template v-if="dataList.content[scope.$index].status=='02'">禁用</template>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="电话" width="140"></el-table-column>
                <el-table-column prop="weChat" label="微信号" width="120"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, dataList.content)">移除</el-button>
                        <el-button type="text" size="small" @click.native.prevent="showEdit(scope.$index, dataList.content)">编辑</el-button>
                        <el-button type="text" size="small" @click.native.prevent="showEditPwd(scope.$index, dataList.content)">修改密码</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
             <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>
        <el-dialog title="添加用户" :visible.sync="addConfState" size="tiny">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="formLoading">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="登录账号" prop="account">
                    <el-input v-model="form.account"></el-input>
                </el-form-item>

                <el-form-item label="登录密码" prop="password">
                    <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="form.checkPass" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="角色分配">
                    <el-select v-model="form.checkRoles" multiple placeholder="请选择" style="width:100%">
                        <el-option v-for="item in rolesList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addUser('form')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="修改用户" :visible.sync="putConfState" size="tiny" >
            <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="80px" v-loading="editFormLoading">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="登录账号" prop="account">
                    <el-input v-model="editForm.account"></el-input>
                </el-form-item>
                <el-form-item label="角色分配">
                    <el-select v-model="editForm.checkRoles" multiple placeholder="请选择" style="width:100%">
                        <el-option v-for="item in rolesList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="editForm.phone"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="putUser">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="修改密码" :visible.sync="reState" size="tiny" >
        <el-form ref="form" :model="formPwd" label-width="80px">
            <el-form-item label="新密码">
                <el-input type="password" v-model="formPwd.password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
                <el-input type="password" v-model="formPwd.verifyPassword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="resetPassword">确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    </div>
</template>

<script>
import api from '../../util/api'
import ajax from '../../util/ajax'
export default {
    name: 'systemUser',
    mixins: [ajax],
    data () {
        var validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入姓名'))
            } else {
                callback()
            }
        }
        var validateAccount = (rule, value, callback) => {
            var re=/^[a-zA-Z]\w{3,15}$/,_account
            if (value === '') {
                callback(new Error('请输入账号'))
            } else if (!re.test(value)){
                callback(new Error('账号名不合法'))
            } 
            this.fetchData(api.user+'?account='+value,'',(data) => {
                _account=data.content || []
                if (_account.length>0) {
                    callback(new Error('账号名重复'))
                } else {
                    callback()
                }
            })
        }
        var validateEditAccount = (rule, value, callback) => {
            var re=/^[a-zA-Z]\w{3,15}$/,_account
            if (value === '') {
                callback(new Error('请输入账号'))
            } else if (!re.test(value)){
                callback(new Error('账号名不合法'))
            } 
            this.fetchData(api.user+'?account='+value,'',(data) => {
                _account=data.content
                if (_account.length>0) {
                    if(this.VAccount == _account[0].account){
                        callback()
                    }else{
                        callback(new Error('账号名重复'))
                    }
                } else {
                    callback()
                }
            })
        }
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (this.form.checkPass !== '') {
                    this.$refs.form.validateField('checkPass');
                }
                callback()
            }
        }
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            rolesList: '',
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
                name: '',
                account: '',
                password: '',
                checkPass: '',
                checkRoles: [],
                roles: [],
                phone: ''
            },
            editForm: {
                name: '',
                account: '',
                checkRoles: [],
                roles: [],
                phone: ''
            },
            rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ],
                account: [
                    { validator: validateAccount, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ]
            },
            editRules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ],
                account: [
                    { validator: validateEditAccount, trigger: 'blur' }
                ]
            },
            VAccount: '',
            reState: false,
            account: '',
            formPwd: {
                password: '',
                verifyPassword: '',
            }
        }
    },
    created(){
        var _vue=this
        this.autoHeight=window.innerHeight-160
        window.onresize=function(){_vue.autoHeight=window.innerHeight-160}

        this.fetchData(api.role+'?page=0&size=99999','',(data) => {
            this.rolesList=data.content
        })

        this.reData()
    },
    mounted(){

    },
    updated(){
        
    },
    methods:{
        handleCurrentChange(val) {
            this.loading=true
            this.fetchData(api.user+'?sort=id,desc&page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            this.fetchData(api.user+'?sort=id,desc&page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        addUser(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.formLoading=true
                    for(let j in this.form.checkRoles){
                        this.form.roles[j]={}
                        this.form.roles[j].id=this.form.checkRoles[j]
                    }
                    this.subForm(api.user,this.form,(data) => {
                        this.formLoading=false
                        this.addConfState=false
                        this.form={
                            name: '',
                            account: '',
                            password: '',
                            checkPass: '',
                            checkRoles: [],
                            roles: [],
                            phone: ''
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
                this.deleteData(api.user+'/'+data[index].id,'',(data) => {
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
            this.editForm.checkRoles=[]
            for(let i in data[index]){
                this.editForm[i]=data[index][i]
            }
            for(let j in data[index].roles){
                this.editForm.checkRoles.push(data[index].roles[j].id)
            }
            this.VAccount=data[index].account
            delete this.editForm.password
            this.putConfState=true
        },
        putUser() {
            this.editFormLoading=true
            this.editForm.roles=[]
            for(let j in this.editForm.checkRoles){
                this.editForm.roles[j]={}
                this.editForm.roles[j].id=this.editForm.checkRoles[j]
            }
            console.log(this.editForm)
            this.patchData(api.user+'/'+this.editForm.id,this.editForm,(data) => {
                this.editFormLoading=false
                this.putConfState=false
                this.reData()
                this.$message({
                  message: '恭喜你，修改成功',
                  type: 'success'
                })
            })
        },
        showEditPwd(index , data){
            this.account = data[index].account
            this.reState = true
        },
        resetPassword() {
            if(this.formPwd.password==this.formPwd.verifyPassword){
                let _p = {}
                _p.account=this.account
                _p.password=this.formPwd.password
                this.patchData(api.resetPassword,_p,(data) => {
                    this.formLoading=false
                    this.reState=false
                    this.$message({
                      message: '恭喜你，修改成功',
                      type: 'success'
                    })
                }) 
            }else{
                this.$message({
                  message: '请输入相同的密码',
                  type: 'warning'
                })
            }
        }
    }
}
</script>