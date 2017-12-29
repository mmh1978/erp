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
                <el-table-column prop="name" label="品牌LOGO" width="155">
                    <template slot-scope="scope">
                        <!-- <img :src="file+dataList.content[scope.$index].image" style="width: 120px;display: block;margin: 10px 0;"> -->
                        <img :src="dataList.content[scope.$index].imgUrl" style="width: 120px;display: block;margin: 10px 0;">
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="品牌名称" min-width="150"></el-table-column>
                <el-table-column prop="nameEn" label="英文名" min-width="150"></el-table-column>
                <el-table-column prop="brandGroup.name" label="品牌分组" min-width="100"></el-table-column>
                <el-table-column prop="category.name" label="商品分类" min-width="100"></el-table-column>
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
        <el-dialog title="添加" :visible.sync="addState" size="tiny">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="addLoading">
                <el-form-item label="LOGO" prop="image">
                    <input type="hidden" v-model="form.image">
                    <el-upload class="logo-uploader" :action="file+'/upload'" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="brandlogo">
                        <span v-else class="logo-uploader-icon">130 × 65</span>
                    </el-upload>
                </el-form-item>
                <el-form-item label="品牌名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="英文名" prop="nameEn">
                    <el-input v-model="form.nameEn"></el-input>
                </el-form-item>
                <el-form-item label="品牌分组" prop="brandGroup">
                    <el-select v-model="form.brandGroup" filterable placeholder="请选择" :loading="brandGroupLoading" @visible-change="brandGroupLoad">
                        <el-option v-for="item in brandGroup" :key="item.pkGlobalId" :label="item.name" :value="item.pkGlobalId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品分类" prop="goodsCategory">
                    <el-select v-model="form.goodsCategory" filterable placeholder="请选择" :loading="goodsCategoryLoading" @visible-change="goodsCategoryLoad">
                        <el-option v-for="item in goodsCategory" :key="item.pkGlobalId" :label="item.name" :value="item.pkGlobalId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="add('form')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="修改" :visible.sync="modifyState" size="tiny" >
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-width="80px" v-loading="modifyLoading">
                <el-form-item label="LOGO" prop="image">
                    <input type="hidden" v-model="modifyForm.image">
                    <el-upload class="logo-uploader" :action="file+'/upload'" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="brandlogo">
                        <span v-else class="logo-uploader-icon">130 × 65</span>
                    </el-upload>
                </el-form-item>
                <el-form-item label="品牌名称" prop="name">
                    <el-input v-model="modifyForm.name"></el-input>
                </el-form-item>
                <el-form-item label="英文名" prop="nameEn">
                    <el-input v-model="modifyForm.nameEn"></el-input>
                </el-form-item>
                <el-form-item label="品牌分组" prop="brandGroup">
                    <el-select v-model="modifyForm.brandGroup" filterable placeholder="请选择" :loading="brandGroupLoading" @visible-change="brandGroupLoad">
                        <el-option v-for="item in brandGroup" :key="item.pkGlobalId" :label="item.name" :value="item.pkGlobalId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品分类" prop="goodsCategory">
                    <el-select v-model="modifyForm.goodsCategory" filterable placeholder="请选择" :loading="goodsCategoryLoading" @visible-change="goodsCategoryLoad">
                        <el-option v-for="item in goodsCategory" :key="item.pkGlobalId" :label="item.name" :value="item.pkGlobalId"></el-option>
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
    name: 'brand',
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
                name: '',
                nameEn: '',
                brandGroup: '',
                goodsCategory: '',
            },
            rules: {
                name: [
                    { required: true, message: '品牌名称', trigger: 'blur' }
                ],
                brandGroup: [
                    { required: true, message: '请选择品牌分组', trigger: 'blur' }
                ],
                goodsCategory: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' }
                ]
            },

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                name: '',
                nameEn: '',
                brandGroup: '',
                goodsCategory: '',
            },
            modifyRules: {
                name: [
                    { required: true, message: '品牌名称', trigger: 'blur' }
                ],
                brandGroup: [
                    { required: true, message: '请选择品牌分组', trigger: 'blur' }
                ],
                goodsCategory: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' }
                ]
            },

            brandGroup: '',
            brandGroupLoading: true,
            goodsCategory: '',
            goodsCategoryLoading: true,
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
            this.fetchData(api.brand+'?page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            this.fetchData(api.brand+'?page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        add(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.addLoading=true
                    let _brandGroup=this.form.brandGroup
                    let _goodsCategory=this.form.goodsCategory
                    this.form.brandGroup={
                        "pkGlobalId": _brandGroup
                    }
                    this.form.category={
                        "pkGlobalId": _goodsCategory
                    }
                    this.form.isGroupShow=1
                    this.subForm(api.brand,this.form,(data) => {
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
                this.deleteData(api.brand+'/'+data[index].pkGlobalId,'',(data) => {
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
            this.modifyForm.nameEn=data[index].nameEn
            this.modifyForm.image=data[index].image
            this.modifyForm.brandGroup=data[index].brandGroup?data[index].brandGroup.pkGlobalId:''
            this.modifyForm.goodsCategory=data[index].category?data[index].category.pkGlobalId:''          
            if(!this.brandGroup){
                this.fetchData(api.brandGroup+'?page=0&size=9999','',(data) => {
                    this.brandGroup=data.content
                    this.brandGroupLoading=false
                })
            }
            if(!this.goodsCategory){
                this.fetchData(api.goodsCategory+'?page=0&size=9999','',(data) => {
                    this.goodsCategory=data.content
                    this.goodsCategoryLoading=false
                })
            }
            this.modifyState=true
        },
        modify(modifyForm) {
            this.$refs[modifyForm].validate((valid) => {
                if (valid) {
                    this.modifyLoading=true
                    let _brandGroup=this.modifyForm.brandGroup
                    let _goodsCategory=this.modifyForm.goodsCategory
                    this.modifyForm.brandGroup={
                        "pkGlobalId": _brandGroup
                    }
                    this.modifyForm.category={
                        "pkGlobalId": _goodsCategory
                    }
                    this.modifyForm.isGroupShow=1
                    this.patchData(api.brand+'/'+this.modifyForm.pkGlobalId,this.modifyForm,(data) => {
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
        brandGroupLoad(data) {
            if(data && !this.brandGroup){
                this.fetchData(api.brandGroup+'?page=0&size=9999','',(data) => {
                    this.brandGroup=data.content
                    this.brandGroupLoading=false
                    console.log(data)
                })
            }
        },
        goodsCategoryLoad(data) {
            if(data && !this.goodsCategory){
                this.fetchData(api.goodsCategory+'?page=0&size=9999','',(data) => {
                    this.goodsCategory=data.content
                    this.goodsCategoryLoading=false
                    console.log(data)
                })
            }
        }
    }
}
</script>