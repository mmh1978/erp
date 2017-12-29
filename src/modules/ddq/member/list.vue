<style lang="less" scope>
    .id_bg{
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
    }
    .chat_wrap{
        overflow: hidden;
        .left{
            overflow: hidden;
            .fl{
                float: left;
                max-width: 60%;
                .con{
                    float: left;
                    background: #E5E9F2;
                    padding: 10px;
                    border-radius: 5px;
                    margin: 10px;
                    position: relative;
                    min-width: 14px;
                    word-break: break-all;
                }
                .con:after{
                    content: "";
                    width: 0;
                    height: 0;
                    border-left: 10px solid transparent;
                    border-right: 10px solid transparent;
                    border-bottom: 10px solid #E5E9F2;
                    position: absolute;
                    top: -6px;
                    left: 8px;
                }
                .user_info{
                    color: #20A0FF;
                }
            }
        }
        .right{
            overflow: hidden;
            .fr{
                float: right;
                max-width: 60%;
                text-align: right;
                .con{
                    float: right;
                    background: #E5E9F2;
                    padding: 10px;
                    border-radius: 5px;
                    margin: 10px;
                    position: relative;
                    min-width: 14px;
                    word-break: break-all;
                }
                .con:after{
                    content: "";
                    width: 0;
                    height: 0;
                    border-left: 10px solid transparent;
                    border-right: 10px solid transparent;
                    border-bottom: 10px solid #E5E9F2;
                    position: absolute;
                    top: -6px;
                    right: 8px;
                }
                .user_info{
                    color: #8492A6;
                }
            }
        }
        .user_info{
            span{
                font-size: 12px;
                color: #99A9BF;
            }
        }
    }
