<style lang="less" scope>
    .paimai-detail{
        width: 414px;
        img{
            width: 414px;
        }
    }
</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <!-- <el-form-item label="">
                        <el-input v-model="nameS" placeholder="商品名称"></el-input>
                    </el-form-item> -->
                    <el-form-item label="">
                        <el-input v-model="brandNameS" placeholder="品牌"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="serialNameS" placeholder="系列"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="typeNameS" placeholder="型号"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="">
                        <el-input v-model="thirdIdS" placeholder="商品ID"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="thirdNameS" clearable placeholder="平台">
                            <el-option label="寺库拍卖" value="寺库拍卖"></el-option>
                            <el-option label="雅昌拍卖" value="雅昌拍卖"></el-option>
                            <el-option label="京东拍卖" value="京东拍卖"></el-option>
                            <el-option label="咸鱼拍卖" value="咸鱼拍卖"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="categoryIdS" clearable placeholder="品类">
                            <el-option label="名表" value="1"></el-option>
                            <el-option label="名包" value="2"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button icon="search" @click="reData">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="exportData">导出</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <template>
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="id" label="编号" width="80"></el-table-column>
                <!-- <el-table-column prop="image" label="商品图片" width="140">
                    <template slot-scope="scope">
                        <img :src="dataList.content[scope.$index].image" style="width: 120px;display: block;margin: 10px 0;">
                    </template>
                </el-table-column> -->
                <el-table-column prop="brandName" label="品牌" width="140"></el-table-column>
                <el-table-column prop="xilei" label="系列" min-width="120"></el-table-column>
                <el-table-column prop="bianhao" label="型号" min-width="120"></el-table-column>
                <el-table-column prop="priceCn" label="公价(元)" width="120">
                    <template slot-scope="scope">
                        <div v-html="dataList.content[scope.$index].priceCn"></div>
                    </template>
                </el-table-column>
                <el-table-column prop="priceCn" label="二手价(元)" width="120">
                    <template slot-scope="scope">
                        <div v-html="'¥ ' + dataList.content[scope.$index].watchPrice.secondPrice"></div>
                    </template>
                </el-table-column>
                <el-table-column prop="priceCn" label="机芯保养价" width="120">
                    <template slot-scope="scope">
                        <div v-html="'¥ ' + dataList.content[scope.$index].watchPrice.maintenancePrice"></div>
                    </template>
                </el-table-column>
                <el-table-column prop="priceCn" label="整体翻新价" width="120">
                    <template slot-scope="scope">
                        <div v-html="'¥ ' + dataList.content[scope.$index].watchPrice.recapPrice"></div>
                    </template>
                </el-table-column>
                <el-table-column prop="watchPrice.editer.name" label="修改人" width="180"></el-table-column>
                <el-table-column prop="watchPrice.updateTime" label="修改时间" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作" width="170">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, dataList.content)">移除</el-button>
                        <el-button type="text" size="small" @click.native.prevent="showModify(scope.$index, dataList.content)">查看</el-button>
                        <el-button type="text" size="small" @click.native.prevent="showModifyP(scope.$index, dataList.content)">改价</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total , prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>
        <el-dialog title="改价" :visible.sync="addState" size="tiny">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" v-loading="addLoading">
   
                <el-form-item label="二手价(元)" prop="">
                    <el-input-number prop="" v-model="form.watchPrice.secondPrice" :controls="false" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="机芯保养价" prop="">
                    <el-input-number prop="" v-model="form.watchPrice.maintenancePrice" :controls="false" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="整体翻新价" prop="">
                    <el-input-number prop="" v-model="form.watchPrice.recapPrice" :controls="false" :min="0"></el-input-number>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="add('form')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="查看" :visible.sync="modifyState" size="large">
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-width="90px" v-loading="modifyLoading">

                <el-form-item label="图片">
                    <div style="width:160px;height:160px;display:inline-block;background-size:contain;background-repeat:no-repeat;background-position:center;margin-right:10px" :style="{backgroundImage: 'url('+modifyForm.oriImgUrl+')'}"></div>
                </el-form-item>  
                <el-form-item label="">
                    {{modifyForm.nameFull}}<br>
                    {{modifyForm.jixinleixin}}{{modifyForm.biaojin}}{{modifyForm.sex}}{{modifyForm.biaokecaizhi}}
                </el-form-item>
                <el-form-item label="基本信息">
                    <el-row>
                        <el-col :span="6"><el-form-item label="编号：">{{modifyForm.bianhao}}</el-form-item></el-col>
                        <el-col :span="6"><el-form-item label="品牌：">{{modifyForm.brandName}}</el-form-item></el-col>
                        <el-col :span="6"><el-form-item label="机芯类型：">{{modifyForm.jixinleixin}}</el-form-item></el-col>
                        <el-col :span="6"><el-form-item label="性别：">{{modifyForm.sex}}</el-form-item></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6"><el-form-item label="价格："><div v-html="modifyForm.priceCn"></div></el-form-item></el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="机芯">
                    <el-row>
                        <el-col :span="6"><el-form-item label="出产厂商：">{{modifyForm.org}}</el-form-item></el-col>
                        <el-col :span="6"><el-form-item label="机芯型号：">{{modifyForm.jixinxinhao}}</el-form-item></el-col>
                        <el-col :span="6"><el-form-item label="机芯厚度：">{{modifyForm.jixinhoudu}}</el-form-item></el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="外观">
                    <el-row>
                        <el-col :span="6"><el-form-item label="表径：">{{modifyForm.biaojin}}</el-form-item></el-col>
                        <el-col :span="6"><el-form-item label="表壳厚度：">{{modifyForm.biaokehoudu}}</el-form-item></el-col>
                        <el-col :span="6"><el-form-item label="表壳材质：">{{modifyForm.biaokecaizhi}}</el-form-item></el-col>
                        <el-col :span="6"><el-form-item label="表盘颜色：">{{modifyForm.biaopangyanse}}</el-form-item></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6"><el-form-item label="表盘形状：">{{modifyForm.biaopanxingzhuang}}</el-form-item></el-col>
                        <el-col :span="6"><el-form-item label="表盘材质：">{{modifyForm.biaopangcaizhi}}</el-form-item></el-col>
                        <el-col :span="6"><el-form-item label="表镜材质：">{{modifyForm.biaojingcaizhi}}</el-form-item></el-col>
                        <el-col :span="6"><el-form-item label="表冠材质：">{{modifyForm.biaoguancaizhi}}</el-form-item></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6"><el-form-item label="表带颜色：">{{modifyForm.biaodaiyanse}}</el-form-item></el-col>
                        <el-col :span="6"><el-form-item label="表带材质：">{{modifyForm.biaodaicaizhi}}</el-form-item></el-col>
                        <el-col :span="6"><el-form-item label="表扣类型：">{{modifyForm.biaokouleixing}}</el-form-item></el-col>
                        <el-col :span="6"><el-form-item label="表扣材质：">{{modifyForm.biaokoucaizhi}}</el-form-item></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6"><el-form-item label="背透：">{{modifyForm.beitou}}</el-form-item></el-col>
                        <el-col :span="6"><el-form-item label="重量：">{{modifyForm.weight}}</el-form-item></el-col>
                        <el-col :span="6"><el-form-item label="防水深度：">{{modifyForm.fangshuishengdu}}</el-form-item></el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="功能">
                    {{modifyForm.gongneng}}
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="goLink(modifyForm.oriUrl)">腕表之家</el-button>
                    <el-button type="primary" @click="modifyState = false">关闭</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import api from '../../util/api'
