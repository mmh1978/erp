<style lang="less" scope>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
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
                <el-table-column prop="" label="图片" width="300">
                    <template slot-scope="scope">
                        <img :src="dataList.content[scope.$index].imgUrl" style="width:100%;display:block;margin:10px">
                    </template>
                </el-table-column>
                <el-table-column prop="" label="链接类型" width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].type=='0'">外部链接</template>
                        <template v-if="dataList.content[scope.$index].type=='1'">买货</template>
                        <template v-if="dataList.content[scope.$index].type=='2'">卖货</template>
                        <template v-if="dataList.content[scope.$index].type=='3'">评估鉴定</template>
                    </template>
                </el-table-column>
                <el-table-column prop="ext" label="链接值" min-width="200"></el-table-column>
                <el-table-column prop="sort" label="排序" min-width="80"></el-table-column>
                <el-table-column prop="" label="显示" width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].isShow=='0'">显示</template>
                        <template v-if="dataList.content[scope.$index].isShow=='1'">不显示</template>
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="上次更新" width="180"></el-table-column>
                <el-table-column prop="" label="浏览器跳转" width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].openBrowser=='0'">不跳转</template>
                        <template v-if="dataList.content[scope.$index].openBrowser=='1'">跳转</template>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="显示平台" width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].systemType=='0'">典当圈</template>
                        <template v-if="dataList.content[scope.$index].systemType=='1'">为辽宁典当圈</template>
                        <template v-if="dataList.content[scope.$index].systemType=='2'">人人奢</template>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="banner类型" width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].model=='0'">首页</template>
                        <template v-if="dataList.content[scope.$index].model=='1'">新闻</template>
                        <template v-if="dataList.content[scope.$index].model=='2'">启动时广告</template>
                        <template v-if="dataList.content[scope.$index].model=='3'">合约商家</template>
                    </template>
                </el-table-column>
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
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" v-loading="addLoading">

                <el-form-item label="链接类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择" style="width:100%">
                        <el-option :value="0" :label="'外部链接'"></el-option>
                        <el-option :value="1" :label="'买货'"></el-option>
                        <el-option :value="2" :label="'卖货'"></el-option>
                        <el-option :value="3" :label="'评估鉴定'"></el-option>
                    </el-select>
                </el-form-item>      
                <el-form-item label="链接值" prop="ext">
                    <el-input v-model="form.ext"></el-input>
                </el-form-item>
                <el-form-item label="显示" prop="isShow">
                    <el-select v-model="form.isShow" placeholder="请选择" style="width:100%">
                        <el-option :value="0" :label="'显示'"></el-option>
                        <el-option :value="1" :label="'不显示'"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="浏览器跳转" prop="openBrowser">
                    <el-select v-model="form.openBrowser" placeholder="请选择" style="width:100%">
                        <el-option :value="0" :label="'不跳转'"></el-option>
                        <el-option :value="1" :label="'跳转'"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示平台" prop="systemType">
                    <el-select v-model="form.systemType" placeholder="请选择" style="width:100%">
                        <el-option :value="0" :label="'典当圈'"></el-option>
                        <el-option :value="1" :label="'为辽宁典当圈'"></el-option>
                        <el-option :value="2" :label="'人人奢'"></el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="banner类型" prop="model">
                    <el-select v-model="form.model" placeholder="请选择" style="width:100%">
                        <el-option :value="0" :label="'首页'"></el-option>
                        <el-option :value="1" :label="'新闻'"></el-option>
                        <el-option :value="2" :label="'启动时广告'"></el-option>
                        <el-option :value="3" :label="'合约商家'"></el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="图片">
                    <el-upload class="avatar-uploader" :action="file+'/upload'" :show-file-list="false" :on-success="imgListSuccess">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="add('form')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="修改" :visible.sync="modifyState" size="tiny">
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-width="100px" v-loading="modifyLoading">
                
                <el-form-item label="链接类型" prop="type">
                    <el-select v-model="modifyForm.type" placeholder="请选择" style="width:100%">
                        <el-option :value="0" :label="'外部链接'"></el-option>
                        <el-option :value="1" :label="'买货'"></el-option>
                        <el-option :value="2" :label="'卖货'"></el-option>
                        <el-option :value="3" :label="'评估鉴定'"></el-option>
                    </el-select>
                </el-form-item>      
                <el-form-item label="链接值" prop="ext">
                    <el-input v-model="modifyForm.ext"></el-input>
                </el-form-item>
                <el-form-item label="显示" prop="isShow">
                    <el-select v-model="modifyForm.isShow" placeholder="请选择" style="width:100%">
                        <el-option :value="0" :label="'显示'"></el-option>
                        <el-option :value="1" :label="'不显示'"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="浏览器跳转" prop="openBrowser">
                    <el-select v-model="modifyForm.openBrowser" placeholder="请选择" style="width:100%">
                        <el-option :value="0" :label="'不跳转'"></el-option>
                        <el-option :value="1" :label="'跳转'"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示平台" prop="systemType">
                    <el-select v-model="modifyForm.systemType" placeholder="请选择" style="width:100%">
                        <el-option :value="0" :label="'典当圈'"></el-option>
                        <el-option :value="1" :label="'为辽宁典当圈'"></el-option>
                        <el-option :value="2" :label="'人人奢'"></el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="banner类型" prop="model">
                    <el-select v-model="modifyForm.model" placeholder="请选择" style="width:100%">
                        <el-option :value="0" :label="'首页'"></el-option>
                        <el-option :value="1" :label="'新闻'"></el-option>
                        <el-option :value="2" :label="'启动时广告'"></el-option>
                        <el-option :value="3" :label="'合约商家'"></el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="图片">
                    <el-upload class="avatar-uploader" :action="file+'/upload'" :show-file-list="false" :on-success="imgListSuccess">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="modify('modifyForm')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import api from '../../util/api'
