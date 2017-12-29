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
                <el-table-column prop="name" label="名称" min-width="120"></el-table-column>
                <el-table-column prop="price" label="价格" min-width="100"></el-table-column>
                <el-table-column prop="reducePrice" label="当前减免价格" width="130"></el-table-column>
                <el-table-column prop="canIdentify" label="鉴定" width="70">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].canIdentify=='1'">
                            <i class="el-icon-check" style="color:#13ce66"></i>
                        </template>
                        <template v-else>
                            <i class="el-icon-minus"></i>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="canQueryPrice" label="查价" width="70">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].canQueryPrice=='1'">
                            <i class="el-icon-check" style="color:#13ce66"></i>
                        </template>
                        <template v-else>
                            <i class="el-icon-minus"></i>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="validDays" label="有效天数" min-width="100"></el-table-column>
                <el-table-column prop="giftDays" label="赠送天数" min-width="100"></el-table-column>
                <el-table-column prop="memo" label="备注" min-width="100"></el-table-column>
                <el-table-column prop="description" label="描述" min-width="100"></el-table-column>
                <el-table-column prop="isShow" label="显示" min-width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].show=='1'">
                            <i class="el-icon-check" style="color:#13ce66"></i>
                        </template>
                        <template v-else>
                            <i class="el-icon-minus"></i>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" min-width="100"></el-table-column>
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
                <el-form-item label="类型名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="价格(元)" prop="price">
                    <el-input-number v-model="form.price" :min="0" style="width:100%"></el-input-number>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="减免价格" prop="reducePrice">
                    <el-input-number v-model="form.reducePrice" :min="0" style="width:100%"></el-input-number>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="有效天数" prop="validDays">
                    <el-input-number v-model="form.validDays" :min="0" style="width:100%"></el-input-number>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="赠送天数" prop="giftDays">
                    <el-input-number v-model="form.giftDays" :min="0" style="width:100%"></el-input-number>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="form.sort" :min="0" style="width:100%"></el-input-number>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="描述" prop="description">
                    <el-input v-model="form.description"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="Vip类型" prop="type">
                    <el-input-number v-model="form.type" :min="0" style="width:100%"></el-input-number>
                </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="">
                        <el-checkbox label="鉴定" v-model="form.canIdentify"></el-checkbox>
                        <el-checkbox label="查价" v-model="form.canQueryPrice"></el-checkbox>
                        <el-checkbox label="显示" v-model="form.show"></el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注">
                        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.memo"></el-input>
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
                <el-form-item label="类型名称" prop="name">
                    <el-input v-model="modifyForm.name"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="价格(元)" prop="price">
                    <el-input-number v-model="modifyForm.price" :min="0" style="width:100%"></el-input-number>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="减免价格" prop="reducePrice">
                    <el-input-number v-model="modifyForm.reducePrice" :min="0" style="width:100%"></el-input-number>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="有效天数" prop="validDays">
                    <el-input-number v-model="modifyForm.validDays" :min="0" style="width:100%"></el-input-number>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="赠送天数" prop="giftDays">
                    <el-input-number v-model="modifyForm.giftDays" :min="0" style="width:100%"></el-input-number>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="modifyForm.sort" :min="0" style="width:100%"></el-input-number>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="描述" prop="description">
                    <el-input v-model="modifyForm.description"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="Vip类型" prop="type">
                    <el-input-number v-model="modifyForm.type" :min="0" style="width:100%"></el-input-number>
                </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="">
                        <el-checkbox label="鉴定" v-model="modifyForm.canIdentify"></el-checkbox>
                        <el-checkbox label="查价" v-model="modifyForm.canQueryPrice"></el-checkbox>
                        <el-checkbox label="显示" v-model="modifyForm.show"></el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注">
                        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="modifyForm.memo"></el-input>
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
    name: 'vipType',
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
                name :'',
                price :'',
                reducePrice :'',
                validDays :0,
                giftDays :'',
                sort :'',
                description :'',
                canIdentify :'',
                canQueryPrice :'',
                show :'',
                memo :'',
                type: '',
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
                price :'',
                reducePrice :'',
                validDays :0,
                giftDays :'',
                sort :'',
                description :'',
                canIdentify :'',
                canQueryPrice :'',
                show :'',
                memo :'',
                type: '',
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
            this.fetchData(api.vipType+'?page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            this.fetchData(api.vipType+'?page='+(this.currentPage-1)+'&size='+this.pageSize,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        add(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.addLoading=true

                    this.subForm(api.vipType,this.form,(data) => {
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
                this.deleteData(api.vipType+'/'+data[index].pkGlobalId,'',(data) => {
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
                this.modifyForm.price=data[index].price || ''
                this.modifyForm.reducePrice=data[index].reducePrice || ''
                this.modifyForm.validDays=data[index].validDays || ''
                this.modifyForm.giftDays=data[index].giftDays || ''
                this.modifyForm.sort=data[index].sort || ''
                this.modifyForm.description=data[index].description || ''
                this.modifyForm.canIdentify=data[index].canIdentify || ''
                this.modifyForm.canQueryPrice=data[index].canQueryPrice || ''
                this.modifyForm.show=data[index].show || ''
                this.modifyForm.memo=data[index].memo || ''
                this.modifyForm.type=data[index].type || ''

                this.modifyForm.pkGlobalId=data[index].pkGlobalId

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

                    this.patchData(api.vipType+'/'+this.modifyForm.pkGlobalId,this.modifyForm,(data) => {
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