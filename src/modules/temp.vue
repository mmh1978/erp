<style lang="less" scope>

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
                <el-table-column prop="operator.nickName" label="用户" min-width="120"></el-table-column>
                <el-table-column prop="operator.phone" label="手机号" width="130"></el-table-column>
                <el-table-column label="典当圈商品" min-width="150">
                    <template scope="scope">
                        <template v-if="dataList.content[scope.$index].machineGoodsType==true">
                            显示
                        </template>
                        <template v-if="dataList.content[scope.$index].machineGoodsType==false">
                            不显示
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="零售价" min-width="150">
                    <template scope="scope">
                        <template v-if="dataList.content[scope.$index].machinePriceType==true">
                            显示
                        </template>
                        <template v-if="dataList.content[scope.$index].machinePriceType==false">
                            不显示
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="备注" min-width="100"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template scope="scope">
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

                <el-form-item label="选择会员" prop="memberId">
                    <el-select v-model="form.memberId" filterable remote placeholder="请输入关键词" :remote-method="remoteMethod" :loading="memberLoading">
                        <el-option v-for="item in memberList" :key="item.pkGlobalId" :value="item.pkGlobalId" :label="item.nickName+' : '+item.phone"></el-option>
                    </el-select>
                </el-form-item>      
                <el-form-item label="自营商品" prop="machineGoodsType">
                    <el-switch v-model="form.machineGoodsType" on-text="" off-text=""></el-switch>
                    <span>（是否显示自营商品）</span>
                </el-form-item>
                <el-form-item label="零售价" prop="machinePriceType">
                    <el-switch v-model="form.machinePriceType" on-text="" off-text=""></el-switch>
                    <span>（是否显示零售价格）</span>
                </el-form-item>
                <el-form-item label="备注" prop="memo">
                    <el-input v-model="form.memo"></el-input>
                </el-form-item>
                <el-form-item label="轮播图">
                    <el-upload  :action="file+'/upload'" list-type="picture-card" :on-remove="handleRemove" :on-success="imgListSuccess">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="add('form')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="修改" :visible.sync="modifyState" size="tiny">
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-width="80px" v-loading="modifyLoading">
               
                <el-form-item label="选择会员" prop="memberId">
                    <el-select v-model="modifyForm.memberId" filterable remote placeholder="请输入关键词" :remote-method="remoteMethod" :loading="memberLoading">
                        <el-option v-for="item in memberList" :key="item.pkGlobalId" :value="item.pkGlobalId" :label="item.nickName+' : '+item.phone"></el-option>
                    </el-select>
                </el-form-item>      
                <el-form-item label="自营商品" prop="machineGoodsType">
                    <el-switch v-model="modifyForm.machineGoodsType" on-text="" off-text=""></el-switch>
                    <span>（是否显示自营商品）</span>
                </el-form-item>
                <el-form-item label="零售价" prop="machinePriceType">
                    <el-switch v-model="modifyForm.machinePriceType" on-text="" off-text=""></el-switch>
                    <span>（是否显示零售价格）</span>
                </el-form-item>
                <el-form-item label="备注" prop="memo">
                    <el-input v-model="modifyForm.memo"></el-input>
                </el-form-item>
                <el-form-item label="轮播图">
                    <el-upload  :action="file+'/upload'" list-type="picture-card" :file-list="modifyImgList" :on-remove="handleRemove" :on-success="imgListSuccess">
                        <i class="el-icon-plus"></i>
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
import api from '../../../util/api'
import ajax from '../../../util/ajax'
export default {
    name: 'dgjList',
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
                images: '',
                memberId: '',
                machineGoodsType: '',
                machinePriceType: '',
                memo:'',
            },
            rules: {
                memberId: [
                    { required: true, message: '请选择会员', trigger: 'blur' }
                ]
            },

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                images: '',
                memberId: '',
                machineGoodsType: '',
                machinePriceType: '',
                memo:'',
            },
            modifyRules: {
                memberId: [
                    { required: true, message: '请选择会员', trigger: 'blur' }
                ]
            },

            memberList: [],
            memberLoading: '',
            imgList: [],
            modifyImgList: [],//修改展示图片列表
            modifyImgId: [],//保存当前有的图片ID
            deleteImgList: [],//删除已上传图片列表
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
            this.fetchData(api.dgjList+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            this.fetchData(api.dgjList+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        add(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.addLoading=true

                    this.form.images=this.imgList.join(',')
                    let _id = this.form.memberId
                    delete this.form.memberId
                    this.form.operator={ 'pkGlobalId':_id }

                    this.subForm(api.dgjList,this.form,(data) => {
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
                this.deleteData(api.dgjList+'/'+data[index].pkGlobalId,'',(data) => {
                    this.reData()
                    this.$message({ type: 'success', message: '删除成功!' })
                })
            }).catch(() => { })
        },
        showModify(index , data) {
            this.modifyImgList=[]
            this.modifyImgId=[]

            this.modifyForm.machineGoodsType=data[index].machineGoodsType
            this.modifyForm.machinePriceType=data[index].machinePriceType
            this.modifyForm.memo=data[index].memo
            this.modifyForm.memberId=data[index].operator.pkGlobalId
            this.modifyForm.images=''
            this.modifyForm.pkGlobalId=data[index].pkGlobalId
            this.memberList.push(data[index].operator)

            if(!!data[index].images){
                let _arr = data[index].images.split(',')
                for(let i in _arr){
                    this.modifyImgList[i]={
                        name: _arr[i],
                        url: api.file+'/'+_arr[i],
                        status: 'finished'
                    }
                    this.modifyImgId.push(_arr[i])
                }
            }

            this.modifyState=true
            console.log(this.modifyImgId)
        },
        modify(modifyForm) {
            this.$refs[modifyForm].validate((valid) => {
                if (valid) {
                    this.modifyLoading=true
                    
                    this.modifyForm.images=this.modifyImgId.join(',')
                    let _id = this.modifyForm.memberId
                    delete this.modifyForm.memberId
                    this.modifyForm.operator={ 'pkGlobalId':_id }
                    console.log(this.modifyForm)
                    this.patchData(api.dgjList+'/'+this.modifyForm.pkGlobalId,this.modifyForm,(data) => {
                        this.modifyState=false
                        this.modifyLoading=false
                        this.reData()
                        this.$message({message: '恭喜你，修改成功',type: 'success'})
                    })

                    this.deleteFile()
                    
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