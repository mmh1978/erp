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
                        <el-input v-model="phoneSearch" placeholder="手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="nameSearch" placeholder="客户姓名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="customerTypeSearch" clearable placeholder="客户类型">
                            <el-option :value="'10'" :label="'同行'"></el-option>
                            <el-option :value="'11'" :label="'客户'"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="customerOriginSearch" clearable placeholder="客户来源">
                            <el-option :value="'10'" :label="'散客'"></el-option>
                            <el-option :value="'11'" :label="'咸鱼'"></el-option>
                            <el-option :value="'12'" :label="'平台'"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="userSearch" clearable placeholder="销售人员" @visible-change="visibleChange" :loading="selectLoading" remote>
                            <el-option v-for="item in salerList" :key="item.user.id" :value="item.user.id" :label="item.user.name"></el-option>
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
                <el-table-column prop="name" label="姓名" min-width="120"></el-table-column>
                <el-table-column prop="tel" label="手机号" width="130"></el-table-column>
                <el-table-column label="性别" min-width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].sex=='01'">男</template>
                        <template v-if="dataList.content[scope.$index].sex=='02'">女</template>
                    </template>
                </el-table-column>
                <el-table-column label="客户类型" min-width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].customerType=='10' || dataList.content[scope.$index].customerType=='11'">
                            <template v-if="dataList.content[scope.$index].customerType=='10'">同行</template>
                            <template v-if="dataList.content[scope.$index].customerType=='11'">客户</template>
                        </template>
                        <template v-else>未知</template>
                    </template>
                </el-table-column>
                <el-table-column prop="customerOrigin" label="客户来源" min-width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].customerOrigin=='10' || dataList.content[scope.$index].customerOrigin=='11' || dataList.content[scope.$index].customerOrigin=='12'">
                            <template v-if="dataList.content[scope.$index].customerOrigin=='10'">散客</template>
                            <template v-if="dataList.content[scope.$index].customerOrigin=='11'">咸鱼</template>
                            <template v-if="dataList.content[scope.$index].customerOrigin=='12'">平台</template>
                        </template>
                        <template v-else>未知</template>
                    </template>
                </el-table-column>
                <el-table-column prop="paperNumber" label="证件号码" min-width="100"></el-table-column>
                <el-table-column prop="wxId" label="微信号" min-width="100"></el-table-column>
                <el-table-column prop="email" label="E-mail" min-width="100"></el-table-column>
                <el-table-column prop="user.name" label="销售人员" min-width="100"></el-table-column>
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
                <el-col :span="12">
                <el-form-item label="客户名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="手机号码" prop="tel">
                    <el-input v-model="form.tel"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="客户类型" prop="customerType">
                    <el-select v-model="form.customerType" placeholder="请选择">
                        <el-option :key="'10'" :value="'10'" :label="'同行'"></el-option>
                        <el-option :key="'11'" :value="'11'" :label="'客户'"></el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="客户来源" prop="customerOrigin">
                    <el-select v-model="form.customerOrigin" placeholder="请选择">
                        <el-option :key="'10'" :value="'10'" :label="'散客'"></el-option>
                        <el-option :key="'11'" :value="'11'" :label="'咸鱼'"></el-option>
                        <el-option :key="'12'" :value="'12'" :label="'平台'"></el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="证件类型" prop="paperType">
                    <el-select v-model="form.paperType" placeholder="请选择">
                        <el-option :key="'01'" :value="'01'" :label="'身份证'"></el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="证件号码" prop="paperNumber">
                    <el-input v-model="form.paperNumber"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="email" prop="email">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="微信号" prop="wxId">
                    <el-input v-model="form.wxId"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="form.sex">
                        <el-radio :label="'01'">男</el-radio>
                        <el-radio :label="'02'">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="联系地址" prop="addr">
                    <el-input v-model="form.addr"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="备注" prop="memo">
                    <el-input v-model="form.memo"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="指派销售人员" prop="user">
                    <el-select v-model="form.user" placeholder="请选择" @visible-change="visibleChange" :loading="selectLoading" remote>
                        <el-option v-for="item in salerList" :key="item.user.id" :value="item.user.id" :label="item.user.name"></el-option>
                    </el-select>
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
                <el-form-item label="客户名称" prop="name">
                    <el-input v-model="modifyForm.name"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="手机号码" prop="tel">
                    <el-input v-model="modifyForm.tel"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="客户类型" prop="customerType">
                    <el-select v-model="modifyForm.customerType" placeholder="请选择">
                        <el-option :key="'10'" :value="'10'" :label="'同行'"></el-option>
                        <el-option :key="'11'" :value="'11'" :label="'客户'"></el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="客户来源" prop="customerOrigin">
                    <el-select v-model="modifyForm.customerOrigin" placeholder="请选择">
                        <el-option :key="'10'" :value="'10'" :label="'散客'"></el-option>
                        <el-option :key="'11'" :value="'11'" :label="'咸鱼'"></el-option>
                        <el-option :key="'12'" :value="'12'" :label="'平台'"></el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="证件类型" prop="paperType">
                    <el-select v-model="modifyForm.paperType" placeholder="请选择">
                        <el-option :key="'01'" :value="'01'" :label="'身份证'"></el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="证件号码" prop="paperNumber">
                    <el-input v-model="modifyForm.paperNumber"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="email" prop="email">
                    <el-input v-model="modifyForm.email"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="微信号" prop="wxId">
                    <el-input v-model="modifyForm.wxId"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="modifyForm.sex">
                        <el-radio :label="'01'">男</el-radio>
                        <el-radio :label="'02'">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="联系地址" prop="addr">
                    <el-input v-model="modifyForm.addr"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="备注" prop="memo">
                    <el-input v-model="modifyForm.memo"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="指派销售人员" prop="user">
                    <el-select v-model="modifyForm.user" placeholder="请选择" @visible-change="visibleChange" :loading="selectLoading" remote>
                        <el-option v-for="item in salerList" :key="item.user.id" :value="item.user.id" :label="item.user.name"></el-option>
                    </el-select>
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
import api from '../../util/api'
import ajax from '../../util/ajax'
export default {
    name: 'customerOpen',
    mixins: [ajax],
    data () {
        return {
            phoneSearch: '',
            nameSearch: '',
            customerTypeSearch: '',
            customerOriginSearch: '',
            userSearch: '',
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,

            file: '',

            addState: false,
            addLoading: false,
            form: {
                name :'',
                tel :'',
                customerType :'11',
                customerOrigin :'10',
                paperType :'01',
                paperNumber :'',
                email :'',
                wxId :'',
                sex :'01',
                addr :'',
                memo :'',
                user :'',
                isPrivate :1,
            },
            rules: {
                name: [
                    { required: true, message: '请填写手机号码', trigger: 'blur' }
                ]
            },

            selectLoading: true,
            salerList: [],

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                name :'',
                tel :'',
                customerType :'',
                customerOrigin :'',
                paperType :'01',
                paperNumber :'',
                email :'',
                wxId :'',
                sex :'01',
                addr :'',
                memo :'',
                user :'',
                isPrivate :1,
            },
            modifyRules: {
                name: [
                    { required: true, message: '请填写手机号码', trigger: 'blur' }
                ]
            },
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
                _searchData+='&tel='+this.phoneSearch
            }
            if(this.nameSearch){
                _searchData+='&name='+this.nameSearch
            }
            if(this.customerTypeSearch){
                _searchData+='&customerType='+this.customerTypeSearch
            }
            if(this.customerOriginSearch){
                _searchData+='&customerOrigin='+this.customerOriginSearch
            }
            if(this.userSearch){
                _searchData+='&user='+this.userSearch
            }
            this.fetchData(api.customer+'/private?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            let _searchData = ''
            if(this.phoneSearch){
                _searchData+='&tel='+this.phoneSearch
            }
            if(this.nameSearch){
                _searchData+='&name='+this.nameSearch
            }
            if(this.customerTypeSearch){
                _searchData+='&customerType='+this.customerTypeSearch
            }
            if(this.customerOriginSearch){
                _searchData+='&customerOrigin='+this.customerOriginSearch
            }
            if(this.userSearch){
                _searchData+='&user='+this.userSearch
            }
            this.fetchData(api.customer+'/private?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        add(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.addLoading=true

                    let _id = this.form.user
                    delete this.form.user
                    this.form.user={ 'id':_id }

                    this.subForm(api.customer,this.form,(data) => {
                        this.addLoading=false
                        this.addState=false
                        for(let i in this.form){ this.form[i]='' }
                        this.reData()
                        this.$message({ message: '恭喜你，添加成功', type: 'success' })
                    })
                } else { return false }
            })
        },
        deleteRow(index , data) {
            this.$confirm('确定删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
                this.deleteData(api.customer+'/'+data[index].id,'',(data) => {
                    this.reData()
                    this.$message({ type: 'success', message: '删除成功!' })
                })
            }).catch(() => { })
        },
        showModify(index , data) {
            // let data = data
            this.fetchData(api.user+'/sale','',(resData) => {
                this.salerList=resData

                this.modifyForm.name=data[index].name || ''
                this.modifyForm.tel=data[index].tel || ''
                this.modifyForm.customerType=data[index].customerType || ''
                this.modifyForm.customerOrigin=data[index].customerOrigin || ''
                this.modifyForm.paperType=data[index].paperType || ''
                this.modifyForm.paperNumber=data[index].paperNumber || ''
                this.modifyForm.email=data[index].email || ''
                this.modifyForm.wxId=data[index].wxId || ''
                this.modifyForm.sex=data[index].sex || ''
                this.modifyForm.addr=data[index].addr || ''
                this.modifyForm.memo=data[index].memo || ''
                this.modifyForm.user=data[index].user || ''
                this.modifyForm.id=data[index].id

            })

            this.modifyState=true
        },
        modify(modifyForm) {
            this.$refs[modifyForm].validate((valid) => {
                if (valid) {
                    this.modifyLoading=true
                    
                    let _id = this.form.user
                    delete this.form.user
                    this.form.user={ 'id':_id }

                    this.patchData(api.customer+'/'+this.modifyForm.id,this.modifyForm,(data) => {
                        this.modifyState=false
                        this.modifyLoading=false
                        this.reData()
                        this.$message({message: '恭喜你，修改成功',type: 'success'})
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
        visibleChange(data) {
            this.selectLoading = true
            if(data){
                this.fetchData(api.user+'/sale','',(data) => {
                    this.salerList=data
                    this.selectLoading=false
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
        }
    }
}
</script>