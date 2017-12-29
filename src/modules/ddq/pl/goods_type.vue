<style lang="less" scope>
    .logo-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 130px;
        height: 65px;
        line-height: 65px;
        text-align: center;
    }
    .logo-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .logo-uploader-icon {
        font-size: 22px;
        color: #8c939d;
    }
    .brandlogo {
        width: 100%;
        height: auto;
        display: block;
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
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="name" label="图片" width="155">
                    <template slot-scope="scope">
                        <!-- <img :src="file+dataList.content[scope.$index].image" style="width: 120px;display: block;margin: 10px 0;"> -->
                        <img :src="dataList.content[scope.$index].imgUrl" style="width: 120px;display: block;margin: 10px 0;">
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="型号名称" min-width="150"></el-table-column>
                <el-table-column prop="nameFull" label="全称" min-width="150"></el-table-column>
                <el-table-column prop="descript" label="描述" min-width="150"></el-table-column>
                <el-table-column prop="brand.name" label="品牌名称" min-width="100"></el-table-column>
                <el-table-column prop="serial.name" label="系列名称" min-width="100"></el-table-column>
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
        <el-dialog title="添加" :visible.sync="addState" size="tiny" :before-close="handleClose">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="addLoading">
                <el-form-item label="图片" prop="image">
                    <input type="hidden" v-model="form.image">
                    <el-upload class="logo-uploader" :action="file+'/upload'" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="brandlogo">
                        <span v-else class="logo-uploader-icon">+</span>
                    </el-upload>
                </el-form-item>
                <el-form-item label="型号名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="全称" prop="nameFull">
                    <el-input v-model="form.nameFull"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="descript">
                    <el-input v-model="form.descript"></el-input>
                </el-form-item>
                <el-form-item label="品牌名称" prop="brand">
                    <el-select v-model="form.brand" filterable placeholder="请选择" :loading="brandLoading" @visible-change="brandLoad" @change="serialLoad">
                        <el-option v-for="item in brand" :key="item.pkGlobalId" :label="item.name" :value="item.pkGlobalId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系列名称" prop="serial">
                    <el-select v-model="form.serial" filterable placeholder="请选择" :loading="serialLoading" :disabled="serialState">
                        <el-option v-for="item in serial" :key="item.pkGlobalId" :label="item.name" :value="item.pkGlobalId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="add('form')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="修改" :visible.sync="modifyState" size="tiny" :before-close="handleClose">
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-width="80px" v-loading="modifyLoading">
                <el-form-item label="图片" prop="image">
                    <input type="hidden" v-model="modifyForm.image">
                    <el-upload class="logo-uploader" :action="file+'/upload'" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="brandlogo">
                        <span v-else class="logo-uploader-icon">+</span>
                    </el-upload>
                </el-form-item>
                <el-form-item label="型号名称" prop="name">
                    <el-input v-model="modifyForm.name"></el-input>
                </el-form-item>
                <el-form-item label="全称" prop="nameFull">
                    <el-input v-model="modifyForm.nameFull"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="descript">
                    <el-input v-model="modifyForm.descript"></el-input>
                </el-form-item>
                <el-form-item label="品牌名称" prop="brand">
                    <el-select v-model="modifyForm.brand" filterable placeholder="请选择" :loading="brandLoading" @visible-change="brandLoad"  @change="serialLoad">
                        <el-option v-for="item in brand" :key="item.pkGlobalId" :label="item.name" :value="item.pkGlobalId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系列名称" prop="serial">
                    <el-select v-model="modifyForm.serial" filterable placeholder="请选择" :loading="serialLoading" :disabled="serialState">
                        <el-option v-for="item in serial" :key="item.pkGlobalId" :label="item.name" :value="item.pkGlobalId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="modify('modifyForm')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import api from '../../../util/api'
import ajax from '../../../util/ajax'
export default {
    name: 'goodsType',
    mixins: [ajax],
    data () {
        return {
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,

            file: '',
            imageUrl: '',

            addState: false,
            addLoading: false,
            form: {
                image: '',
                name: '',
                nameFull: '',
                descript: '',
                brand: '',
                serial: '',
            },
            rules: {
                name: [
                    { required: true, message: '请输入型号名称', trigger: 'blur' }
                ],
                brand: [
                    { required: true, message: '请选择型号', trigger: 'blur' }
                ]
            },

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                image: '',
                name: '',
                nameFull: '',
                descript: '',
                brand: '',
                serial: '',
            },
            modifyRules: {
                name: [
                    { required: true, message: '请输入型号名称', trigger: 'blur' }
                ],
                brand: [
                    { required: true, message: '请选择型号', trigger: 'blur' }
                ]
            },

            brand: '',
            brandLoading: true,
            serial: '',
            serialLoading: true,
            currBrand:'',
            serialState: true,
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
            this.fetchData(api.goodsType+'?page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            this.fetchData(api.goodsType+'?page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        add(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.addLoading=true
                    let _brand=this.form.brand
                    let _serial=this.form.serial
                    this.form.brand={
                        "pkGlobalId": _brand
                    }
                    this.form.serial={
                        "pkGlobalId": _serial
                    }
                    this.subForm(api.goodsType,this.form,(data) => {
                        this.addLoading=false
                        this.addState=false
                        for(let i in this.form){
                            this.form[i]=''
                        }
                        this.imageUrl=''
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
                this.deleteData(api.goodsType+'/'+data[index].pkGlobalId,'',(data) => {
                    this.reData()
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                })
            }).catch(() => {
        
            })
        },
        showModify(index , data) {
            this.modifyForm.pkGlobalId=data[index].pkGlobalId
            this.modifyForm.name=data[index].name
            this.modifyForm.nameFull=data[index].nameFull
            this.modifyForm.image=data[index].image
            this.modifyForm.descript=data[index].descript
            this.modifyForm.brand=data[index].brand?data[index].brand.pkGlobalId:''
            this.modifyForm.serial=data[index].serial?data[index].serial.pkGlobalId:''  
            this.imageUrl = api.file+'/' + data[index].image
            if(!this.brand){
                this.fetchData(api.brand+'?page=0&size=9999','',(data) => {
                    this.brand=data.content
                    this.brandLoading=false
                    console.log(data)
                })
            }
            this.serialLoad(this.modifyForm.brand)

            this.modifyState=true
        },
        modify(modifyForm) {
            this.$refs[modifyForm].validate((valid) => {
                if (valid) {
                    this.modifyLoading=true
                    let _brand=this.modifyForm.brand
                    let _serial=this.modifyForm.serial
                    this.modifyForm.brand={
                        "pkGlobalId": _brand
                    }
                    this.modifyForm.serial={
                        "pkGlobalId": _serial
                    }
                    this.patchData(api.goodsType+'/'+this.modifyForm.pkGlobalId,this.modifyForm,(data) => {
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
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = api.file+'/'+res.UPLOAD_FILE_ID
            this.form.image = res.UPLOAD_FILE_ID[0]
            this.modifyForm.image = res.UPLOAD_FILE_ID[0]
        },
        beforeAvatarUpload(file) {
            if(this.modifyImg){
                this.deleteData(api.file+'/'+this.modifyForm.image,'',(data) => {

                })
            }
            this.modifyImg = true
            if(!!this.form.image && this.addState){
                this.deleteData(api.file+'/'+this.form.image,'',(data) => {

                })
            }
        },
        brandLoad(data) {
            if(data && !this.brand){
                this.fetchData(api.brand+'?page=0&size=9999','',(data) => {
                    this.brand=data.content
                    this.brandLoading=false
                    console.log(data)
                })
            }
        },
        serialLoad(id) {
            this.serialLoading=true
            if(!!id){
                this.fetchData(api.goodsSerial+'?brand.pkGlobalId='+id+'&page=0&size=9999','',(data) => {
                    this.serial=data.content
                    this.serialLoading=false
                    this.serialState=false
                    console.log(data)
                })
            }
        },
        handleClose(done) {
            this.imageUrl=''
            done()
        }
    }
}
</script>