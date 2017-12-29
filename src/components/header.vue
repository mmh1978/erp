<style lang="less" scope>
    @import "../css/color";
    header{
        width: 100%;
        height: 60px;
        overflow: hidden;
        background: @header-bg;
        .logo{
            display: block;
            width:315px;
            height:37px;
            float: left;
            margin: 10px 0 0 10px;
            background:url("../images/logo.png") 0 0 no-repeat;
        }
        .logout{
            display:block;
            height:60px;
            line-height: 60px;
            padding: 0 20px;
            color:#fff;
            float:right;
            text-decoration: none;
        }
        .logout:hover{
            background:@header-btn;
        }
        .user-info{
            float: right;
            color: #fff;
            line-height: 60px;
            margin-right: 10px;
        }
    }
</style>
<template>
<header>
    <router-link to="/home" class="logo"></router-link>
    <a href="javascript:;" @click="logout" class="logout">退出</a>
    <a href="javascript:;" @click="reState = true" class="logout">修改密码</a>
    <div class="user-info">欢迎{{user.name}}</div>
    <el-dialog title="修改密码" :visible.sync="reState" size="tiny" >
        <el-form ref="form" :model="form" label-width="80px" v-loading="formLoading">
            <el-form-item label="新密码">
                <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
                <el-input type="password" v-model="form.verifyPassword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="resetPassword">确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</header>
</template>

<script>
import api from '../util/api'
import ajax from '../util/ajax'
export default {
    name: 'header',
    mixins: [ajax],
    data () {
        return {
            user: '',
            reState: false,
            formLoading: false,
            form: {
                password: '',
                verifyPassword: '',
            }
        }
    },
    created(){
        this.user=JSON.parse(sessionStorage.userRoles)
    },
    mounted(){

    },
    updated(){
        
    },
    methods:{
        logout() {
            this.fetchData(api.logout,'',(data)=>{
                if(data.code=='0'){
                    localStorage.removeItem("token")
                    sessionStorage.removeItem('menu')
                    sessionStorage.removeItem('userRoles')
                    this.$router.push({name: 'login'})
                }
            })
        },
        resetPassword() {
            if(this.form.password==this.form.verifyPassword){
                let _p = {}
                _p.account=this.user.account
                _p.password=this.form.password
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