</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-input v-model="searchKey" placeholder="请输入查询手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-checkbox label="学员" v-model="student" name="type"></el-checkbox>
                    </el-form-item>
                    <!-- <el-form-item label="">
                        <el-checkbox label="实名" v-model="isAuth" name="type"></el-checkbox>
                    </el-form-item>
                    <el-form-item label="">
                        <el-checkbox label="合约" v-model="contractAuth" name="type"></el-checkbox>
                    </el-form-item> -->
                        <el-select v-model="isFrozen" placeholder="请选择">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="未冻结" value="0"></el-option>
                            <el-option label="限时冻结" value="1"></el-option>
                            <el-option label="永久冻结" value="2"></el-option>
                        </el-select>
                    <el-form-item>
                        <el-button icon="search" @click="reData">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <template>
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="nickName" label="昵称" min-width="130"></el-table-column>
                <el-table-column prop="phone" label="手机" width="140"></el-table-column>
                <el-table-column prop="recommendPhone" label="推荐人" width="140"></el-table-column>
                <el-table-column prop="xxxxx" label="企业" width="140"></el-table-column>
                <el-table-column prop="xxxxx" label="个人" width="140"></el-table-column>
                <!-- <el-table-column prop="orgAuth" label="合约" width="70">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].contractAuth">
                            <i class="el-icon-check" style="color:#13ce66"></i>
                        </template>
                        <template v-else>
                            <i class="el-icon-minus"></i>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="orgAuth" label="同行" width="70">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].orgAuth">
                            <i class="el-icon-check" style="color:#13ce66"></i>
                        </template>
                        <template v-else>
                            <i class="el-icon-minus"></i>
                        </template>
                    </template>
                </el-table-column> -->
                <el-table-column prop="student" label="学员" width="70">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].student=='1'">
                            <i class="el-icon-check" style="color:#13ce66"></i>
                        </template>
                        <template v-else>
                            <i class="el-icon-minus"></i>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="xxxxx" label="是否开店" width="100"></el-table-column>
                <!-- <el-table-column prop="isAuth" label="实名" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].isAuth=='1'">
                            {{dataList.content[scope.$index].realName}}
                        </template>
                        <template v-else>
                            <i class="el-icon-minus"></i>
                        </template>
                    </template>
                </el-table-column> -->
                <el-table-column prop="isFrozen" label="状态" width="80">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].isFrozen=='0'">
                            未冻结
                        </template>
                        <template v-if="dataList.content[scope.$index].isFrozen=='1'">
                            限时冻结
                        </template>
                        <template v-if="dataList.content[scope.$index].isFrozen=='2'">
                            永久冻结
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                <el-table-column prop="lastLoginTime" label="最后登录时间" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作" width="130">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" v-if="userRoles.indexOf('MENU_DDQ_MEMBER_LIST_MODIFY')>=0" @click.native.prevent="showModify(scope.$index, dataList.content)">审核</el-button>
                        <el-button type="text" size="small" @click.native.prevent="showChat(scope.$index, dataList.content)">聊天记录</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>
        <el-dialog title="审核" :visible.sync="modifyState" size="tiny">
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-width="70px" v-loading="modifyLoading">
                <el-form-item label="昵称" prop="nickName">
                    <el-input v-model="modifyForm.nickName"></el-input>
                </el-form-item>
                <el-col :span="8">
                <el-form-item label="学员认证" prop="isStudent">
                    <el-switch on-text="" off-text="" v-model="modifyForm.student"></el-switch>
                </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item label="学号" prop="studentId">
                        <el-input v-model="modifyForm.studentId"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                <!-- <el-form-item label="同行认证" prop="orgAuth">
                    <el-switch on-text="" off-text="" v-model="modifyForm.orgAuth"></el-switch>
                </el-form-item> -->
                <el-form-item label="用户禁用" prop="isFrozen">
                    <el-select v-model="modifyForm.isFrozen" placeholder="请选择" style="width: 100%">
                        <el-option :key="0" :label="'未冻结'" :value="0"></el-option>
                        <el-option :key="1" :label="'限时冻结'" :value="1"></el-option>
                        <el-option :key="2" :label="'永久冻结'" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="禁用时间" prop="disDate">
                    <el-date-picker type="daterange" placeholder="选择日期范围" v-model="modifyForm.disDate" format="yyyy-MM-dd HH时mm分ss秒" style="width:100%"></el-date-picker>
                </el-form-item>
                <el-form-item label="添加备注" prop="memo">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="modifyForm.memo"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="modify('modifyForm')">确定</el-button>
                </el-form-item>
                </el-col>
            </el-form>
        </el-dialog>
        <el-dialog title="聊天记录" :visible.sync="chatState" size="small">
            <div class="chat_wrap">
                <template v-for="item in chatList.content">
                <div class="left" v-if="userId!=item.fromUserId">
                    <div class="fl">
                        <div class="user_info">{{item.fromUserNickname}} <span>{{item.chatTime}}</span></div>
                        <div class="con">{{item.content}}</div>
                    </div>
                </div>
                <div class="right" v-if="userId==item.fromUserId">
                    <div class="fr">
                        <div class="user_info"><span>{{item.chatTime}}</span> {{item.fromUserNickname}}</div>
                        <div class="con">{{item.content}}</div>
                    </div>
                </div>
                </template>
            </div>
            <el-pagination @current-change="chatCurrentChange" :current-page.sync="curChatPage" :page-size="chatPageSize" layout="prev, pager, next, jumper" :total="chatList.totalElements"></el-pagination>
        </el-dialog>
    </div>
