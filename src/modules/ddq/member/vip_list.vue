<style lang="less" scope>

</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" @click="addState = true" class="el-icon-plus"> 添加</el-button>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="phoneSearch" placeholder="请输入查询手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="nameSearch" placeholder="请输入查询姓名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="typeSearch" clearable placeholder="请选择类型" @visible-change="visibleChange" :loading="selectLoading" remote>
                            <el-option v-for="item in vipTypeList" :key="item.pkGlobalId" :value="item.type" :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="statusSearch" clearable placeholder="请选择是否有效">
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="过期" value="0"></el-option>
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
                <el-table-column prop="tblUser.nickName" label="用户" min-width="120"></el-table-column>
                <el-table-column prop="tblUser.phone" label="手机号" width="140"></el-table-column>
                <el-table-column prop="vipDetail.name" label="会员类型" min-width="100"></el-table-column>
                <el-table-column prop="failureDate" label="失效时间" width="180"></el-table-column>
                <el-table-column prop="days" label="剩余天数" width="100"></el-table-column>
                <el-table-column prop="status" label="有效状态" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].status=='0' || dataList.content[scope.$index].status=='1'">
                            <template v-if="dataList.content[scope.$index].status=='1'">
                                <i class="el-icon-check" style="color:#13ce66"></i>
                            </template>
                            <template v-if="dataList.content[scope.$index].status=='0'">
                                <i class="el-icon-minus"></i>
                            </template>
                        </template>
                        <template v-else>
                            未知
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="canIdentify" label="鉴定" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].canIdentify=='1'">
                            <i class="el-icon-check" style="color:#13ce66"></i>
                        </template>
                        <template v-else>
                            <i class="el-icon-minus"></i>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="canQueryPrice" label="查价" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].canQueryPrice=='1'">
                            <i class="el-icon-check" style="color:#13ce66"></i>
                        </template>
                        <template v-else>
                            <i class="el-icon-minus"></i>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
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
        <el-dialog title="添加" :visible.sync="addState" size="small">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px" v-loading="addLoading">
                <el-col :span="24">
                <el-form-item label="选择会员" prop="tblUser">
                    <el-select v-model="form.tblUser" filterable remote placeholder="请输入关键词搜索" :remote-method="remoteMethod" :loading="memberLoading" style="width:100%">
                        <el-option v-for="item in memberList" :key="item.pkGlobalId" :value="item.pkGlobalId" :label="item.nickName+' : '+item.phone"></el-option>
                    </el-select>
                </el-form-item> 
                </el-col>
                <el-col :span="12">
                <el-form-item label="会员类型" prop="vipDetail">
                    <el-select v-model="form.vipDetail" placeholder="请选择" @visible-change="visibleChange" :loading="selectLoading" remote>
                        <el-option v-for="item in vipTypeList" :key="item.pkGlobalId" :value="item.type" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="失效截止日期">
                    <el-date-picker v-model="form.failureDate" type="date" placeholder="选择日期" style="width:100%"></el-date-picker>
                </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="">
                        <el-checkbox label="鉴定" v-model="form.canIdentify"></el-checkbox>
                        <el-checkbox label="价格" v-model="form.canQueryPrice"></el-checkbox>
                        <el-checkbox label="无效" v-model="form.status"></el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item>
                    <el-button type="primary" @click="add('form')">确定</el-button>
                </el-form-item>
                </el-col>
            </el-form>
        </el-dialog>
        <el-dialog title="修改" :visible.sync="modifyState" size="small">
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-width="120px" v-loading="modifyLoading">
                <el-col :span="24">
                <el-form-item label="选择会员" prop="tblUser">
                    <el-select v-model="modifyForm.tblUser" filterable remote placeholder="请输入关键词搜索" :remote-method="remoteMethod" :loading="memberLoading" style="width:100%">
                        <el-option v-for="item in memberList" :key="item.pkGlobalId" :value="item.pkGlobalId" :label="item.nickName+' : '+item.phone"></el-option>
                    </el-select>
                </el-form-item> 
                </el-col>
                <el-col :span="12">
                <el-form-item label="会员类型" prop="vipDetail">
                    <el-select v-model="modifyForm.type" placeholder="请选择" @visible-change="visibleChange" :loading="selectLoading" remote>
                        <el-option v-for="item in vipTypeList" :key="item.pkGlobalId" :value="item.type" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="失效截止日期">
                    <el-date-picker v-model="modifyForm.failureDate" type="date" placeholder="选择日期" style="width:100%"></el-date-picker>
                </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="">
                        <el-checkbox label="鉴定" v-model="modifyForm.canIdentify"></el-checkbox>
                        <el-checkbox label="价格" v-model="modifyForm.canQueryPrice"></el-checkbox>
                        <el-checkbox label="无效" v-model="modifyForm.status"></el-checkbox>
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
    name: 'vipList',
    mixins: [ajax],
    data () {
        return {
            phoneSearch: '',
            nameSearch: '',
            typeSearch: '',
            statusSearch: '',
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,
            file: '',
            addState: false,
            addLoading: false,
            form: {
                tblUser :'',
                vipDetail :'',
                failureDate :'',
                status :false,
                canIdentify :false,
                canQueryPrice :false,
                canEntityIdentify :true,
                type:'',
            },
            rules: {
                tblUser: [
                    { required: true, message: '请选择会员', trigger: 'blur' }
                ]
            },
            selectLoading: true,
            salerList: [],
            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                tblUser :'',
                vipDetail :'',
                failureDate :'',
                status :false,
                canIdentify :false,
                canQueryPrice :false,
                canEntityIdentify :true,
                type:'',
            },
            modifyRules: {
                tblUser: [
                    { required: true, message: '请选择会员', trigger: 'blur' }
                ]
            },
            memberLoading: true,
            memberList: [],
            vipTypeList: [],
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
            this.fetchData(api.vipList+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
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
            if(this.nameSearch){
                _searchData+='&tblUser.realName='+this.nameSearch
            }
            if(this.typeSearch){
                _searchData+='&type='+this.typeSearch
            }
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            this.fetchData(api.vipList+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        add(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    // this.addLoading=true

                    let _id = this.form.tblUser
                    delete this.form.tblUser
                    this.form.tblUser={ 'pkGlobalId':_id }
                    let _vipDetail = this.form.vipDetail
                    delete this.form.vipDetail
                    this.form.type=_vipDetail
                    let _failureDate=this.formatDate(this.form.failureDate) + ' 00:00:00'
                    delete this.form.failureDate
                    this.form.failureDate=_failureDate
                    this.subForm(api.vipList,this.form,(data) => {
                        this.addLoading=false
                        this.addState=false
                        for(let i in this.form){ this.form[i]='' }
                        this.reData()
                        this.$message({ message: '恭喜你，添加成功', type: 'success' })
                        this.form={
                            tblUser :'',
                            vipDetail :'',
                            failureDate :'',
                            status :false,
                            canIdentify :false,
                            canQueryPrice :false,
                            canEntityIdentify :true,
                        }
                    })
                } else { return false }
            })
        },
        deleteRow(index , data) {
            this.$confirm('确定删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
                this.deleteData(api.vipList+'/'+data[index].pkGlobalId,'',(data) => {
                    this.reData()
                    this.$message({ type: 'success', message: '删除成功!' })
                })
            }).catch(() => { })
        },
        showModify(index , data) {
            this.memberList=[]
            this.vipTypeList=[]
            console.log(data[index])
            this.memberList.push(data[index].tblUser)
            this.vipTypeList.push(data[index].vipDetail)
            this.modifyForm.tblUser=data[index].tblUser.pkGlobalId || ''
            this.modifyForm.vipDetail=data[index].vipDetail.pkGlobalId || ''
            this.modifyForm.failureDate=new Date (data[index].failureDate) || ''
            this.modifyForm.status=data[index].status || ''
            this.modifyForm.canIdentify=data[index].canIdentify || ''
            this.modifyForm.canQueryPrice=data[index].canQueryPrice || ''
            this.modifyForm.canEntityIdentify=data[index].canEntityIdentify || ''
            this.modifyForm.pkGlobalId=data[index].pkGlobalId
            this.modifyForm.type=data[index].type
            this.modifyState=true
        },
        modify(modifyForm) {
            this.$refs[modifyForm].validate((valid) => {
                if (valid) {
                    this.modifyLoading=true
                    let _id = this.modifyForm.tblUser
                    delete this.modifyForm.tblUser
                    this.modifyForm.tblUser={ 'pkGlobalId':_id }
                    // let _vipDetail = this.modifyForm.vipDetail
                    delete this.modifyForm.vipDetail
                    // this.modifyForm.vipDetail={ 'pkGlobalId':_vipDetail }
                    let _failureDate=this.formatDate(this.modifyForm.failureDate) + ' 00:00:00'
                    delete this.modifyForm.failureDate
                    this.modifyForm.failureDate=_failureDate
                    this.patchData(api.vipList+'/'+this.modifyForm.pkGlobalId,this.modifyForm,(data) => {
                        this.modifyState=false
                        this.modifyLoading=false
                        this.reData()
                        this.$message({message: '恭喜你，修改成功',type: 'success'})
                        this.modifyForm={
                            tblUser :'',
                            vipDetail :'',
                            failureDate :'',
                            status :false,
                            canIdentify :false,
                            canQueryPrice :false,
                            canEntityIdentify :true,
                        }
                    })
                } else { return false }
            })
        },
        deleteFile(){
            if(this.deleteImgList.length>0){
                let _id = this.deleteImgList.pop()
                this.deleteData(api.file+'/'+_id,'',(data) => {
                    this.deleteFile()
                })
            }
        },
        remoteMethod(query) {
            if (query !== '') {
                this.memberLoading = true
                this.fetchData(api.member+'/search?keyword='+query,'',(data) => {
                    this.memberList=data
                    this.memberLoading=false
                })
            } else {
                this.memberList = []
            }
        },
        visibleChange(data) {
            this.selectLoading = true
            if(data){
                this.fetchData(api.vipType+'?page=0&size=9999','',(data) => {
                    this.vipTypeList=data.content
                    this.selectLoading=false
                    console.log(data)
                })
            }
        },
        handleRemove(file, fileList) {
            if(this.addState){
                this.deleteData(api.file+'/'+file.response.UPLOAD_FILE_ID[0],'',(data) => {

                })
                if(this.imgList.indexOf(file.response.UPLOAD_FILE_ID[0])>=0){
                    let _index = this.imgList.indexOf(file.response.UPLOAD_FILE_ID[0])
                    this.imgList.splice(_index,1)
                }
            }else if (this.modifyState){
                if(file.response){//如果修改时删除的是刚上传的图片
                    this.deleteData(api.file+'/'+file.response.UPLOAD_FILE_ID[0],'',(data) => {})
                    if(this.modifyImgId.indexOf(file.response.UPLOAD_FILE_ID[0])>=0){
                        let _index = this.modifyImgId.indexOf(file.response.UPLOAD_FILE_ID[0])
                        this.modifyImgId.splice(_index,1)
                    }
                }else{//否则删除的就是回填数据的图片
                    this.deleteImgList.push(file.name)
                    let _index = this.modifyImgId.indexOf(file.name)
                    this.modifyImgId.splice(_index,1)
                }
            }
        },
        imgListSuccess(res, flie){
            if(this.addState){
                this.imgList.push(res.UPLOAD_FILE_ID[0])
            }else if (this.modifyState){
                this.modifyImgId.push(res.UPLOAD_FILE_ID[0])
            }
        },
        formatDate(now) { 
            let date = now
            let year = date.getFullYear() , month = date.getMonth() + 1 , strDate = date.getDate()
            if (month >= 1 && month <= 9) { month = "0" + month }
            if (strDate >= 0 && strDate <= 9) { strDate = "0" + strDate }
            return year + '-' + month + '-' + strDate
        } 
    }
}
</script>