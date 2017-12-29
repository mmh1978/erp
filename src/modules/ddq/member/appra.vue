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
                    <el-form-item>
                        <el-select v-model="appraiserSearch" multiple placeholder="请选择">
                            <el-option v-for="item in appraiser" :label="item.name" :key="item.code" :value="item.code"></el-option>
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
                <el-table-column prop="showName" label="鉴评师名称" width="180"></el-table-column>
                <!-- <el-table-column prop="sort" label="排序" width="100"></el-table-column> -->
                <el-table-column prop="hasAppraisers" label="鉴定师技能" min-width="140">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].hasAppraisers">
                            <template v-for="item in dataList.content[scope.$index].hasAppraisers.split(',')">
                                <template v-for="i in appraiser">
                                    <template v-if="i.code==item">{{i.name+' '}}</template>
                                </template>
                            </template>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="tblUser.isAuth" label="同行" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].tblUser.orgAuth==true">
                            <i class="el-icon-check" style="color:#13ce66"></i>
                        </template>
                        <template v-else>
                            <i class="el-icon-minus"></i>
                        </template>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="description" label="备注" min-width="100"></el-table-column> -->
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
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" v-loading="addLoading">
                <el-col :span="12">
                <el-form-item label="鉴定师名称" prop="showName">
                    <el-input v-model="form.showName"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="form.sort" :min="0" style="width:100%"></el-input-number>
                </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="鉴定师技能">
                        <el-checkbox-group v-model="form.hasAppraisers">
                            <el-checkbox v-for="item in appraiser" :label="item.code" :key="item.code" :name="item.type">{{item.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                <el-form-item label="选择用户" prop="tblUser">
                    <el-select v-model="form.tblUser" filterable remote placeholder="请输入关键词搜索" :remote-method="remoteMethod" :loading="memberLoading" style="width:100%">
                        <el-option v-for="item in memberList" :key="item.pkGlobalId" :value="item.pkGlobalId" :label="item.nickName+' : '+item.phone"></el-option>
                    </el-select>
                </el-form-item> 
                </el-col>
                <el-col :span="24">
                    <el-form-item label="">
                        <el-checkbox label="是否显示" v-model="form.show"></el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                <el-form-item label="备注" prop="description">
                    <el-input type="textarea" autosize placeholder="请输入内容" :autosize="{ minRows: 2 }" v-model="form.description"></el-input>
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
                <el-col :span="12">
                <el-form-item label="鉴定师名称" prop="showName">
                    <el-input v-model="modifyForm.showName"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="modifyForm.sort" :min="0" style="width:100%"></el-input-number>
                </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="鉴定师技能">
                        <el-checkbox-group v-model="modifyForm.hasAppraisers">
                            <el-checkbox v-for="item in appraiser" :label="item.code" :key="item.code" :name="item.type">{{item.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                <el-form-item label="选择用户" prop="tblUser">
                    <el-select v-model="modifyForm.tblUser" filterable remote placeholder="请输入关键词搜索" :remote-method="remoteMethod" :loading="memberLoading" style="width:100%">
                        <el-option v-for="item in memberList" :key="item.pkGlobalId" :value="item.pkGlobalId" :label="item.nickName+' : '+item.phone"></el-option>
                    </el-select>
                </el-form-item> 
                </el-col>
                <el-col :span="24">
                    <el-form-item label="">
                        <el-checkbox label="是否显示" v-model="modifyForm.show"></el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                <el-form-item label="备注" prop="description">
                    <el-input type="textarea" autosize placeholder="请输入内容" :autosize="{ minRows: 2 }" v-model="modifyForm.description"></el-input>
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
    name: 'appra',
    mixins: [ajax],
    data () {
        return {
            phoneSearch: '',
            appraiserSearch: '',
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,

            file: '',

            addState: false,
            addLoading: false,
            form: {
                tblUser :'',
                showName :'',
                sort :'',
                hasAppraisers :[],
                show :false,
                description :'',
            },
            rules: {
                tblUser: [
                    { required: true, message: '请选择会员', trigger: 'blur' }
                ],
                showName: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ]
            },

            selectLoading: true,
            salerList: [],

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                tblUser :'',
                showName :'',
                sort :'',
                hasAppraisers :[],
                show :false,
                description :'',
            },
            modifyRules: {
                tblUser: [
                    { required: true, message: '请选择会员', trigger: 'blur' }
                ],
                showName: [
                    { required: true, message: '请输入', trigger: 'blur' }
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

        this.fetchData(api.appra+'/dict?type=appraiser','',(data) => {
            this.appraiser=data
            console.log(data)
        })
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
            if(this.appraiserSearch){
                _searchData+='&appraisers='+this.appraiserSearch.join()
            }
            this.fetchData(api.appra+'?page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
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
            if(this.appraiserSearch){
                _searchData+='&appraisers='+this.appraiserSearch.join()
            }
            this.fetchData(api.appra+'?page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        add(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {

                    let _id = this.form.tblUser
                    this.form.tblUser={ 'pkGlobalId':_id }
                    this.form.hasAppraisers=this.form.hasAppraisers.join(',')

                    this.subForm(api.appra,this.form,(data) => {
                        this.addLoading=false
                        this.addState=false
                        for(let i in this.form){ this.form[i]='' }
                        this.reData()
                        this.$message({ message: '恭喜你，添加成功', type: 'success' })
                        this.form={
                            tblUser :'',
                            showName :'',
                            sort :'',
                            hasAppraisers :[],
                            show :false,
                            description :'',
                        }
                    })
                } else { return false }
            })
        },
        deleteRow(index , data) {
            this.$confirm('确定删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
                this.deleteData(api.appra+'/'+data[index].pkGlobalId,'',(data) => {
                    this.reData()
                    this.$message({ type: 'success', message: '删除成功!' })
                })
            }).catch(() => { })
        },
        showModify(index , data) {

            this.memberList=[]

            this.memberList.push(data[index].tblUser)

            this.modifyForm.tblUser=data[index].tblUser.pkGlobalId || ''
            this.modifyForm.showName=data[index].showName || ''
            this.modifyForm.sort=data[index].sort || ''
            this.modifyForm.hasAppraisers=data[index].hasAppraisers.split(',') || ''
            this.modifyForm.show=data[index].show || ''
            this.modifyForm.description=data[index].description || ''

            this.modifyForm.pkGlobalId=data[index].pkGlobalId
            console.log(this.modifyForm)
            this.modifyState=true
        },
        modify(modifyForm) {
            this.$refs[modifyForm].validate((valid) => {
                if (valid) {
                    this.modifyLoading=true
                    
                    let _id = this.modifyForm.tblUser
                    this.modifyForm.tblUser={ 'pkGlobalId':_id }
                    this.modifyForm.hasAppraisers=this.modifyForm.hasAppraisers.join(',')

                    this.patchData(api.appra+'/'+this.modifyForm.pkGlobalId,this.modifyForm,(data) => {
                        this.modifyState=false
                        this.modifyLoading=false
                        this.reData()
                        this.$message({message: '恭喜你，修改成功',type: 'success'})
                        this.modifyForm={
                            tblUser :'',
                            showName :'',
                            sort :'',
                            hasAppraisers :[],
                            show :false,
                            description :'',
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