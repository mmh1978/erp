<style lang="less" scope>
    .id_bg{
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
    }
</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-input v-model="phoneSearch" placeholder="请输入查询手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="realNameSearch" placeholder="请输入真实姓名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="statusSearch" placeholder="请选择">
                            <el-option label="全部" value=""></el-option>
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
                <el-table-column prop="tblUser.nickName" label="昵称" min-width="130"></el-table-column>
                <el-table-column prop="realName" label="真实姓名" min-width="120"></el-table-column>
                <el-table-column prop="phone" label="手机" width="140"></el-table-column>
                <el-table-column prop="idNumber" label="身份证" width="220"></el-table-column>
                <el-table-column prop="status" label="审核状态" width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].status=='2'">
                            <i class="el-icon-check" style="color:#13ce66"></i>
                        </template>
                        <template v-if="dataList.content[scope.$index].status=='1'">
                            待审核
                        </template>
                        <template v-if="dataList.content[scope.$index].status=='3'">
                            <i class="el-icon-minus"></i>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="tblAdmin.name" label="操作人" min-width="100"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作" width="130">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="showModify(scope.$index, dataList.content)">审核</el-button>
                        <el-button type="text" size="small" @click.native.prevent="showIdImg(scope.$index, dataList.content)">查看证件</el-button>
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
        <el-dialog title="查看证件" :visible.sync="cardState" size="small">
            <el-carousel type="card" height="500px" :autoplay="false">
                <el-carousel-item :style="{backgroundImage:'url('+file+cards.idCard+')'}" class="id_bg"></el-carousel-item>
                <el-carousel-item :style="{backgroundImage:'url('+file+cards.idCardHand+')'}" class="id_bg"></el-carousel-item>
                <el-carousel-item :style="{backgroundImage:'url('+file+cards.idCardBack+')'}" class="id_bg"></el-carousel-item>
              </el-carousel>
        </el-dialog>
    </div>
</template>

<script>
import api from '../../../util/api'
import ajax from '../../../util/ajax'
export default {
    name: 'userInfo',
    mixins: [ajax],
    data () {
        return {
            phoneSearch: '',
            realNameSearch: '',
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
                createTime :'',
                updateTime :'',
            },
            modifyRules:{
                
            },
            status: '',
            memo: '',
            cardState: false,
            cards: '',
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
                _searchData+='&phone='+this.phoneSearch
            }
            if(this.realNameSearch){
                _searchData+='&realName='+this.realNameSearch
            }
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            this.fetchData(api.userInfo+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            let _searchData = ''
            if(this.phoneSearch){
                _searchData+='&phone='+this.phoneSearch
            }
            if(this.realNameSearch){
                _searchData+='&realName='+this.realNameSearch
            }
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            this.fetchData(api.userInfo+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        showModify(index , data) {

            this.modifyForm.nickName = data[index].tblUser.nickName || ''
            this.modifyForm.phone = data[index].tblUser.phone || ''
            this.modifyForm.name = data[index].realName || ''
            this.modifyForm.idNumber = data[index].tblUser.idNumber || ''
            this.modifyForm.createTime = data[index].createTime || ''
            this.modifyForm.updateTime = data[index].updateTime || ''
            this.status = data[index].status || ''

            this.modifyForm.pkGlobalId=data[index].pkGlobalId

            this.modifyState=true
        },
        showIdImg(index , data) {
            this.cards=data[index]
            this.cardState=true
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
                    this.patchData(api.userInfo+'/'+this.modifyForm.pkGlobalId,params,(data) => {
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