import ajax from '../../util/ajax'
export default {
    name: 'banner',
    mixins: [ajax],
    data () {
        return {
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,

            file: '',

            addState: false,
            addLoading: false,
            form: {
                imgUrl: '',
                type: '',
                ext: '',
                isShow: '',
                openBrowser: '',
                systemType: '',
                model: ''
            },
            rules: {
                memberId: [
                    { required: true, message: '请选择会员', trigger: 'blur' }
                ]
            },

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                imgUrl: '',
                type: '',
                ext: '',
                isShow: '',
                openBrowser: '',
                systemType: '',
                pkGlobalId: '',
                model: ''
            },
            modifyRules: {
                memberId: [
                    { required: true, message: '请选择会员', trigger: 'blur' }
                ]
            },

            memberList: [],
            modifyImgList: [],
            memberLoading: '',
            imageUrl: '',
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
            this.fetchData(api.banner+'?page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            this.fetchData(api.banner+'?page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        add(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.addLoading=true
                    this.subForm(api.banner,this.form,(data) => {
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
                this.deleteData(api.banner+'/'+data[index].pkGlobalId,'',(data) => {
                    this.reData()
                    this.$message({ type: 'success', message: '删除成功!' })
                })
            }).catch(() => { })
        },
        showModify(index , data) {
            this.imageUrl = data[index].imgUrl

            this.modifyForm.imgUrl = data[index].imgUrl
            this.modifyForm.type = data[index].type
            this.modifyForm.ext = data[index].ext
            this.modifyForm.isShow = data[index].isShow
            this.modifyForm.openBrowser = data[index].openBrowser
            this.modifyForm.systemType = data[index].systemType
            this.modifyForm.model = data[index].model
            this.modifyForm.pkGlobalId = data[index].pkGlobalId
            this.modifyState=true
        },
        modify(modifyForm) {
            this.$refs[modifyForm].validate((valid) => {
                if (valid) {
                    this.modifyLoading=true
                    
                    this.patchData(api.banner+'/'+this.modifyForm.pkGlobalId,this.modifyForm,(data) => {
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
        imgListSuccess(res, flie){
            this.imageUrl = flie.url
            this.form.imgUrl = res.UPLOAD_FILE_URL[0]
            this.modifyForm.imgUrl = res.UPLOAD_FILE_URL[0]
        }
    }
}
</script>