</template>
<script>
import api from '../../../util/api'
import ajax from '../../../util/ajax'
export default {
    name: 'member',
    mixins: [ajax],
    data () {
        return {
            userRoles: '',
            searchKey: '',
            student: '',
            isAuth: '',
            contractAuth: '',
            isFrozen: '',
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,
            file: '',
            selectLoading: true,
            salerList: [],
            modifyState: false,
            modifyLoading: false,
            modifyForm:{
                nickName :'',
                student :'',
                studentId :'',
                // orgAuth :'',
                isFrozen :'',
                disDate: [],
                memo :'',
            },
            modifyRules: {
                nickName: [
                    { required: true, message: '请选择会员', trigger: 'blur' }
                ]
            },
            chatState: false,
            chatList :'',
            curChatPage :1,
            chatPageSize :10,
        }
    },
    created(){
        var _vue=this
        this.autoHeight=window.innerHeight-160
        window.onresize=function(){_vue.autoHeight=window.innerHeight-160}
        this.reData()
        this.file = api.file + '/'
        this.userRoles=JSON.parse(sessionStorage.userRoles).rights
        console.log(this.userRoles.indexOf('MENU_DDQ_MEMBER_LIST_MODIFY'))
    },
    mounted(){

    },
    updated(){
        
    },
    methods:{
        handleCurrentChange(val) {
            this.loading=true
            let _searchData = ''
            if(this.searchKey){
                _searchData+='&phone='+this.searchKey
            }
            if(this.student){
                _searchData+='&student='+this.student
            }
            if(this.isAuth!=''){
                _searchData+='&isAuth=1'
            }
            if(this.contractAuth!=''){
                _searchData+='&contractAuth=1'
            }
            if(this.isFrozen){
                _searchData+='&isFrozen='+this.isFrozen
            }
            this.fetchData(api.member+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            let _searchData = ''
            if(this.searchKey){
                _searchData+='&phone='+this.searchKey
            }
            if(this.student){
                _searchData+='&student='+this.student
            }
            if(this.isAuth!=''){
                _searchData+='&isAuth=1'
            }
            if(this.contractAuth!=''){
                _searchData+='&contractAuth=1'
            }
            if(this.isFrozen){
                _searchData+='&isFrozen='+this.isFrozen
            }
            this.fetchData(api.member+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        showModify(index , data) {
            this.modifyForm.nickName = data[index].nickName
            this.modifyForm.student = data[index].student
            this.modifyForm.studentId = data[index].studentId
            // this.modifyForm.orgAuth = data[index].orgAuth
            this.modifyForm.isFrozen = data[index].isFrozen
            if(this.modifyForm.isFrozen=='1'){
                this.modifyForm.disDate[0]= new Date(this.modifyForm.startTime)
                this.modifyForm.disDate[1]= new Date(this.modifyForm.endTime)
            }
            this.modifyForm.memo = data[index].memo
            this.modifyForm.pkGlobalId=data[index].pkGlobalId
            this.modifyState=true
        },
        modify(modifyForm) {
            this.$refs[modifyForm].validate((valid) => {
                if (valid) {
                    this.modifyLoading=true
                    if(this.modifyForm.disDate.length>1){
                        this.modifyForm.frozenStartTime=this.formatDate(this.modifyForm.disDate[0])
                        this.modifyForm.frozenEndTime=this.formatDate(this.modifyForm.disDate[1])
                    }
                    this.patchData(api.member+'/'+this.modifyForm.pkGlobalId,this.modifyForm,(data) => {
                        this.modifyState=false
                        this.modifyLoading=false
                        this.reData()
                        this.$message({message: '恭喜你，保存成功',type: 'success'})
                        this.modifyForm={
                            nickName :'',
                            student :'',
                            studentId :'',
                            // orgAuth :'',
                            isFrozen :'',
                            disDate: [],
                            memo :'',
                        }
                    })
                } else { return false }
            })
        },
        formatDate(now) { 
            let date = now
            let year = date.getFullYear() , month = date.getMonth() + 1 , strDate = date.getDate() , strHours = date.getHours() , strMinutes = date.getMinutes() , strSeconds = date.getSeconds()
            if (month >= 1 && month <= 9) { month = "0" + month }
            if (strDate >= 0 && strDate <= 9) { strDate = "0" + strDate }
            if (strHours >= 0 && strHours <= 9) { strHours = "0" + strHours }
            if (strMinutes >= 0 && strMinutes <= 9) { strMinutes = "0" + strMinutes }
            if (strSeconds >= 0 && strSeconds <= 9) { strSeconds = "0" + strSeconds }
            return year + '-' + month + '-' + strDate + ' ' + strHours + ':' + strMinutes + ':' + strSeconds
        },
        showChat(index , data) {
            this.userId=data[index].pkGlobalId
            this.chatState=true
            this.chatCurrentChange()
        },
        chatCurrentChange(val) {
            this.fetchData(api.member+'/msg?userId='+this.userId+'&page='+(this.curChatPage-1)+'&size='+this.chatPageSize+'&sort=chatTime,asc','',(data) => {
                this.chatList=data
            })
        },
    }
}
</script>