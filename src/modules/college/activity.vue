<style lang="less" scope>
    .quill-editor {
        .ql-container {
            height: 380px;
        }
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 190px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 22px;
        color: #8c939d;
    }
    .avatar {
        width: 100%;
        height: auto;
        display: block;
    }
    .ql-snow .ql-picker{
        line-height: 24px;
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
                <el-table-column prop="name" label="封面图片" width="155">
                    <template slot-scope="scope">
                        <img :src="file+dataList.content[scope.$index].image" style="width: 120px;display: block;margin: 10px 0;">
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
                <el-table-column prop="subTitle" label="副标题" min-width="120"></el-table-column>
               <!--  <el-table-column prop="rd" label="新闻页显示" min-width="120"></el-table-column>
                <el-table-column prop="tj" label="首页显示" min-width="120"></el-table-column> -->
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
        <el-dialog title="添加活动" :visible.sync="addState" size="full" :before-close="addHandleClose">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="addLoading">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="副标题" prop="subTitle">
                    <el-input v-model="form.subTitle"></el-input>
                </el-form-item>
                <el-form-item label="口号" prop="slogan">
                    <el-input v-model="form.slogan"></el-input>
                </el-form-item>
                <el-form-item label="推荐" prop="tj">
                    <el-switch v-model="form.tj" on-text="" off-text=""></el-switch>
                    <span>（是否在首页显示，最多显示两条）</span>
                </el-form-item>
                <el-form-item label="热点推荐" prop="rd">
                    <el-switch v-model="form.rd" on-text="" off-text=""></el-switch>
                    <span>（是否在新闻页显示，最多显示四条）</span>
                </el-form-item>
                <el-form-item label="封面图片" prop="image">
                    <input type="hidden" v-model="form.image">
                    <el-upload class="avatar-uploader" :action="file+'/upload'" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <span v-else class="avatar-uploader-icon">380 × 240</span>
                    </el-upload>
                </el-form-item>
                <el-form-item label="照片墙">
                    <el-upload :action="file+'/upload'" list-type="picture-card" :on-remove="handleRemove" :on-success="imgListSuccess">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="正文" prop="content">
                    <!-- <quill-editor v-model="form.content"></quill-editor> -->
                    <!-- https://github.com/quilljs/quill -->
<!-- ==================================1================================== -->
<quill-editor ref="myTextEditor" v-model="editCon" :options="editorOption" @focus="onEditorFocus($event)" @ready="onEditorReady($event)">
    <div id="toolbar" slot="toolbar" class="ql-toolbar ql-snow">
        <span class="ql-formats">
            <button class="ql-bold"></button>
            <button class="ql-italic"></button>
            <button class="ql-underline"></button>
            <button class="ql-strike"></button>
            <button class="ql-blockquote"></button>
            <button class="ql-code-block"></button>
            <button class="ql-header" value="1"></button>
            <button class="ql-header" value="2"></button>
            <button class="ql-list" value="ordered"></button>
            <button class="ql-list" value="bullet"></button>
            <button class="ql-script" value="sub"></button>
            <button class="ql-script" value="super"></button>
            <button class="ql-indent" value="-1"></button>
            <button class="ql-indent" value="+1"></button>
            <button class="ql-direction" value="rtl"></button>
            <select class="ql-size">
                <option value="small"></option>
                <option selected></option>
                <option value="large"></option>
                <option value="huge"></option>
            </select>
            <select class="ql-header">
                <option selected></option>
                <option value="1"></option>
                <option value="2"></option>
                <option value="3"></option>
                <option value="4"></option>
                <option value="5"></option>
                <option value="6"></option>
            </select>
            <button class="ql-color"></button>
            <button class="ql-background"></button>
            <select class="ql-font">
                <option selected></option>
                <option value="serif"></option>
                <option value="monospace"></option>
            </select>
            <select class="ql-align">
                <option selected></option>
                <option value="center"></option>
                <option value="right"></option>
                <option value="justify"></option>
            </select>
            <button class="ql-clean"></button>
            <button class="ql-link"></button>
            <el-upload class="upload-demo" :action="file+'/upload'" multiple :show-file-list="false" :on-success="upimg" style="float:left;color:#444">
                <el-button>IMG</el-button>
            </el-upload>
        </span>
    </div>
</quill-editor>

                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="add('form')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="修改活动" :visible.sync="modifyState" size="full" :before-close="modifyHandleClose">
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-width="80px" v-loading="modifyLoading">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="modifyForm.title"></el-input>
                </el-form-item>
                <el-form-item label="副标题" prop="subTitle">
                    <el-input v-model="modifyForm.subTitle"></el-input>
                </el-form-item>
                <el-form-item label="口号" prop="slogan">
                    <el-input v-model="modifyForm.slogan"></el-input>
                </el-form-item>
                <el-form-item label="推荐" prop="tj">
                    <el-switch v-model="modifyForm.tj" on-text="" off-text=""></el-switch>
                    <span>（是否在首页显示，最多显示两条）</span>
                </el-form-item>
                <el-form-item label="热点推荐" prop="rd">
                    <el-switch v-model="modifyForm.rd" on-text="" off-text=""></el-switch>
                    <span>（是否在新闻页显示，最多显示四条）</span>
                </el-form-item>
                <el-form-item label="封面图片" prop="image">
                    <input type="hidden" v-model="modifyForm.image">
                    <el-upload class="avatar-uploader" :action="file+'/upload'" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <span v-else class="avatar-uploader-icon">380 × 240</span>
                    </el-upload>
                </el-form-item>
                <el-form-item label="照片墙">
                    <el-upload :action="file+'/upload'" list-type="picture-card" :file-list="fileList" :on-remove="handleRemove" :on-success="imgListSuccess">
                        <img src="imageUrl">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="正文" prop="content">
                    <!-- <quill-editor v-model="modifyForm.content"></quill-editor> -->
<!-- ==================================2================================== -->
<quill-editor ref="myTextEditor" v-model="editCon" :options="editorOption" @focus="onEditorFocus($event)" @ready="onEditorReady($event)">
    <div id="toolbar" slot="toolbar" class="ql-toolbar ql-snow">
        <span class="ql-formats">
            <button class="ql-bold"></button>
            <button class="ql-italic"></button>
            <button class="ql-underline"></button>
            <button class="ql-strike"></button>
            <button class="ql-blockquote"></button>
            <button class="ql-code-block"></button>
            <button class="ql-header" value="1"></button>
            <button class="ql-header" value="2"></button>
            <button class="ql-list" value="ordered"></button>
            <button class="ql-list" value="bullet"></button>
            <button class="ql-script" value="sub"></button>
            <button class="ql-script" value="super"></button>
            <button class="ql-indent" value="-1"></button>
            <button class="ql-indent" value="+1"></button>
            <button class="ql-direction" value="rtl"></button>
            <select class="ql-size">
                <option value="small"></option>
                <option selected></option>
                <option value="large"></option>
                <option value="huge"></option>
            </select>
            <select class="ql-header">
                <option selected></option>
                <option value="1"></option>
                <option value="2"></option>
                <option value="3"></option>
                <option value="4"></option>
                <option value="5"></option>
                <option value="6"></option>
            </select>
            <button class="ql-color"></button>
            <button class="ql-background"></button>
            <select class="ql-font">
                <option selected></option>
                <option value="serif"></option>
                <option value="monospace"></option>
            </select>
            <select class="ql-align">
                <option selected></option>
                <option value="center"></option>
                <option value="right"></option>
                <option value="justify"></option>
            </select>
            <button class="ql-clean"></button>
            <button class="ql-link"></button>
            <el-upload class="upload-demo" :action="file+'/upload'" multiple :show-file-list="false" :on-success="upimg" style="float:left;color:#444">
                <el-button>IMG</el-button>
            </el-upload>
        </span>
    </div>
</quill-editor>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="modify">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import api from '../../util/api'
import ajax from '../../util/ajax'
export default {
    name: 'collegeShare',
    mixins: [ajax],
    data () {
        return {
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,

            addState: false,
            addLoading: false,
            form: {
                title: '',
                subTitle: '',
                slogan: '',
                image: '',
                images:'',
                content: '',
                tj:false,
                rd:false,
                type:'activityId'
            },
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                subTitle: [
                    { required: true, message: '请输入副标题', trigger: 'blur' }
                ],
                slogan: [
                    { required: true, message: '请输入口号', trigger: 'blur' }
                ],
                image: [
                    { required: true, message: '请上传封面图片', trigger: 'blur' }
                ]
            },
            imageUrl: '',
            file: '',

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                title: '',
                subTitle: '',
                slogan: '',
                image: '',
                images:'',
                content: '',
                tj:false,
                rd:false,
                type:'activityId'
            },
            modifyRules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                subTitle: [
                    { required: true, message: '请输入副标题', trigger: 'blur' }
                ],
                slogan: [
                    { required: true, message: '请输入口号', trigger: 'blur' }
                ],
                image: [
                    { required: true, message: '请上传封面图片', trigger: 'blur' }
                ]
            },
            modifyImg: false,//是否修改过图片
            images: [],

            fileList: [],
//======================3=====================
editCon:'',
length: '',
editor: {},
editorOption: {
    modules: {
        toolbar: '#toolbar',
    }
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

//======================4=====================
upimg(file) {
    let _vue = this
    this.editor.insertEmbed(_vue.editCon.length , 'image', file.UPLOAD_FILE_URL[0])
},
onEditorFocus(editor) {
    this.editor = editor
},
onEditorReady(editor) {
    this.editor = editor
},

        handleCurrentChange(val) {
            this.loading=true
            this.fetchData(api.college+'/activity?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            this.fetchData(api.college+'/activity?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        add(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.addLoading=true
                    this.form.images=this.images.join(',')
//======================5=====================
this.form.content=this.editCon
                    this.subForm(api.college+'/activity',this.form,(data) => {
                        this.addLoading=false
                        this.addState=false
                        for(let i in this.form){
                            this.form[i]=''
                        }
                        this.reData()
                        this.$message({
                          message: '恭喜你，添加成功',
                          type: 'success'
                        })
                        this.imageUrl = ''
                        this.images = []
                        this.editCon = ''
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
                this.deleteData(api.file+'/'+data[index].image,'',(data) => {})
                this.deleteData(api.college+'/activity/'+data[index].id,'',(data) => {
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
            this.fileList = []
            for(let i in data[index]){
                this.modifyForm[i]=data[index][i]
            }
//======================6=====================
this.editCon=data[index].content
            this.imageUrl=api.file+'/'+this.modifyForm.image
            if(!!this.modifyForm.images){
                let _arr = this.modifyForm.images.split(',')
                for(let i in _arr){
                    this.fileList[i]={
                        name: '',
                        url: api.file+'/'+_arr[i],
                        status: 'finished'
                    }
                    this.images.push(_arr[i])
                }
            }
            
            this.modifyState=true
        },
        modify() {
            this.modifyLoading=true
//======================7=====================
this.modifyForm.content=this.editCon
            this.modifyForm.images=this.images.join(',')
            this.patchData(api.college+'/activity/'+this.modifyForm.id,this.modifyForm,(data) => {
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
                this.imageUrl = ''
                this.modifyImg = false
                this.images = []
            })
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = api.file+'/'+res.UPLOAD_FILE_ID
            this.form.image = res.UPLOAD_FILE_ID[0]
            this.modifyForm.image = res.UPLOAD_FILE_ID[0]
        },
        beforeAvatarUpload(file) {
            // if(this.modifyImg){
            //     this.deleteData(api.file+'/'+this.modifyForm.image,'',(data) => {

            //     })
            // }
            // this.modifyImg = true
            // if(!!this.form.image && this.addState){
            //     this.deleteData(api.file+'/'+this.form.image,'',(data) => {

            //     })
            // }
        },
        modifyHandleClose(done) {
            if(this.modifyImg){
                this.deleteData(api.file+'/'+this.modifyForm.image,'',(data) => {

                })
            }
            this.modifyImg = false
            this.imageUrl = ''
            for(let i in this.modifyForm){
                this.modifyForm[i]=''
            }
            done()
        },
        addHandleClose(done) {
            if(!!this.form.image){
                this.deleteData(api.file+'/'+this.form.image,'',(data) => {

                })
            }
            this.imageUrl = ''
            done()
        },
        handleRemove(file, fileList) {
            if(this.modifyState){
                this.deleteData(file.url,'',(data) => {

                })
                let _urlArr = file.url.split('/')
                let _id = _urlArr[_urlArr.length]
                let _index = this.images.indexOf(_id)
                this.images.splice(_index,1)
            }else{
                this.deleteData(api.file+'/'+file.response.UPLOAD_FILE_ID[0],'',(data) => {

                })
                if(this.images.indexOf(file.response.UPLOAD_FILE_ID[0])>=0){
                    let _index = this.images.indexOf(file.response.UPLOAD_FILE_ID[0])
                    this.images.splice(_index,1)
                }
            }
        },
        imgListSuccess(res, flie){
            this.images.push(res.UPLOAD_FILE_ID[0])
        }
    }
}
</script>