<style lang="less" scope>
    .login-container {
    border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
<template>
    <el-form label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h3 class="title">典当圈ERP管理系统</h3>
        <el-form-item prop="account">
            <el-input type="text" auto-complete="off" placeholder="请输入账号" v-model="userName"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
            <el-input type="password" auto-complete="off" placeholder="请输入密码" v-model="userPwd"></el-input>
        </el-form-item>
        <el-checkbox v-model="remember" class="remember">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click="doLogin">登录</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import api from '../util/api'
import ajax from '../util/ajax'
export default {
    name: 'index',
    mixins: [ajax],
    data () {
        return {
            userName:'',
            userPwd:'',
            remember:false,
            state:0
        }
    },
    created(){

    },
    mounted(){

    },
    updated(){
        
    },
    methods:{
        doLogin(){
            if(this.userName==""){
                this.$message({showClose: true,message: '请输入账号',type: 'error'})
                return
            }
            if(this.userPwd==""){
                this.$message({showClose: true,message: '请输入密码',type: 'error'})
                return
            }
            let params = {
                "account":this.userName,
                "password":this.userPwd,
                "remember":this.remember
            }
            this.login(api.login,params,(data)=>{
                if(data.code=='-998'){
                    this.$message.error(data.message)
                }else if(data.code=='0'){
                    localStorage.token=data.data
                    this.fetchData(api.menu,'',(data) => {
                        sessionStorage.menu=JSON.stringify(data)
                        this.state++
                    })
                    this.fetchData(api.current,'',(data) => {
                        sessionStorage.userRoles=JSON.stringify(data)
                        this.state++
                    })

                }else{
                    this.$message.error('登录异常')
                }
            })
        }
    },
    watch:{
        state(v,ov){
            if(v=='2'){
                this.$router.push({name: 'home'})
            } 
        }
    }
}
</script>