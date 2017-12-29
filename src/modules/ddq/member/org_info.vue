<style lang="less" scope>

</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-input v-model="phoneSearch" placeholder="请输入查询手机号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="statusSearch" clearable  placeholder="请选择">
                            <el-option label="待审核" value="1"></el-option>
                            <el-option label="已通过" value="2"></el-option>
                            <el-option label="已拒绝" value="3"></el-option>
                        </el-select>
                    </el-form-item>   
                    <el-form-item>
                        <el-button icon="search" @click="reData">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <template>
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="tblUser.nickName" label="昵称" min-width="120"></el-table-column>
                <el-table-column prop="tblUser.phone" label="电话" width="140"></el-table-column>
                <el-table-column prop="type" label="认证类型" width="180">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].type=='0'">
                            公司
                        </template>
                        <template v-if="dataList.content[scope.$index].type=='1'">
                            同行手机
                        </template>
                        <template v-if="dataList.content[scope.$index].type=='2'">
                            微信
                        </template>
                        <template v-if="dataList.content[scope.$index].type=='3'">
                            后台直接初始化
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="data" label="认证信息" min-width="220"></el-table-column>
                <el-table-column prop="status" label="审核状态" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].status=='2'">
                            通过
                        </template>
                        <template v-if="dataList.content[scope.$index].status=='1'">
                            待审核
                        </template>
                        <template v-if="dataList.content[scope.$index].status=='3'">
                            未通过
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="tblAdmin.name" label="审核人" min-width="100"></el-table-column>
                <el-table-column prop="createTime" label="申请时间" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="showModify(scope.$index, dataList.content)">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>
        <el-dialog title="审核" :visible.sync="modifyState" size="small">
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-width="120px" v-loading="modifyLoading">

                <el-col :span="12">
                <el-form-item label="申请人" prop="nickName">
                    <el-input v-model="modifyForm.nickName" disabled></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="modifyForm.phone" disabled></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="真实姓名" prop="name">
                    <el-input v-model="modifyForm.name" disabled></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="身份证号" prop="idNumber">
                    <el-input v-model="modifyForm.idNumber" disabled></el-input>
                </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                <el-form-item label="同行认证方式" prop="data">
                    <el-input v-model="modifyForm.data" disabled></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="认证信息" prop="type">
                    <el-input v-model="modifyForm.type" disabled></el-input>
                </el-form-item>
                </el-col> -->
                <el-col :span="12">
                <el-form-item label="创建时间" prop="createTime">
                    <el-input v-model="modifyForm.createTime" disabled></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="更新时间" prop="updateTime">
                    <el-input v-model="modifyForm.updateTime" disabled></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="审核状态">
                    <el-select v-model="status" placeholder="请选择">
                        <el-option :key="2" :label="'通过'" :value="2"></el-option>
                        <el-option :key="1" :label="'待审核'" :value="1"></el-option>
                        <el-option :key="3" :label="'未通过'" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="24">
                <el-form-item label="添加备注">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="memo"></el-input>
                </el-form-item>
                </el-col>

                <el-col :span="12">
                <el-form-item>
                    <el-button type="primary" @click="modify('modifyForm')">确定</el-button>
                </el-form-item>
                </el-col>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import api from '../../../util/api'
import ajax from '../../../util/ajax'
export default {
    name: 'orgInfo',
    mixins: [ajax],
    data () {
        return {
            phoneSearch: '',
            statusSearch: '',
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,

            file: '',

            selectLoading: true,
            salerList: [],

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                nickName :'',
                phone :'',
                name :'',
                idNumber :'',
                data :'',
                type :'',
                createTime :'',
                updateTime :'',
            },
            status: '',
            memo: '',
            modifyRules: {
                tblUser: [
                    { required: true, message: '请选择会员', trigger: 'blur' }
                ]
            },

            memberLoading: true,
            memberList: [],
            vipTypeList: [],
            appraiser: [],
        }
    },
    created(){
        var _vue=this
        this.autoHeight=window.innerHeight-160
        window.onresize=function(){_vue.autoHeight=window.innerHeight-160}
        this.reData()
        this.file = api.file + '/'
    },
    mounted(){

    },
    updated(){
        
    },
    methods:{
        handleCurrentChange(val) {
            this.loading=true
            let _searchData = ''
            if(this.phoneSearch){
                _searchData+='&tblUser.phone='+this.phoneSearch
            }
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            this.fetchData(api.orgInfo+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            let _searchData = ''
            if(this.phoneSearch){
                _searchData+='&tblUser.phone='+this.phoneSearch
            }
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            this.fetchData(api.orgInfo+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        showModify(index , data) {

            // this.modifyForm.tblUser=data[index].tblUser.pkGlobalId || ''
            
            this.fetchData(api.userInfo+'?tblUser.pkGlobalId='+data[index].tblUser.pkGlobalId,'',(resData) => {
                this.modifyForm.nickName = data[index].tblUser.nickName || ''
                this.modifyForm.phone = data[index].tblUser.phone || ''
                if(resData.content){
                    this.modifyForm.name = resData.content[0].realName || ''
                }
                this.modifyForm.idNumber = data[index].tblUser.idNumber || ''
                this.modifyForm.data = data[index].data|| ''
                if(data[index].type=='0'){
                    this.modifyForm.type = '公司'
                }else if(data[index].type=='1'){
                    this.modifyForm.type = '同行手机'
                }else if(data[index].type=='2'){
                    this.modifyForm.type = '微信'
                }else if(data[index].type=='3'){
                    this.modifyForm.type = '后台直接初始化'
                }else{
                    this.modifyForm.type = '未知'
                }
                this.modifyForm.createTime = data[index].createTime || ''
                this.modifyForm.updateTime = data[index].updateTime || ''
                this.status = data[index].status || ''
            })

            this.modifyForm.pkGlobalId=data[index].pkGlobalId

            this.modifyState=true
        },
        modify(modifyForm) {
            this.$refs[modifyForm].validate((valid) => {
                if (valid) {
                    this.modifyLoading=true
                    
                    console.log(this.status)

                    let params = {
                        'pkGlobalId': this.modifyForm.pkGlobalId,
                        'status': this.status,
                        'memo': this.memo
                    }
                    this.patchData(api.orgInfo+'/'+this.modifyForm.pkGlobalId,params,(data) => {
                        this.modifyState=false
                        this.modifyLoading=false
                        this.reData()
                        this.$message({message: '恭喜你，修改成功',type: 'success'})
                        this.modifyForm={
                            nickName :'',
                            phone :'',
                            name :'',
                            idNumber :'',
                            data :'',
                            type :'',
                            createTime :'',
                            updateTime :'',
                        }
                    })
                } else { return false }
            })
        }
    }
}
</script>