import ajax from '../../util/ajax'
export default {
    name: 'watchList',
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
                watchPrice: {
                    secondPrice: 0,
                    maintenancePrice: 0,
                    recapPrice: 0,
                }
            },
            rules: {
                memberId: [
                    { required: true, message: '请选择会员', trigger: 'blur' }
                ]
            },

            modifyState: false,
            modifyLoading: false,
            modifyForm: {

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

            nameS: '',
            brandNameS: '',
            serialNameS: '',
            typeNameS: '',
            thirdIdS: '',
            thirdNameS: '',
            categoryIdS: '',
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
            if(this.nameS){
                _searchData+='&name='+this.nameS
            }
            if(this.brandNameS){
                _searchData+='&brandName='+this.brandNameS
            }
            if(this.serialNameS){
                _searchData+='&xilei='+this.serialNameS
            }
            if(this.typeNameS){
                _searchData+='&bianhao='+this.typeNameS
            }
            if(this.thirdIdS){
                _searchData+='&thirdId='+this.thirdIdS
            }
            if(this.thirdNameS){
                _searchData+='&thirdName='+this.thirdNameS
            }
            if(this.categoryIdS){
                _searchData+='&categoryId='+this.categoryIdS
            }
            this.fetchData(api.watchList+'?page='+(this.currentPage-1)+'&size='+this.pageSize + _searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            let _searchData = ''
            if(this.nameS){
                _searchData+='&name='+this.nameS
            }
            if(this.brandNameS){
                _searchData+='&brandName='+this.brandNameS
            }
            if(this.serialNameS){
                _searchData+='&xilei='+this.serialNameS
            }
            if(this.typeNameS){
                _searchData+='&bianhao='+this.typeNameS
            }
            if(this.thirdIdS){
                _searchData+='&thirdId='+this.thirdIdS
            }
            if(this.thirdNameS){
                _searchData+='&thirdName='+this.thirdNameS
            }
            if(this.categoryIdS){
                _searchData+='&categoryId='+this.categoryIdS
            }
            this.fetchData(api.watchList+'?page='+(this.currentPage-1)+'&size='+this.pageSize + _searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        add(form) {

            this.addLoading=true

            this.patchData(api.watchList+'/'+this.form.id,this.form,(data) => {
                this.addLoading=false
                this.addState=false
                this.form = {
                    watchPrice: {
                        secondPrice: 0,
                        maintenancePrice: 0,
                        recapPrice: 0,
                    }
                }
                this.reData()
                this.$message({ message: '恭喜你，保存成功', type: 'success' })
            })

        },
        deleteRow(index , data) {
            this.$confirm('确定删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
                this.deleteData(api.watchList+'/'+data[index].id,'',(data) => {
                    this.reData()
                    this.$message({ type: 'success', message: '删除成功!' })
                })
            }).catch(() => { })
        },
        showModify(index , data) {
            this.modifyForm=data[index]

            this.modifyState=true
        },
        showModifyP(index ,data){
            // console.log(data[index].watchPrice.secondPrice)
            this.form=data[index]
            // this.form.secondPrice=data[index].watchPrice.secondPrice

            this.addState=true
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
                    this.patchData(api.watchList+'/'+this.modifyForm.pkGlobalId,this.modifyForm,(data) => {
                        this.modifyState=false
                        this.modifyLoading=false
                        this.reData()
                        this.$message({message: '恭喜你，修改成功',type: 'success'})
                    })

                    this.deleteFile()
                    
                } else { return false }
            })
        },
        goLink(link){
            window.open(link)
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
        },
        exportData(){
            let _searchData = ''
            if(this.brandNameS){
                _searchData+='&brandName='+this.brandNameS
            }
            if(this.serialNameS){
                _searchData+='&xilei='+this.serialNameS
            }
            if(this.typeNameS){
                _searchData+='&bianhao='+this.typeNameS
            }
            window.open(api.watchList+'/export'+_searchData)
        }
    }
}
</script>